import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthComponent } from './auth.component';
import {TranslationModule} from '../i18n/translation.module';
import { MatListModule } from '@angular/material/list';
import { AlertFlashModule } from '../core/_alert/alert-flash.module';
import { ValidationErrorModule } from '@app/modules/core/validation-error/validation-error.module';
import { DirectivesModule } from '@app/modules/core/directives/directives.module';
import { NgbAlertModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    LoginComponent,
    RegistrationComponent,
    ForgotPasswordComponent,
    LogoutComponent,
    AuthComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatListModule,
    AlertFlashModule,
    ValidationErrorModule,
    DirectivesModule,
    NgbPaginationModule,
    NgbAlertModule,
    NgbModule,

  ]
})
export class AuthModule {}
