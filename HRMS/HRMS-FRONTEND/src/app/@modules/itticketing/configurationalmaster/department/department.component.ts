import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { DepartmentActionComponent } from './department-action/department-action.component';
import { DepartmentDialogComponent } from './department-dialog/department-dialog.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { DepartmentActionStatusComponent } from './department-action/department-action-status/department-action-status.component';
import { BehaviorSubject } from 'rxjs';
import { LanguageTranslateService } from 'src/app/@shared/services/language_translate/language-translate.service';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss'],
})
export class DepartmentComponent {
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
      pageTitle: 'Configurational Master',
      master: 'Department',
      masterTable: 'Department List',
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
  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private language_service:LanguageTranslateService,
    private _commonService: CommonService,
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.languageSwitch()
    this.assignAction = this._rbackService.accessAssignAction();
    this.getDepartment();


    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      

      this.countryss_id = this.id.countryss_id;
      
    });

  }

  languageSwitch(){
    this.language_service.data$.subscribe((languagetype:any)=>{
      this.languageFlag = languagetype || 'en';
      this.languageSubject.next(this.languageFlag);
      this.updateColumnDefs();
    })
  }

  private getColumnHeaderTranslations() {
    return {
      en: {
        sno: 'S.NO',
        cc_code: 'CC Code',
        departmentName: 'Department Name',
        status: 'Status',
        action: 'Action',
        role: 'Designation',
        employee : "Employee"
      },
      pt: {
        sno: 'Nº',
        cc_code: 'Código CC',
        departmentName: 'Nome do Departamento',
        status: 'Estado',
        action: 'Ação',
        role: 'Papel',
        employee : "Funcionário"
      }
    };
  }


  private updateColumnDefs() {
    const translations = this.getColumnHeaderTranslations()[this.languageFlag];

   this.columnDefs = [
    {
      headerName: translations.sno ,
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      maxWidth:85,
    },
    {
      headerName: translations.departmentName,
      field: 'department_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth:150,
      //editable: true,
    },
    {
      headerName: translations.cc_code,
      field: 'cc_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth:150,
      //editable: true,
    },
    // {
    //   headerName: translations.role,
    //   field: 'role_master_id',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   minWidth:150,
    //   //editable: true,
    // },
    // {
    //   headerName: translations.employee,
    //   field: 'employee_id',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   minWidth:150,
    //   //editable: true,
    // },
    {
      headerName: translations.status,
      field: 'status',
      cellRenderer: DepartmentActionStatusComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        someProperty: 'value',
      },
      cellClass: "grid-cell-centered",
      minWidth:150,
    },
    {
      headerName: translations.action,
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: DepartmentActionComponent,
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
downloadCSV() {
  this._commonService?.downloadCSV(this.rowData,"Department_List.xlsx");
}
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }


  
  translate(key: keyof typeof DepartmentComponent.prototype.translations['en']): string {
    const language = this.languageSubject.getValue();
    return this.translations[language][key] || key.toString();
  }


  getDepartment() {
    
    this._configurationalMasterService.getDepartmentAll(this.entity_id).subscribe((res: any) => {
      this.rowData = res.data;
      
    },(err:any) => {
      this.rowData = []
    })
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
  openDialog() {
    const dialogRef = this.dialog.open(DepartmentDialogComponent, {
      // data: { id: this.queryParamss },

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
let rowIdSequence = 100;

function createDataItem(color: string) {
  const obj = {
    id: rowIdSequence++,
    color: color,
    value1: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100),
  };

  return obj;
}
