import { BaseComponent } from "@app/modules/core/base/base.component";
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from "@angular/core";
import { ComponentService } from "@app/services/component.service";
import { UploadFileService } from '@app/services/upload-file.service';
import { InitDataService } from "@app/services/init-data.service";
import { OffcanvasService } from '@app/services/offcanvas.service';
@Component({
  selector: "[app-house-hold-item]",
  templateUrl: "./house-hold-item.component.html",
  styleUrls: ["./house-hold-item.component.scss"],
})
export class HouseHoldItemComponent extends BaseComponent {
  @Input() member: any;
  @Input() index: number = 0;

  @Output() detailEvent = new EventEmitter();
  @Output() updateEvent = new EventEmitter();

  initData: any = [];
  imageUrl: any = "./assets/media/svg/icons/Common/Group.svg";


  constructor(
    protected service: ComponentService,
    public initDataService: InitDataService,
    protected uploadFileService: UploadFileService,
    public ref: ChangeDetectorRef,
    private offcanvasService: OffcanvasService
  ) {
    super(service);
  }

  ngOnInit(): void {
    this.initDataService.getInitDataHouseHold().subscribe((s: any) => {
      this.ref.detectChanges();
    });
    this.member.bankAccounts = this.member.bankAccounts.map(v => {
      return {
        ...v, 
        bankName: v.bank?.name || v.bank?.value
      }
    })

    if (this.member.avatar?.key) {
      const bucket = this.member.avatar?.bucket ? this.member.avatar?.bucket : '';
      const fileName = this.member.avatar?.key ? this.member.avatar?.key : '';
      this.uploadFileService.downloadFile(bucket, fileName).subscribe(v => {
        if (v) {
          this.imageUrl = v;
          this.ref.detectChanges();
        }
      })
    }
    if (this.member.avatar) {
      if (this.member.avatar[0] instanceof File) {
        this.createImageFromBlob(this.member.avatar[0]);
      }
    }
  }


  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageUrl = reader.result;
      this.ref.detectChanges();
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  onUpdate() {
    this.updateEvent.emit({
      index: this.index,
      member: this.member
    });
  }

  onDetail() {
    this.detailEvent.emit({
      index: this.index,
      member: this.member
    });
  }

}
