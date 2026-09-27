import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { LanguageTranslateService } from 'src/app/@shared/services/language_translate/language-translate.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { FinanceCreateComponent } from '../finance-create/finance-create.component';
import { MatDialog } from '@angular/material/dialog';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ActionComponent } from '../action/action.component';
import { ActionStatusComponent } from '../action-status/action-status.component';
import { CommonService } from 'src/app/@shared/services/common.service';
@Component({
  selector: 'app-financial-list',
  templateUrl: './financial-list.component.html',
  styleUrls: ['./financial-list.component.scss']
})
export class FinancialListComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple', };
  columnDefs: any;
  rowData:any;
  languageFlag: 'en' | 'pt' = 'en';
  private languageSubject = new BehaviorSubject<'en' | 'pt'>('en');
  language$ = this.languageSubject.asObservable();
  translations = {
    en: {
      pageTitle: 'Financial Year Master',
      master: 'Financial',
      masterTable: 'Financial Year List',
      placeholder: 'Search',
      addButton: 'Add'
    },
    pt: {
      pageTitle: 'Mestre do exercício financeiro',
      master: 'Financeiro',
      masterTable: 'Lista do exercício financeiro',
      placeholder: 'Procurar',
      addButton: 'Adicionar',
    }
  };
  entity_id: any;
  assignAction: any;
  id: any;
  countryss_id: any;
  constructor(private language_service: LanguageTranslateService,
    private _rbackService: RbacMasterService,
    private activetRoute: ActivatedRoute,
    public dialog: MatDialog, private route: Router,
    private financeService:FinaceService,
    private _commonService: CommonService
  ){
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.languageSwitch()
    this.assignAction = this._rbackService.accessAssignAction();
    this.getFinancialYears();
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.countryss_id = this.id.countryss_id;
    });
  }

  getFinancialYears() { 
    this.financeService.getFinancialYear().subscribe((res: any) => {
      this.rowData = res.data;
      console.log("Finance Years List",this.rowData);
      },(err:any) => {
      this.rowData = []
    })
  }

  languageSwitch(){
    this.language_service.data$.subscribe((languagetype:any)=>{
      this.languageFlag = languagetype || 'en';
      this.languageSubject.next(this.languageFlag);
      this.updateColumnDefs();
    })
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  downloadCSV() {
    this._commonService?.downloadCSV(this.rowData,"Financial_List.xlsx");
  }
  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  translate(key: keyof typeof FinancialListComponent.prototype.translations['en']): string {
    const language = this.languageSubject.getValue();
    return this.translations[language][key] || key.toString();
  }

  openDialog() {
    const dialogRef = this.dialog.open(FinanceCreateComponent, {
      // data: { id: this.queryParamss },

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

   private updateColumnDefs() {
    const translations = this.getColumnHeaderTranslations()[this.languageFlag];
    this.columnDefs = [
      {
        headerName: translations.id, 
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
        headerName: translations.financial_year,
        field: 'financial_year',
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
        minWidth:150,
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

  private getColumnHeaderTranslations() {
    return {
      en: {
        id: 'S.No',
        financial_year: 'Finance Year',
        status: 'Status',
        action: 'Action'
      },
      pt: {
        id: 'S.Não',
        financial_year: 'Ano Financeiro',
        status: 'Status',
        action: 'Ação'
      }
    };
  }

}
