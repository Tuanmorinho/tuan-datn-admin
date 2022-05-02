import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { InitDataService } from '@app/services/init-data.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  @Input() title: string;
  @Input() isRequire: boolean = false;
  @Input() formControlNameCountry: string;
  @Input() formControlNameProvince: string;
  @Input() formControlNameDistrict: string;
  @Input() formControlNameWard: string;
  @Input() addressDetail: string;

  @Input() formGroup: FormGroup;
  @Input() countryList = [];

  @Input() addressType: number = 0;

  provinceList: any = [];
  districtList: any = [];
  wardList: any = [];

  constructor(
    private initDataService: InitDataService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.formGroup.addControl('permanentCountry', new FormControl(null));
    this.formGroup.addControl('permanentProvince', new FormControl(null));
    this.formGroup.addControl('permanentDistrict', new FormControl(null));
    this.formGroup.addControl('permanentWard', new FormControl(null));
    this.formGroup.addControl('temporaryCountry', new FormControl(null));
    this.formGroup.addControl('temporaryProvince', new FormControl(null));
    this.formGroup.addControl('temporaryDistrict', new FormControl(null));
    this.formGroup.addControl('temporaryWard', new FormControl(null));
  }

  /**
   * 
   * @param data 
   * @param type (0: country, 1: province, 2: district)
   * @param typeAddress(0: permanent, 1: temporary)
   */
  selectAdress(data, type: number = 0, typeAddress: number = 0) {
    if (typeAddress === 0) {
      switch (type) {
        case 0:
          this.formGroup.patchValue({
            permanentCountry: data
          }); break;
        case 1:
          this.formGroup.patchValue({
            permanentProvince: data
          }); break;
        case 2:
          this.formGroup.patchValue({
            permanentDistrict: data
          }); break;
        case 3:
          this.formGroup.patchValue({
            permanentWard: data
          }); break;
      }
    }
    if (typeAddress === 1) {
      switch (type) {
        case 0:
          this.formGroup.patchValue({
            temporaryCountry: data
          }); break;
        case 1:
          this.formGroup.patchValue({
            temporaryProvince: data
          }); break;
        case 2:
          this.formGroup.patchValue({
            temporaryDistrict: data
          }); break;
        case 3:
          this.formGroup.patchValue({
            temporaryWard: data
          }); break;
      }
    }
    if (data) {
      this.initDataService.getInitDataDetailHousehold(data.id).subscribe(x => {
        if (type === 0) {
          this.provinceList = x;
        }
        if (type === 1) {
          this.districtList = x;
        }
        if (type === 2) {
          this.wardList = x;
        }
        this.ref.detectChanges();
      })
    }
  }

  /**
   * 
   * @param type (0: country, 1: province, 2: district)
   */
  clearData(type: number = 0) {
    if (type === 0) {
      this.formGroup.patchValue({
        [this.formControlNameProvince]: null,
        [this.formControlNameDistrict]: null,
        [this.formControlNameWard]: null,
      });
    }
    if (type === 1) {
      this.formGroup.patchValue({
        [this.formControlNameDistrict]: null,
        [this.formControlNameWard]: null,
      });
    }
    if (type === 2) {
      this.formGroup.patchValue({
        [this.formControlNameWard]: null,
      });
    }
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
}
