// tslint:disable:no-string-literal
// https://codecraft.tv/courses/angular/unit-testing/model-driven-forms/
import {
  waitForAsync,
  ComponentFixture,
  TestBed,
  getTestBed,
} from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';
import { UserModel } from '../_models/user.model';
import { LogoutComponent } from '../logout/logout.component';
import { TranslationModule } from '../../i18n/translation.module';
import { TranslateModule } from '@ngx-translate/core';
const mockActivatedRoute = {
  snapshot: {
    params: {},
    queryParams: {},
  },
};

const routes: Routes = [
  { path: '/signin', component: LoginComponent },
  { path: '/signout', component: LogoutComponent },
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
];


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let injector;
  let authService: AuthService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        RouterModule.forRoot(routes),
        TranslateModule.forRoot(),
      ],
      declarations: [LoginComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute,
        },
        {
          provide: AuthService,
          useClass: AuthService,
        },
      ],
    }).compileComponents();

    injector = getTestBed();
    authService = injector.get(AuthService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form valid with default data', () => {
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('username field validity', () => {
    let errors = {};
    const username = component.loginForm.controls.username;
    expect(username.valid).toBeTruthy();

    // Email field is required
    // Set empty email first
    username.setValue('');
    errors = username.errors || {};
    // tslint:disable-next-line:no-string-literal
    expect(errors['required']).toBeTruthy();

    // Set email to something
    username.setValue('te');
    errors = username.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['minlength']).toBeTruthy();

    // Set email to something correct
    username.setValue('test@example.com');
    errors = username.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['minlength']).toBeFalsy();
    expect(errors['maxlength']).toBeFalsy();
  });

  it('password field validity', () => {
    let errors;
    const password = component.loginForm.controls['password'];
    expect(password.valid).toBeTruthy();
    password.setValue('12');
    expect(password.value).toBe('12');
    errors = password.errors || {};
    expect(errors['minlength']).toBeTruthy();

    password.setValue('');
    expect(password.value).toBe('');
    expect(password.valid).toBeFalsy();
    errors = password.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set password to something correct
    password.setValue('123456789');
    errors = password.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['minlength']).toBeFalsy();
    expect(errors['maxlength']).toBeFalsy();
  });
});
