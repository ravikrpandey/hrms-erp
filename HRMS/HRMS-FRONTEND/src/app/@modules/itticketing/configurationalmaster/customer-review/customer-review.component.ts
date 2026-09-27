import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { LanguageTranslateService } from 'src/app/@shared/services/language_translate/language-translate.service';
import { CustomerReviewActionComponent } from './customer-review-action/customer-review-action.component';
import { CustomerDialogComponent } from '../customer-type/customer-dialog/customer-dialog.component';
import { CustomerReviewDialogComponent } from './customer-review-dialog/customer-review-dialog.component';
import { CustomerReviewStatusComponent } from './customer-review-status/customer-review-status.component';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-customer-review',
  templateUrl: './customer-review.component.html',
  styleUrls: ['./customer-review.component.scss']
})
export class CustomerReviewComponent {
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
      countryMaster: 'Customer Review Master',
      countryMasterTable: 'Customer Review Master Table',
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
    private language_service:LanguageTranslateService,
    private _commonService: CommonService
  ) {
    this.rowClass = 'rowClass'
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // browserRefresh = !router.navigated;


      }
    });
  }

  ngOnInit(): void {
    this.getCustomerReview();

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

  

  private getColumnHeaderTranslations() {
    return {
      en: {
        reviewId: 'S.No.',
        reviewName: 'Review',
        status: 'Status',
        action: 'Action'
      },
      pt: {
        reviewId: 'ID do País',
        reviewName: 'Código do País',
        status: 'Estado',
        action: 'Ação'
      }
    };
  }

  private updateColumnDefs() {
    const translations = this.getColumnHeaderTranslations()[this.languageFlag];
    this.columnDefs = [
      {
        headerName: translations.reviewId,
        field: 'review_id',
        valueGetter: "node.rowIndex + 1",
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex: 1,
        minWidth: 150
      },
      {
        headerName: translations.reviewName,
        field: 'review_name',
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
        headerName: translations.status,
        field: 'status',
        cellRenderer: CustomerReviewStatusComponent,
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
        field: 'review_id',
        flex: 1,
        minWidth: 150,
        cellRenderer: CustomerReviewActionComponent,
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
  downloadCSV() {
    this._commonService?.downloadCSV(this.rowData,"Customer_Review_List.xlsx");
  }
  openDialog() {
    const dialogRef = this.dialog.open(CustomerReviewDialogComponent, {
      // data: { id: this.queryParamss },

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
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
  getCustomerReview() {
    this._configurationalMasterService.getcustomerReview().subscribe((res: any) => {
      this.rowData = res.data;


    })
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  translate(key: keyof typeof CustomerReviewComponent.prototype.translations['en']): string {
    const language = this.languageSubject.getValue();
    return this.translations[language][key] || key.toString();
  }
  

}
