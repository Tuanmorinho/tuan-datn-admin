import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AuthService } from '@app/modules/auth';
import { RoleOfUser } from '@app/modules/core/interfaces/interfaces';
import { decryptUsingAES256 } from '@app/modules/core/utils/helpers';

@Component({
  selector: 'app-permission-field',
  templateUrl: './permission-field.component.html',
  styleUrls: ['./permission-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PermissionFieldComponent),
      multi: true
    }
  ],
})
export class PermissionFieldComponent implements ControlValueAccessor {
  @Input() field: string = '';
  @Input() title: string = '';
  @Input() isRequired: boolean = true;
  @Input() formControlName: string = '';
  @Input() formGroup: FormGroup;
  @Input() isView: boolean = false;
  @Input() grayBg: boolean = false;

  @Output() eventRemoveChip = new EventEmitter;
  @Output() eventOpenModal = new EventEmitter;
  constructor(
    private authService: AuthService
  ) { }
  onChange(event) {
  }

  onTouched() { }

  writeValue(files: any): void {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  ngOnInit(): void {}

  removeChipItem(selectedItem: any, formControlName: string, key: string) {
    this.eventRemoveChip.emit({
      selectedItem,
      formControlName,
      key
    })
  }

  onOpenModal(formControlName: string) {
    this.eventOpenModal.emit(
      formControlName
    )
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  isEditable(user: any) {
    if (this.isView) {
      return false;
    }
    if (this.formControlName === 'Author' && user.id === this.formGroup.controls['authorId']?.value) {
      return false;
    }
    if (this.formControlName === 'Checker' && user.id === this.formGroup.controls['checkerId']?.value) {
      return false;
    }
    return true;
  }

  public get roleOfUser(): RoleOfUser {
    const user = this.authService.currentUserValue;
    return decryptUsingAES256(user.userRole);
  }
}
