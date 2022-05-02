import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ComponentService } from '@app/services/component.service';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-comment-table-view',
  templateUrl: './comment-table-view.component.html',
  styleUrls: ['./comment-table-view.component.scss']
})
export class CommentTableViewComponent extends BaseComponent implements OnChanges {
  @Input() comments = [];
  constructor(
    protected service: ComponentService,
  ) {
    super(service)
  }
  ngOnChanges(changes: SimpleChanges): void {
   
  }

  ngOnInit(): void {
    
  }
}
