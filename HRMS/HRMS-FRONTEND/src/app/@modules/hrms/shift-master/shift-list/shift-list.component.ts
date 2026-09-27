import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { LanguageTranslateService } from 'src/app/@shared/services/language_translate/language-translate.service';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ShiftCreateComponent } from '../shift-create/shift-create.component';
import { ShiftServiceService } from 'src/app/@shared/services/service/hrmServices/shift-service.service';
import { ActionComponent } from './action/action.component';
import { ActionStatusComponent } from './action/action-status/action-status.component';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-shift-list',
  templateUrl: './shift-list.component.html',
  styleUrls: ['./shift-list.component.scss']
})
export class ShiftListComponent {
  constructor(
    private service :ShiftServiceService,
    private _configurationalMasterService: ConfigurationalmasterService,
     private _commonService: CommonService,
    private _rbackService: RbacMasterService,
    public mtdialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private language_service: LanguageTranslateService) { }

  ngOnInit() {
    this.languageSwitch();
    this.getAllShift();
  }

  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  entity_id: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple', };
  rowData: any;
  count: any = 0;
  assignAction: any;
  languageFlag: 'en' | 'pt' = 'en';
  columnDefs: any
  private languageSubject = new BehaviorSubject<'en' | 'pt'>('en');
  language$ = this.languageSubject.asObservable();
  translations = {
    en: {
      pageTitle: 'HRMS',
      master: 'Shift',
      masterTable: 'Shift List',
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
        shift_name: 'Shift Name',
        shift_time: ' Shift Time ',
        shift_duration: 'Shift Duration  ',
        action: 'Action'
      },
      pt: {
        sno: 'Nº',
        shift_name: 'Código CC',
        shift_time: 'Nome do Departamento',
        shift_duration: 'Estado',
        action: 'Ação'
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
        headerName: translations.shift_name,
        field: 'shift_name',
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
        headerName: translations.shift_time,
        field: 'shift_time',
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
        headerName: translations.shift_duration,
        field: 'shift_duration',
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
        // headerName: translations.status,
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

  // downloadCSV() {
  //   this.rowData.map((item: any)=> {
  //     delete item.id;
  //     delete item.createdAt;
  //     delete item.updatedAt;
  //     delete item.isDeleted;
  //   })
  //   this._commonService?.downloadCSV(this.rowData,"Shift_Master_List.xlsx");
  // }

  downloadCSV() {
    const cleanedData = this.rowData.map((item: any) => {
      const { id, createdAt, updatedAt, isDeleted, status, financial_year_id, entity_id,financial_year,entity_name, ...cleanedItem } = item;
      return {
        financial_year: financial_year, // Adding the financial year
        entity_name: entity_name,        // Adding the entity name
        ...cleanedItem,
      };
    });

    console.log("Cleaned Data with Financial Year and Entity Name:", cleanedData);
    this._commonService?.downloadCSV(cleanedData, "Shift_Master_List.xlsx");
  }



  translate(key: keyof typeof ShiftListComponent.prototype.translations['en']): string {
    const language = this.languageSubject.getValue();
    return this.translations[language][key] || key.toString();
  }

  openDialog() {
    const dialogRef = this.mtdialog.open(ShiftCreateComponent, {


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
  
  getAllShift() {
  
    let entity = localStorage.getItem('selectedEntityId');

    if (entity) {
      this.entity_id = parseInt(entity, 10); // Ensure base 10
    } else {
      console.error("No selectedEntityId found in localStorage");
      return; // Exit if no valid entity_id
    }
    this.service.getAllShift(this.entity_id).subscribe((res: any) => {
      this.rowData = res.data;
      console.log("this.rowdata",  this.rowData)
    });
  }
}
