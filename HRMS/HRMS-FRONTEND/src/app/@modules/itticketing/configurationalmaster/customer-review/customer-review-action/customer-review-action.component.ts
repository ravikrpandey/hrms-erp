import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { CustomerDialogComponent } from '../../customer-type/customer-dialog/customer-dialog.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { LanguageTranslateService } from 'src/app/@shared/services/language_translate/language-translate.service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import { CustomerReviewDialogComponent } from '../customer-review-dialog/customer-review-dialog.component';

@Component({
  selector: 'app-customer-review-action',
  templateUrl: './customer-review-action.component.html',
  styleUrls: ['./customer-review-action.component.scss']
})
export class CustomerReviewActionComponent {
  allStateData: any;
  languageFlag: 'en' | 'pt' = 'en';
  private languageSubject = new BehaviorSubject<'en' | 'pt'>('en');
  language$ = this.languageSubject.asObservable();
  translations = {
    en: {
      tooltip: 'view',
    },
    pt: {
      tooltip: 'visualizar',
    }
  };
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private language_service:LanguageTranslateService,
    private toaster: ToastrService,
  ) {
    // this.data = localStorage.getItem("jobId");
    // 

  }

  ngOnInit(): void {
    this.languageTranslate()
   }

   languageTranslate(){
    this.language_service.data$.subscribe((languagetype:any)=>{
      this.languageFlag = languagetype || 'pt';
      this.languageSubject.next(this.languageFlag);
    })
   }

  public cellValue: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    
  }
  getValueToDisplay(params: ICellRendererParams) {
    

    return params.valueFormatted ? params.valueFormatted : params.data.review_id
  }
  edit(e: any) {

    const dialogRef = this.dialog.open(CustomerReviewDialogComponent, {
      data: { review_id: this.cellValue},

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }



  translate(key: keyof typeof CustomerReviewActionComponent.prototype.translations['en']): string {
    const language = this.languageSubject.getValue();
    return this.translations[language][key] || key.toString();
  }
  delete(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: 'Are you sure you want to Remove it?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this._configurationalmasterService.deleteCustomerReview(this.cellValue).subscribe(
          (res) => {
            
            this.toaster.success('Deleted successfully ');
            this.reloadCurrentRoute();
          },
          (err) => {
            this.toaster.error("Somthing went wrong Please try agin", "Error Message")
            
          }
        )
      }
    });
  } 
}
