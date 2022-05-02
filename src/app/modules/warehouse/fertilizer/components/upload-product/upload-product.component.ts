import { FertilizerService } from '@app/services/fertilizer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-upload-product',
  templateUrl: './upload-product.component.html',
  styleUrls: ['./upload-product.component.scss']
})
export class UploadProductComponent implements OnInit {

  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    public modalService: NgbActiveModal,
    public fertilizerService: FertilizerService
  ) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      relatedPapers: [,Validators.required]
    });
  }

  downloadForm() {
    
  }

  onSubmit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.value.relatedPapers) {

    } else {
      this.modalService.close(false);
    }
  }
}
