import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationStart, Route, Router } from '@angular/router';
import { GridApi, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { LanguageTranslateService } from 'src/app/@shared/services/language_translate/language-translate.service';
import { LmsCategoryDialogComponent } from './lms-category-dialog/lms-category-dialog.component';
import { LmsCategoryActionComponent } from './lms-category-action/lms-category-action.component';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-lms-course-category',
  templateUrl: './lms-course-category.component.html',
  styleUrls: ['./lms-course-category.component.scss']
})
export class LmsCourseCategoryComponent {
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
      countryMaster: 'learning Course Category Master',
      countryMasterTable: 'learning Course Category Master Table',
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
    public dialog: MatDialog, private activetRoute: ActivatedRoute,
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
    this.getLmsCourseCategory();

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
        headerName: "S.No",
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
        headerName: "Category Name",
        field: 'category_name',
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
        headerName: "Action",
        field: 'review_id',
        flex: 1,
        minWidth: 150,
        cellRenderer: LmsCategoryActionComponent,
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
    const dialogRef = this.dialog.open(LmsCategoryDialogComponent, {
      // data: { id: this.queryParamss },

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  downloadCSV() {
    this._commonService?.downloadCSV(this.rowData,"LMS_Course_Category_List.xlsx");
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
  getLmsCourseCategory() {
    this._configurationalMasterService.getLmsCourseCategory().subscribe((res: any) => {
      this.rowData = res.data;


    })
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  translate(key: keyof typeof LmsCourseCategoryComponent.prototype.translations['en']): string {
    const language = this.languageSubject.getValue();
    return this.translations[language][key] || key.toString();
  }
}
