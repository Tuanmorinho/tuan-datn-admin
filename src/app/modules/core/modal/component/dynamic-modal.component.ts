import { Component, Input, OnInit } from '@angular/core';
import { FieldConfig } from '@app/modules/form/models/field.interface';
import { DynamicService } from '@app/services/dynamic.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'dynamic-modal',
  templateUrl: './dynamic-modal.component.html',
  styleUrls: ['./dynamic-modal.component.scss']
})
export class DynamicModalComponent implements OnInit {
  @Input() id: number;
  @Input() regConfig: FieldConfig[];
  @Input() title : string;
  
  isLoading = false;

  constructor(public modal: NgbActiveModal,private dynamicService: DynamicService) { 
  }

  ngOnInit() {
  }

  ngOnChanges(changes: any): void {
  }

  save(){
    this.dynamicService.submitForm();
  }

  submit(event){
  }

}
