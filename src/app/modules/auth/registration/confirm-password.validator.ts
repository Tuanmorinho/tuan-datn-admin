import { AbstractControl } from '@angular/forms';

export class ConfirmPasswordValidator {
  /**
   * Check matching password with confirm password
   * @param control AbstractControl
   */
  static MatchPassword(control: AbstractControl) {
    const password = control.get('newPassword').value;

    const confirmPassword = control.get('confirmNewPassword').value;

    if (password !== confirmPassword) {
      control.get('confirmNewPassword').setErrors({ ConfirmPassword: true });
    } else {
      return null;
    }
  }

  static ComparePassword(control: AbstractControl) {
    const password = control.get('currentPassword').value;

    const newPassword = control.get('newPassword').value;

    if (password === newPassword) {
      control.get('newPassword').setErrors({ ComparePassword: true });
    } else {
      return null;
    }
  }
}
