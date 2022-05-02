import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertFlashService } from '@app/services/alert-flash.service';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService, UserModel, ConfirmPasswordValidator } from '../../auth';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  user: UserModel;
  firstUserState: UserModel;
  subscriptions: Subscription[] = [];
  pattern: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$';
  isLoading$: Observable<boolean>;
  hasUppercase: boolean = false;
  hasSpecialChar: boolean = false;
  hasMinLength: boolean = false;

  showPasswordOld: boolean = false;
  showPasswordNew: boolean = false;
  showPasswordConfirm: boolean = false;

  constructor(private userService: AuthService, private fb: FormBuilder, private alert: AlertFlashService) {
    this.isLoading$ = this.userService.isLoading$;
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      newPassword: ['', Validators.compose([Validators.required, Validators.pattern(this.pattern)])],
      confirmNewPassword: ['', Validators.required]
    }, {
      validator: Validators.compose([ConfirmPasswordValidator.MatchPassword])
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }
    const data = {
      type: "password",
      value: this.formGroup.value.newPassword,
      temporary: false
    };
    this.alert.clear();
    const cps = this.userService.changePassword(data).subscribe(res => {
      this.alert.success(['Cập nhật mật khẩu thành công'], {
        autoClose: true,
        keepAfterRouteChange: false
      });
    }, error => {
      this.alert.error(error, {
        autoClose: true,
        keepAfterRouteChange: false
      })
    })

    this.subscriptions.push(cps);
  }

  cancel() {
    this.user = Object.assign({}, this.firstUserState);
  }

  onChange(str) {
    if (/[A-Z]/.test(str)) this.hasUppercase = true;
    else this.hasUppercase = false;

    if (/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(str)) this.hasSpecialChar = true;
    else this.hasSpecialChar = false;

    if (str.length >= 6) this.hasMinLength = true;
    else this.hasMinLength = false;
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
