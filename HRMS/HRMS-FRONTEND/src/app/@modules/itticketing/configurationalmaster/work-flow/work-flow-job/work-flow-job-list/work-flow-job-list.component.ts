import { Component } from '@angular/core';
import {
  GridApi,
  GridReadyEvent,
  CellValueChangedEvent,
  ICellRendererParams,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
// import { ActionsComponent } from './actions/actions.component';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
// import { CountrymasterdialogComponent } from './countrymasterdialog/countrymasterdialog.component';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
// import { CountryStatusComponent } from './actions/country-status/country-status.component';
import { LanguageTranslateService } from 'src/app/@shared/services/language_translate/language-translate.service';
import { CountryStatusComponent } from 'src/app/@modules/itticketing/configurationalmaster/countrymaster/actions/country-status/country-status.component';
import { CountrymasterComponent } from 'src/app/@modules/itticketing/configurationalmaster/countrymaster/countrymaster.component';
import { ActionJobComponent } from '../action-job/action-job.component';
import { WorkFlowListPopComponent } from '../work-flow-list-pop/work-flow-list-pop.component';

@Component({
  selector: 'app-work-flow-job-list',
  templateUrl: './work-flow-job-list.component.html',
  styleUrls: ['./work-flow-job-list.component.scss']
})
export class WorkFlowJobListComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  subscription: Subscription;
  languageFlag: 'en' | 'pt' = 'en';
  columnDefs: any
  entity_id:any;
  private languageSubject = new BehaviorSubject<'en' | 'pt'>('en');
  language$ = this.languageSubject.asObservable();
  translations = {
    en: {
      pageTitle: 'WorkFlow',
      countryMaster: 'WorkFlow',
      countryMasterTable: ' Work Flow List',
      placeholder: 'Search'
    },
    pt: {
      pageTitle: 'Mestre de Configuração',
      countryMaster: 'Mestre de País',
      countryMasterTable: 'Tabela de Mestre de País',
      placeholder: 'Pesquisar'
    }
  };
  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService, private router: Router,
    private language_service:LanguageTranslateService
  ) {
    this.rowClass = 'rowClass'
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // browserRefresh = !router.navigated;


      }
    });
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.getCountry();
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.countryss_id = this.id.countryss_id
    })

    this.language_service.data$.subscribe((languagetype:any)=>{
      // console.log(languagetype)
      this.languageFlag = languagetype || 'pt';
      this.languageSubject.next(this.languageFlag);
      this.updateColumnDefs();
    })
    // this.languageFlag = params.languageFlag || 'en';

  }

  // public columnDefs = [
  //   {
  //     headerName: 'Country ID',
  //     field: 'countryss_id',
  //     sortable: true,
  //     resizable: true,
  //     wrapHeaderText: true,
  //     autoHeaderHeight: true,
  //     cellClass: "grid-cell-centered",
  //     flex: 1,
  //     minWidth: 150
  //   },
  //   {
  //     headerName: 'Country Code',
  //     field: 'country_code',
  //     sortable: true,
  //     resizable: true,
  //     wrapHeaderText: true,
  //     autoHeaderHeight: true,
  //     cellClass: "grid-cell-centered",
  //     flex: 1,
  //     //editable: true,
  //     minWidth: 150
  //   },
  //   {
  //     headerName: 'Country',
  //     field: 'countryss_name',
  //     sortable: true,
  //     resizable: true,
  //     wrapHeaderText: true,
  //     autoHeaderHeight: true,
  //     cellClass: "grid-cell-centered",
  //     flex: 1,
  //     //editable: true,
  //     minWidth: 150
  //   },

  //   {
  //     headerName: 'Status',
  //     field: 'status',
  //     cellRenderer: CountryStatusComponent,
  //     cellRendererParams: {
  //       className: 'mat-blue',
  //       hideRequestButton: true,
  //       hideDetailsButton: false,
  //       hideDownloadIcon: false,
  //       showCustomIcon: false,
  //       someProperty: 'value',
  //     },
  //     cellClass: "grid-cell-centered",
  //     minWidth: 150,
  //   },

  //   {
  //     headerName: 'Action',
  //     field: 'countryss_name',
  //     flex: 1,
  //     minWidth: 150,
  //     cellRenderer: ActionsComponent,
  //     cellRendererParams: {
  //       className: 'mat-blue',
  //       hideRequestButton: true,
  //       hideDetailsButton: false,
  //       hideDownloadIcon: false,
  //       showCustomIcon: false, // Hide attachment icon
  //     },

  //   }
  // ];

  private getColumnHeaderTranslations() {
    return {
      en: {
        id: 'S.No ',
        Type: 'Workflow Type',
        Department: 'Department',
        // countryName: 'Country',
        // status: 'Status',
        action: 'Action'
      },
      pt: {
        id: 'ID',
        Type: 'ID do País',
        Department: 'Código do País',
        // countryName: 'País',
        // status: 'Estado',
        action: 'Ação'
      }
    };
  }

  private updateColumnDefs() {
    const translations = this.getColumnHeaderTranslations()[this.languageFlag];
    this.columnDefs = [
      {
        headerName: translations.id,
        field: 'S.No',
        valueGetter: (params:any) => params.node.rowIndex + 1,
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex: 1,
        minWidth: 150
      },
      {
        headerName: translations.Type,
        field: 'job_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex: 1,
        minWidth: 150
      },
      {
        headerName: translations.Department,
        field: 'department_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex: 1,
        minWidth: 150
      },
      // {
      //   headerName: translations.countryName,
      //   field: 'countryss_name',
      //   sortable: true,
      //   resizable: true,
      //   wrapHeaderText: true,
      //   autoHeaderHeight: true,
      //   cellClass: "grid-cell-centered",
      //   flex: 1,
      //   //editable: true,
      //   minWidth: 150
      // },
      // {
      //   headerName: translations.status,
      //   field: 'status',
      //   cellRenderer: CountryStatusComponent,
      //   cellRendererParams: {
      //     className: 'mat-blue',
      //     hideRequestButton: true,
      //     hideDetailsButton: false,
      //     hideDownloadIcon: false,
      //     showCustomIcon: false,
      //     someProperty: 'value',
      //   },
      //   cellClass: "grid-cell-centered",
      //   minWidth: 150,
      // },
      {
        headerName: translations.action,
        field: 'countryss_name',
        flex: 1,
        minWidth: 150,
        cellRenderer: ActionJobComponent,
        cellRendererParams: {
          className: 'mat-blue',
          hideRequestButton: true,
          hideDetailsButton: false,
          hideDownloadIcon: false,
          showCustomIcon: false,
        },
      }
    ];
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;


  }
  onCellClicked(e:any){
    // console.log(e.data.id)
    const dialogRef = this.dialog.open(WorkFlowListPopComponent, {
      data: { id:e.data.id },

      width: '30%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      
    });

  }

  agInit(params: ICellRendererParams): void {

  }

  onCellValueChanged(event: CellValueChangedEvent) {
    let id1 = event.data.countryss_id;
    let val = event.newValue;

    //  --------------- change on cell ------------------- 


    let sta = event.data;


    if (val == event.data.status) {
      this._configurationalMasterService.updateSingleCountry(id1, sta).subscribe(
        (res: any) => {

          this.toaster.success('Status Updated Successfully')
        }, (err: any) => {
          // this.toaster.error('Something went wrong please try again', 'Error Message');

        });
    }
  }

  addRecordToGrid(data: any) {
    // if data missing or data has no it, do nothing
    if (!data || data.id == null) { return; }

    const api = this.gridApi;
    // do nothing if row is already in the grid, otherwise we would have duplicates
    const rowAlreadyInGrid = !!api.getRowNode(data.id);

    if (rowAlreadyInGrid) {

      return;
    }

    const transaction = {
      add: [data],
    };

    api.applyTransaction(transaction);
  }

  onFactoryButtonClick(e: any) {
    this.count++
    if (this.count === 1) {
      var button = e.currentTarget,
        buttonColor = button.getAttribute('data-color'),
        side = button.getAttribute('data-side'),
        data = createDataItem(buttonColor);
      this.addRecordToGrid(data);

      this.gridApi.paginationGoToLastPage();
    } else {
      this.toaster.warning("can't add Country")
    }
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

  
  getCountry() {
    this._configurationalMasterService.getAllWorkFlowJob(this.entity_id).subscribe((res: any) => {
      this.rowData = res.data;
      // this.rowData = res.data.filter((item:any)=>item?.status == "ACTIVE")
    },
    ((err:any)=>{
      this.rowData=[]
      this.toaster.error(`${err.error.message}`)
    })
    )
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  translate(key: keyof typeof CountrymasterComponent.prototype.translations['en']): string {
    const language = this.languageSubject.getValue();
    return this.translations[language][key] || key.toString();
  }
  
  

}
let rowIdSequence = 100;


function createDataItem(color: string) {
  const obj = {
    id: rowIdSequence++,
    color: color,
    value1: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100)
  };

  return obj;
}