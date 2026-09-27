import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { LanguageTranslateService } from 'src/app/@shared/services/language_translate/language-translate.service';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ShiftServiceService } from 'src/app/@shared/services/service/hrmServices/shift-service.service';
import { HolidayCreateComponent } from '../holiday-create/holiday-create.component';
import { ActionStatusComponent } from './action/action-status/action-status.component';
import { ActionComponent } from './action/action.component';
import { holidayServiceService } from 'src/app/@shared/services/service/hrmServices/holiday-service.service ';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-holiday-list',
  templateUrl: './holiday-list.component.html',
  styleUrls: ['./holiday-list.component.scss']
})
export class HolidayListComponent {
  constructor(
    private service :holidayServiceService,
    private _commonService: CommonService,
    private _rbackService: RbacMasterService,
    public mtdialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private language_service: LanguageTranslateService) { }

  ngOnInit() {
    this.languageSwitch();
    this.get_All_holiday();
    this. getColumnHeaderTranslations();
    this.updateColumnDefs();
  }

  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  entity_id: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple', };
  rowData: any=[];
  count: any = 0;
  assignAction: any;
  languageFlag: 'en' | 'pt' = 'en';
  columnDefs: any
  private languageSubject = new BehaviorSubject<'en' | 'pt'>('en');
  language$ = this.languageSubject.asObservable();
  translations = {
    en: {
      pageTitle: 'HRMS',
      master: 'HOLIDAY',
      masterTable: 'Holiday List',
      placeholder: 'Search',
      addButton: 'Add'
    },
    pt: {
      pageTitle: 'Mestre de Configuração',
      master: 'Departamento',
      masterTable: 'Lista de Departamentos',
      placeholder: 'Pesquisar',
      addButton: 'Adicionar',
    }
  };


  private getColumnHeaderTranslations() {
    return {
      en: {
        sno: 'S.NO',
        holiday_name: 'Holiday Name',
        date: 'Date',
        company_branch: 'Entity Name',
        action: 'Action',
        status : 'Status'
      },
      pt: {
        sno: 'Nº',
        holiday_name: 'feriado',
        date: 'Data',
        company_branch: 'Estado',
        status:'Status',
        action: 'Ação',

      }
    };
  }
  languageSwitch() {
    this.language_service.data$.subscribe((languagetype: any) => {
      this.languageFlag = languagetype || 'en';
      this.languageSubject.next(this.languageFlag);
      this.updateColumnDefs();
      this.rowData = [];
    })
  }
  private updateColumnDefs() {

    const translations = this.getColumnHeaderTranslations()[this.languageFlag];

    this.columnDefs = [
      {
        headerName: translations.sno,
        valueGetter: "node.rowIndex + 1",
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        maxWidth: 85,
      },
      {
        headerName: translations.holiday_name,
        field: 'holiday_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        //editable: true,
      },
      {
        headerName: translations.date,
        field: 'date',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        //editable: true,
      },
      {
        headerName: translations.company_branch,
        field: 'company_branch',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        //editable: true,
      },
      {
        headerName: translations.status,
        field: 'status',
        cellRenderer: ActionStatusComponent,
        cellRendererParams: {
          className: 'mat-blue',
          hideRequestButton: true,
          hideDetailsButton: false,
          hideDownloadIcon: false,
          showCustomIcon: false,
          someProperty: 'value',
        },
        cellClass: "grid-cell-centered",
        minWidth: 150,
      },
      {
        headerName: translations.action,
        field: 'id',
        flex: 1,
        minWidth: 150,
        cellRenderer: ActionComponent,
        cellRendererParams: {
          className: 'mat-blue',
          hideRequestButton: true,
          hideDetailsButton: false,
          hideDownloadIcon: false,
          showCustomIcon: false, // Hide attachment icon
        },
      },
    ];
  }

  translate(key: keyof typeof HolidayListComponent.prototype.translations['en']): string {
    const language = this.languageSubject.getValue();
    return this.translations[language][key] || key.toString();
  }

  // downloadCSV() {
  //   this.rowData.map((item: any)=> {
  //     delete item.id;
  //   })
  //   this._commonService?.downloadCSV(this.rowData,"Holiday_Master_List.xlsx");
  // }

  // downloadCSV() {
  //   const cleanedData = this.rowData.map((item: any) => {
  //     const { id, createdAt, updatedAt, isDeleted, status,  ...cleanedItem } = item;
  //     return {
  //       ...cleanedItem,
  //     };
  //   });

  //   console.log("Cleaned Data with Financial Year and Entity Name:", cleanedData);
  //   this._commonService?.downloadCSV(cleanedData, "Holiday_Master_List.xlsx");
  // }

  openDialog() {
    const dialogRef = this.mtdialog.open(HolidayCreateComponent, {


      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  get_All_holiday(){
    debugger
    let entity_id = localStorage.getItem("selectedEntityId");
    this.service.get_All_holiday(entity_id).subscribe((res: any) => {
      this.rowData = res.data;
      console.log("??????????>>>>>>>>>>>>>>",this.rowData )
  })

}


downloadCSV(): void {
  if (!this.rowData || this.rowData.length === 0) {
    console.warn('No data available to export.');
    return;
  }

  const fieldsToRemove = [
    "id", "createdAt", "updatedAt", "isDeleted", "status","financial_year_id","entity_id"
  ];

  const filteredData = this.rowData.map((row: any) => {
    const newRow = { ...row };
    fieldsToRemove.forEach(field => delete newRow[field]);
    return newRow;
  });
  const sortedData = filteredData.map((row: { [x: string]: any; }) => {
    const sortedRow: any = {};
    ['holiday_name', 'entity_name', 'financial_year', ...Object.keys(row)].forEach(key => {
      if (row[key] !== undefined) {
        sortedRow[key] = row[key];
      }
    });
    return sortedRow;
  });
  const spacedData: any[] = [];
  sortedData.forEach((row: any, index: number) => {
    spacedData.push(row);
    if ((index + 1) % 5 === 0) {
      spacedData.push({});
    }
  });
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(spacedData);
  const columnWidths = Object.keys(spacedData[0] || {}).map((key) => ({
    wch: Math.max(10, ...spacedData.map(row => (row[key] ? row[key].toString().length : 0))) + 2
  }));
  worksheet['!cols'] = columnWidths;
  const workbook: XLSX.WorkBook = { Sheets: { 'Data': worksheet }, SheetNames: ['Data'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

  saveAs(data, 'Holiday_List_Data.xlsx');
}






}

