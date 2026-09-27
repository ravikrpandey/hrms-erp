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
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LanguageTranslateService } from 'src/app/@shared/services/language_translate/language-translate.service';
import { CityMasterDialogComponent } from './city-master-dialog/city-master-dialog.component';
import { CityMasterActionComponent } from './city-master-action/city-master-action.component';
import { UploadExcelDialogComponent } from './upload-excel-dialog/upload-excel-dialog.component';

@Component({
  selector: 'app-city-master',
  templateUrl: './city-master.component.html',
  styleUrls: ['./city-master.component.scss']
})
export class CityMasterComponent {
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
  private languageSubject = new BehaviorSubject<'en' | 'pt'>('en');
  language$ = this.languageSubject.asObservable();
  translations = {
    en: {
      pageTitle: 'Configurational Master',
      countryMaster: 'Country Master',
      countryMasterTable: 'Country Master Table',
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
    this.getCity();

    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.countryss_id = this.id.countryss_id
    })

    this.language_service.data$.subscribe((languagetype:any)=>{
    
      this.languageFlag = languagetype || 'pt';
      this.languageSubject.next(this.languageFlag);
      this.updateColumnDefs();
    })
  

  }

  

  private getColumnHeaderTranslations() {
    return {
      en: {
        countryId: 'S.No.',
        countryCode: 'City Name',
        countryName: 'State ',
        status: 'Status',
        action: 'Action'
      },
      pt: {
        countryId: 'ID do País',
        countryCode: 'Código do País',
        countryName: 'País',
        status: 'Estado',
        action: 'Ação'
      }
    };
  }

  private updateColumnDefs() {
    const translations = this.getColumnHeaderTranslations()[this.languageFlag];
    this.columnDefs = [
      {
        headerName: translations.countryId,
        valueGetter: 'node.rowIndex + 1',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex: 1,
        minWidth: 150
      },
      {
        headerName: translations.countryCode,
        field: 'city_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex: 1,
        //editable: true,
        minWidth: 150
      },
      {
        headerName: translations.countryName,
        field: 'states_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex: 1,
        //editable: true,
        minWidth: 150
      },
      {
        headerName: translations.action,
        field: 'city_name',
        flex: 1,
        minWidth: 150,
        cellRenderer: CityMasterActionComponent,
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

  agInit(params: ICellRendererParams): void {

  }
  openDialog() {
    const dialogRef = this.dialog.open(CityMasterDialogComponent, {
      // data: { id: this.queryParamss },

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  uploadExcel() {
    const dialogRef = this.dialog.open(UploadExcelDialogComponent, {
      // data: { id: this.queryParamss },

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
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
  getCity() {
    this._configurationalMasterService.getCity().subscribe((res: any) => {
      this.rowData = res.data;


    })
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // translate(key: keyof typeof CityMasterDialogComponent.prototype.translations['en']): string {
  //   const language = this.languageSubject.getValue();
  //   return this.translations[language][key] || key.toString();
  // }
  
}
