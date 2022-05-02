import { Component, Input, OnInit } from "@angular/core";
import { TableExcelService } from "../../service/excel-sheet.service";

@Component({
  selector: "app-action-excel-cell",
  templateUrl: "./action-excel-cell.component.html",
  styleUrls: ["./action-excel-cell.component.scss"],
})
export class ActionExcelCellComponent implements OnInit {
  @Input() prop: any;

  constructor(public tableExcelService: TableExcelService) {}

  ngOnInit(): void {}

  delete(prop) {
    this.tableExcelService.itemsFilter$.subscribe((v) => {
      const index = v.findIndex(
        (v) => v?.index === prop?.index
      );
      v.splice(index, 1);
      const state = this.tableExcelService;      
      this.tableExcelService.items = v.slice((state.paginator.page - 1) * state.paginator.pageSize, state.paginator.page * state.paginator.pageSize);
      this.tableExcelService.paginator.total = v.length;
    });
  }

  importExcel(prop) {
    
  }
}
