import { HttpClient } from "@angular/common/http";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  ChangeDetectorRef,
} from "@angular/core";
import { UploadFileService } from "@app/services/upload-file.service";
import { ITableState } from "@app/_metronic/shared/crud-table";
import * as XLSX from "xlsx";
import { ColumnConfig } from "../../table/_models/column.config";
import { TableExcelService } from "./service/excel-sheet.service";
import { saveAs as importedSaveAs } from "file-saver";
import { TemplateModel } from "./model/template";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "environments/environment";

@Component({
  selector: "app-excel-sheet",
  templateUrl: "./excel-sheet.component.html",
  styleUrls: ["./excel-sheet.component.scss"],
})
export class ExcelSheetComponent implements OnInit {
  @ViewChild("inputFileEx") inputFileEx: ElementRef;
  @Input() baseService: any;
  imageUrl: any = "./assets/media/svg/icons/Common/AddFile.svg";
  isOneFile: boolean;
  isExcelFile: boolean;
  isHaveFile: boolean = false;

  columnsConfig: ColumnConfig[] = [];

  errors = [];

  filterItems = [];
  importSuccess = false;

  files: TemplateModel[] = [
    {
      url: `${environment.domain}/assets/template/thuocbvtv-template.xlsx`,
      filename: "thuocbvtv-template.xlsx",
      name: "Template thuốc bảo vệ thực vật",
    },
    {
      url: `${environment.domain}/assets/template/phanbon-template.xlsx`,
      filename: "phanbon-template.xlsx",
      name: "Template phân bón",
    },
    {
      url: `${environment.domain}/assets/template/maymoc-template.xlsx`,
      filename: "maymoc-template.xlsx",
      name: "Template máy móc",
    },
    {
      url: `${environment.domain}/assets/template/xe-template.xlsx`,
      filename: "xe-template.xlsx",
      name: "Template xe cơ giới",
    },
    {
      url: `${environment.domain}/assets/template/gionglua-template.xlsx`,
      filename: "gionglua-template.xlsx",
      name: "Template giống lúa",
    },
    {
      url: `${environment.domain}/assets/template/khachhang-template.xlsx`,
      filename: "khachhang-template.xlsx",
      name: "Template khách hàng",
    },
    {
      url: `${environment.domain}/assets/template/nhacungcap-template.xlsx`,
      filename: "nhacungcap-template.xlsx",
      name: "Template nhà cung cấp",
    },
  ];

  constructor(
    private uploadFileService: UploadFileService,
    public ref: ChangeDetectorRef,
    public tableExcelService: TableExcelService,
    private httpClient: HttpClient,
    public activateModal: NgbActiveModal
  ) {
    this.uploadFileService.clearFiles$.subscribe(() => {
      if (this.inputFileEx?.nativeElement?.value)
        this.inputFileEx.nativeElement.value = "";
    });
  }

  ngOnInit(): void {
    this.tableExcelService.paginator.total = 0;
  }

  onFileChange(event: any) {
    this.replaceFile();
    this.closeAllAlert();

    this.isHaveFile = true;
    let data: any[] = [];
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) {
      this.isOneFile = false;
      this.inputFileEx.nativeElement.value = "";
      throw new Error("Cannot upload multiple files");
    }
    this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);

    if (this.isExcelFile) {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        // read workbook
        const rwb: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(rwb, { type: "binary" });

        // grab first sheet
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        // save data
        data = XLSX.utils.sheet_to_json(ws);
      };

      reader.readAsBinaryString(target.files[0]);

      reader.onloadend = (e) => {
        if (data.length !== 0 && data.length <= 300) {
          this.closeAllAlert();
          data = data.map((v, index) => {
            return {
              ...v,
              index: index,
            };
          });

          this.tableExcelService.paginator.page = 1;
          this.tableExcelService.paginator.pageSize = 10;
          this.tableExcelService.paginator.total = data.length;

          this.tableExcelService.items = data.slice(0, 10);

          this.tableExcelService.itemsFilter(data);
          this.filterItems = data;
          const key = Object.keys(data[0]);
          const columns = [];
          key.forEach((v) => {
            if (v.toString() !== "index") {
              columns.push({
                label: v.toString(),
                dataKey: v.toString(),
                sort: false,
                minWidth: 140,
              });
            }
          });
          this.columnsConfig = columns;
        } else if (data.length > 300) {
          this.errors.push("File không được quá 300 dòng!");
        }
         else {
          this.errors.push("File không có data!");
        }
      };
    } else {
      this.inputFileEx.nativeElement.value = "";
    }
  }

  sort(state: ITableState) {
    if (state.paginator) {
      this.tableExcelService.itemsFilter$.subscribe((items) => {
        this.tableExcelService.items = items.slice(
          (state.paginator.page - 1) * state.paginator.pageSize,
          state.paginator.page * state.paginator.pageSize
        );
      });
    }
  }

  removeFile() {
    this.isHaveFile = false;
    this.inputFileEx.nativeElement.value = "";
    this.tableExcelService.items.splice(0, this.tableExcelService.items.length);
    this.columnsConfig.splice(0, this.columnsConfig.length);
    this.closeAllAlert();
  }

  replaceFile() {
    this.tableExcelService.items.splice(0, this.tableExcelService.items.length);
    this.columnsConfig.splice(0, this.columnsConfig.length);
    this.tableExcelService.paginator.total = 0;
  }

  importAll() {
    this.baseService.importExcel(this.filterItems).subscribe(
      (_) => {
        this.removeFile();
        this.baseService.fetch();
        this.importSuccess = true;
      },
      (err) => {
        this.errors.push(err.error.message);
      }
    );
  }

  importRow(data) {
    this.baseService.importExcel([data]).subscribe(
      (_) => {
        this.delete(data);
        this.baseService.fetch();
        this.importSuccess = true;
      },
      (err) => {
        this.errors.push(err.error.message);
      }
    );
  }

  delete(data) {
    this.tableExcelService.itemsFilter$.subscribe((v) => {
      const index = v.findIndex((v) => v?.index === data?.index);
      v.splice(index, 1);
      this.filterItems = v;
      const state = this.tableExcelService;
      this.tableExcelService.items = v.slice(
        (state.paginator.page - 1) * state.paginator.pageSize,
        state.paginator.page * state.paginator.pageSize
      );
      this.tableExcelService.paginator.total = v.length;
      if (v.length === 0) {
        this.removeFile();
      }
    });
  }

  choosedTemplate(template) {
    this.downloadTemplate(template);
  }

  downloadTemplate(template) {
    if (template?.url) {
      this.httpClient
        .get(template.url, { responseType: "blob" })
        .subscribe((v) => {
          importedSaveAs(v, template.filename);
        });
    }
  }

  closeAlert(index: number) {
    this.errors.splice(index, 1);
    this.removeFile();
  }

  closeAllAlert() {
    this.errors.splice(0, this.errors.length);
  }
}
