import { formatDate } from "@angular/common";
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { BaseComponent } from "@app/modules/core/base/base.component";
import { compareDates } from "@app/modules/core/utils/helpers";
import { ComponentService } from "@app/services/component.service";
import { FarmingContractsService } from "@app/services/farming-contracts.service";
import { HouseholdService } from "@app/services/household.service";
import { InitDataService } from "@app/services/init-data.service";
import { UploadFileService } from "@app/services/upload-file.service";
import { min } from "moment";

@Component({
  selector: "app-edit-farming-contracts",
  templateUrl: "./edit-farming-contracts.component.html",
  styleUrls: ["./edit-farming-contracts.component.scss"],
})
export class EditFarmingContractsComponent extends BaseComponent implements OnDestroy {
  isLoading$: any;
  household: any[] = [];
  initData: any;
  bankAccounts = [];
  isShowHousehold = false;
  queryParamHouseholdId: any;
  contractId: number;

  constructor(
    protected service: ComponentService,
    public contractsService: FarmingContractsService,
    public householdService: HouseholdService,
    private initDataService: InitDataService,
    public ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private uploadService: UploadFileService,
    private route: ActivatedRoute
  ) {
    super(service);
    this.isLoading$ = this.contractsService.isLoading$;
  }
  ngOnInit() {
    const id = this.routeParams['id'];
    this.service.subheaderService.updateBreadcrumbs(
      [
        {
          title: "Danh sách hợp đồng canh tác",
          linkPath: '/farm-management/farming-contract',
        },
        {
          title: id ? "Sửa hợp đồng canh tác" : "Thêm hợp đồng canh tác",
          linkPath: this.router.url,
        },
      ],
      "Trang chủ",
      [
        {
          name: "Hủy",
          class: "btn btn-outline-secondary mr-2",
          url: "/farm-management/farming-contract",
        },
        {
          name: "Lưu",
          class: "btn btn-primary",
          url: "#",
          isEvent: true,
          type: 'submit',
        },
      ],
      id ? 'Sửa hợp đồng canh tác' : "Thêm hợp đồng canh tác"
    );
    this.subscription = this.service.subheaderService.eventEmit.subscribe(v => {
      if (v === 'submit') {
        this.onSubmit();
      }
    })
    this.queryParamHouseholdId = this.route.snapshot.queryParamMap.get('householdId');
    this.initDataService.getInitDataHouseHold().subscribe((v: any) => {
      this.initData = v;
    });
    this.householdService.getHouseholdList().subscribe((v: any) => {
      this.household = v.data;
    });
    this.formGroup = this.fb.group({
      id: [],
      code: [],
      householdId: [,Validators.required],
      startDate: [,Validators.required],
      endDate: [,Validators.required],
      paymentPriceWithoutTax: [,[Validators.required, Validators.min(0)]],
      taxPercent: [,[Validators.required,Validators.min(0)]],
      paymentCurrencyType: [,Validators.required],
      paymentPriceWithTax: [],
      paymentType: [,Validators.required],
      paymentBankAccountId: [],
      relatedPapers: [,Validators.required],
      status: []
    });

    this.formGroup.get('paymentPriceWithoutTax').valueChanges.subscribe(x => {
      let taxPercent = this.formGroup.get('taxPercent').value;
      if(taxPercent) {
        let payment = parseInt(x) + (x*parseInt(taxPercent))/100; 
        this.formGroup.get('paymentPriceWithTax').setValue(payment);
      }
    });

    this.formGroup.get('taxPercent').valueChanges.subscribe(x => {
      let withoutTax = this.formGroup.get('paymentPriceWithoutTax').value;
      if(withoutTax) {
        let payment = parseInt(withoutTax) + (x*parseInt(withoutTax))/100; 
        this.formGroup.get('paymentPriceWithTax').setValue(payment);
      }
    });

    this.formGroup.get('paymentType').valueChanges.subscribe(x => {
      if(x === 'ON_ACCOUNT') {
        this.formGroup.get('paymentBankAccountId').setValidators(Validators.required);
      } else {
        this.formGroup.get('paymentBankAccountId').clearValidators();
      }
      this.formGroup.get('paymentBankAccountId').updateValueAndValidity();
    });

    if (this.queryParamHouseholdId) {
      this.formGroup.patchValue({
        householdId: Number(this.queryParamHouseholdId)
      });
    }

    if (id) {
      this.contractId = Number(id);
      this.contractsService.getItemById(Number(id)).subscribe((v: any) => {
        this.formGroup.patchValue({
          ...v,
          householdId: v.household?.id,
          paymentBankAccountId: v?.paymentBankAccount?.id
        });
        this.ref.detectChanges();
        this.selectHouseHold({id: v.household?.id});
      })
    }
  }

  get v() {
    return this.formGroup.value;
  }

  get f() {
    return this.formGroup.controls;
  }

  selectHouseHold(data: any) {
    this.householdService.getHouseholdById(data.id).subscribe((v: any) => {
      v.members.forEach(v1 => {
        this.bankAccounts.push(...v1.bankAccounts);
      });
      this.bankAccounts = this.bankAccounts.map(v3 => {
        return {
          ...v3,
          bankName: v3.bank.name.concat(" - ", v3.number, " - ", v3.name)
        }
      });
      this.ref.detectChanges();
    });
  }

  dateValidator() {
    if (!this.f.startDate.value || !this.f.endDate.value) return;
    if (compareDates(this.f.startDate.value, this.f.endDate.value)) {
      this.formGroup.controls["startDate"].setErrors({ incorrectDate: true });
    } else {
      this.formGroup.get("startDate").clearValidators();
      this.formGroup.get("startDate").updateValueAndValidity();
    }
  }

  async onSubmit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) {
      return;
    }

    // upload file
    let relatedPapers = [];
    this.contractsService.isLoading = true;
    try {
      for (const item of this.v.relatedPapers) {
        const file: any = await this.uploadService.uploadFile(item);
        relatedPapers.push({
          bucket: file?.bucket,
          key: file?.key,
          name: file?.name,
          uploadTime: file?.uploadTime,
          type: 'CONTRACT_DOCUMENT',
        })
      }
    } catch (error) {
      this.contractsService.isLoading = false;
    }

    this.formGroup.patchValue({
      relatedPapers
    })

    let data = {
      ...this.v,
      startDate: this.v.startDate ? formatDate(this.v.startDate, 'yyyy-MM-dd', 'vi_VI') : '',
      endDate: this.v.endDate ?  formatDate(this.v.endDate, 'yyyy-MM-dd', 'vi_VI') : '',
      paymentBankAccountId: this.v.paymentBankAccountId
    }
    
    if(this.v.paymentType === 'CASH') {
      delete data.paymentBankAccountId
    }

    if (this.routeParams.id) {
      this.contractsService.update(data).subscribe(_ => {
        this.service.alertFlashService.success(['Cập nhật hợp đồng thành công'], this.optionsAlert);
        this.router.navigate(['/farm-management/farming-contract'])
      }, error => {
        this.showError(error, this.ref);
      })
    } else {
      this.contractsService.create(data).subscribe(_ => {
        this.service.alertFlashService.success(['Tạo hợp đồng thành công'], this.optionsAlert);
        this.router.navigate(['/farm-management/farming-contract'])
      }, error => {
        this.showError(error, this.ref);
      })
    }
  }
}
