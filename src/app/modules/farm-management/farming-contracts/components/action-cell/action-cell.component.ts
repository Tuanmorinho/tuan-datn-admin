import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@app/modules/core/base/base.component';
import { DeleteModalComponent } from '@app/modules/core/delete-modal/delete-modal.component';
import { ComponentService } from '@app/services/component.service';
import { FarmingContractsService } from '@app/services/farming-contracts.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-farming-contract-action-cell',
  templateUrl: './action-cell.component.html',
  styleUrls: ['./action-cell.component.scss']
})
export class FarmingContractActionCellComponent extends BaseComponent implements OnInit {
  @Input() prop: any;

  constructor(
    protected service: ComponentService,
    public ref: ChangeDetectorRef,
    private modalService: NgbModal,
    public contractsService: FarmingContractsService,

  ) {
    super(service);

  }

  ngOnInit(): void {
  }
}
