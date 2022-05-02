import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators,
} from "@angular/forms";
import { uploadFilesValidator } from "@app/modules/core/reusable-components/_validators/upload-files.validator";
import { UploadFileService } from "@app/services/upload-file.service";

type UPLOAD_TYPE = "image" | "file" | "file_styled";

@Component({
  selector: "app-upload-files",
  templateUrl: "./upload-files.component.html",
  styleUrls: ["./upload-files.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadFilesComponent),
      multi: true,
    },
  ],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadFilesComponent implements ControlValueAccessor {
  @ViewChild("input") inputFile: ElementRef;
  listFile: any[] = [];
  listImg: any[] = [];
  @Input() validTypeFiles: string[] = [
    "pdf",
    "docx",
    "doc",
    "xls",
    "xlsx",
    "jpg",
    "jpeg",
    "png",
    "zip",
    "ppt",
    "pptx",
  ];
  @Input() acceptFiles: string = "";
  @Input() maxLength: number = Number.MAX_SAFE_INTEGER;
  @Input() maxSize: number = 20; //Mb
  @Input() formControlName: string;
  @Input() formGroup: FormGroup;
  @Input() isRequired: boolean = false;
  @Input() field: string;
  @Input() isView: boolean = false;
  @Input() progress: number = 0;
  @Input() fileContainerStyle: any;
  @Input() customLabelStyle: any;
  @Input() isDisabled: boolean = false;
  @Input() uploadType: UPLOAD_TYPE = "file";
  @Input() multiImage: boolean = false;
  @Output() urlImage = new EventEmitter<any>();

  imageUrl: any = "./assets/media/svg/icons/Common/Group.svg";
  imageUrl2: any = "./assets/media/svg/icons/Common/AddFile.svg";
  constructor(
    private uploadFileService: UploadFileService,
    public ref: ChangeDetectorRef
  ) {
    this.uploadFileService.clearFiles$.subscribe(() => {
      if (this.inputFile?.nativeElement?.value)
        this.inputFile.nativeElement.value = "";
    });
  }

  ngOnInit(): void {
    this.listFile = this.fControl.value;
    this.formGroup.valueChanges.subscribe((v) => {
      if (v?.photo) {
        this.imageUrl = v.photo;
        this.ref.detectChanges();
      }
      if (v?.photos) {
        this.imageUrl = v?.photos[0];
        this.listImg = v?.photos;
        this.ref.detectChanges();
      }
    });

    if (this.isRequired) {
      this.fControl.setValidators(Validators.required);
      this.fControl.updateValueAndValidity();
    }
  }

  get value() {
    return this.formGroup.value;
  }

  get fControl() {
    return this.formGroup.controls[this.formControlName];
  }

  ngOnChanges(changes): void { }

  onChange(event) { }

  onTouched() { }

  writeValue(files: any): void {
    this.listFile = Object.assign([], files);
    this.ref.detectChanges();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onFilesChange(files) {
    let types = [];
    let uniqId = new Date().getTime();
    let fileArr = [];
    let oversize: boolean = false;

    const listFiles = this.fControl.value ? this.fControl.value : [];

    for (var i = 0; i < files.length; i++) {
      if (files[i].size > this.maxSize * 1048576) {
        oversize = true;
      }
      types.push(this.uploadFileService.normalizedFileTypes(files[i].name));
      files[i].id = uniqId + i;
      fileArr.push(files[i]);
    }

    this.fControl.setValidators([
      uploadFilesValidator(
        files.length + listFiles.length > this.maxLength,
        this.compareInValidTypes(types),
        oversize,
        this.isRequired
      ),
    ]);
    this.fControl.updateValueAndValidity();

    this.fControl.markAsTouched();
    this.fControl.markAsDirty();

    this.formGroup.patchValue({
      [this.formControlName]: listFiles ? listFiles.concat(fileArr) : fileArr,
    });

    this.ref.detectChanges();

    if (this.uploadType === "image") {
      if (this.multiImage) {
        for (var i = 0; i < files.length; i++) {
          let reader = new FileReader(); // HTML5 FileReader API
          let file = files[i];
          if (files && files[i]) {
            reader.readAsDataURL(file);
            reader.onload = () => {
              this.imageUrl = reader.result;
              this.listImg.push(reader.result);
              this.ref.detectChanges();
            };
          }
        }
      } else {
        let reader = new FileReader(); // HTML5 FileReader API
        let file = files[0];
        if (files && files[0]) {
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.imageUrl = reader.result;
            this.ref.detectChanges();
          };
        }
        this.formGroup.patchValue({
          [this.formControlName]: fileArr,
        });
      }
    }
  }

  compareInValidTypes(types) {
    if (this.validTypeFiles.length === 0 || types.length === 0) return false;
    return types.some((type) => !this.validTypeFiles.includes(type));
  }

  onRemoveFile(selectedDoc) {
    this.listFile = this.listFile.filter((doc) => doc.id != selectedDoc.id);
    if (this.isRequired && this.listFile.length === 0) {
      this.fControl.setValidators(Validators.required);
    }
    this.formGroup.patchValue({
      [this.formControlName]: this.fControl.value?.filter(
        (file) => file.id != selectedDoc.id
      ),
    });
    this.fControl.markAsTouched();
    this.checkValidators();
    this.fControl.updateValueAndValidity();
    this.ref.detectChanges();
  }

  checkValidators() {
    let types = [];
    let oversize: boolean = false;

    for (var i = 0; i < this.fControl.value.length; i++) {
      if (this.fControl.value[i]?.size > this.maxSize * 1048576) {
        oversize = true;
        return;
      }
      types.push(
        this.uploadFileService.normalizedFileTypes(this.fControl.value[i].name)
      );
    }

    if (oversize) return;
    try {
      if (
        this.fControl.value?.length <= this.maxLength &&
        !this.compareInValidTypes(types)
      ) {
        this.fControl.clearValidators();
        if (this.isRequired) this.fControl.setValidators(Validators.required);
        this.fControl.setErrors(null);
      }
    } catch (err) { }
  }

  isControlInvalid(): boolean {
    const control = this.fControl;
    return control.invalid && (control.dirty || control.touched);
  }

  showImg(e) {
    this.imageUrl = e;
    this.ref.detectChanges();
  }

  removeImg(i) {
    this.listImg.splice(i, 1);
    this.listFile.splice(i, 1);
    this.formGroup.patchValue({
      [this.formControlName]: this.listFile,
    });
    this.ref.detectChanges();
    if (this.listFile.length) {
      if (this.listFile[0] instanceof File) {
        let reader = new FileReader();
        reader.onload = () => {
          this.imageUrl = reader.result;
          this.ref.detectChanges();
        };
        reader.readAsDataURL(this.listFile[0]);
      } else {
        this.imageUrl = this.listImg[0];
      }
    } else {
      this.imageUrl = "./assets/media/svg/icons/Common/Group.svg";
    }
  }

  deleteSingleFile() {
    this.imageUrl = './assets/media/svg/icons/Common/Group.svg';
    this.formGroup.patchValue({
      [this.formControlName]: null,
    });
  }

  onfileInput() {
    let element: HTMLElement = document.querySelector('input[id="imageUpload"]') as HTMLElement;
    element.click();
  }
}
