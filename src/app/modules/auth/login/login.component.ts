import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserModel } from '../_models/user.model';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ComponentService } from '@app/services/component.service';
import { BaseComponent } from '@app/modules/core/base/base.component';
import { AlertFlashService } from '@app/services/alert-flash.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  errorMessage: string = 'Something wrong';
  isLoading$: Observable<boolean>;

  showPass: boolean = false;

  // private fields
  private unsubscribe: Subscription[] = [];

  constructor(
    protected service: ComponentService,
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    public alertService: AlertFlashService
  ) {
    super(service);
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      username: ['',
        Validators.compose([
          Validators.required,
        ]),
      ],
      password: ['',
        Validators.compose([
          Validators.required,
        ]),
      ],
    });
  }

  submit() {
    this.loginForm.markAllAsTouched();
    this.alertService.clear();
    if (this.loginForm.controls['username'].invalid || this.loginForm.controls['password'].invalid) return;
    this.hasError = false;
    const loginSubscr = this.authService
      .login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe((user: UserModel) => {
        if (user) {
          this.router.navigate([this.returnUrl], { replaceUrl: true });
        } else {
          this.hasError = true;
          this.errorMessage = 'Username hoặc Password không đúng!'
        }
      }, (error) => {
        this.hasError = true;
        this.alertService.error(error, {
          autoClose: false,
          keepAfterRouteChange: false
        });
      });
    this.unsubscribe.push(loginSubscr);
  }

  isControlValid(controlName: string): boolean {
    const control = this.loginForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.loginForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
