import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { LanguageTranslateService } from 'src/app/@shared/services/language_translate/language-translate.service';

@Component({
  selector: 'app-customer-review-dialog',
  templateUrl: './customer-review-dialog.component.html',
  styleUrls: ['./customer-review-dialog.component.scss']
})
export class CustomerReviewDialogComponent {
  review_id: any;
  singleCountryData: any;
  private languageSubject = new BehaviorSubject<'en' | 'pt'>('en');
  language$ = this.languageSubject.asObservable();
  languageFlag: 'en' | 'pt' = 'en';
  view: any;
  customerReviewForm: FormGroup;

  translations = {
    en: {
      countryCode: 'Review Code',
      countryName: 'Review Name',
      status: 'Status',
      closeButton: 'close',
      header : 'Review Record'
    },
    pt: {
      countryCode: 'Código do País',
      countryName: 'País',
      status: 'Estado',
      closeButton: 'fechar',
      header : 'Recorde do país'
    }
  };
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialogRef<CustomerReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,
    private language_service: LanguageTranslateService,
    public toaster: ToastrService,
    private route: Router,
  ) {
    this.review_id = Number(data?.review_id);
    this.customerReviewForm = this.fb.group({
      review_name: new FormControl(null, [Validators.required]),
    });
console.log(this.review_id,'csid')
    if(this.review_id){
      this._configurationalmasterService.getCustomerReviewById(this.review_id).subscribe((response:any)=>{
        this.customerReviewForm.patchValue({
          review_name: response.data?.review_name,
        }
      )
      })

    }
  }
  ngOnInit() {
    // this.getByIdCountry()
    this.language_service.data$.subscribe((languagetype: any) => {
      this.languageFlag = languagetype || 'pt';
      this.languageSubject.next(this.languageFlag);
    });
    this.view = this.data?.view
  }

  getByIdCountry() {
    this._configurationalmasterService.getByIdCountry(this.review_id).subscribe((res: any) => {
      this.singleCountryData = res.data;
      
    })
  }

  translate(key: keyof typeof CustomerReviewDialogComponent.prototype.translations['en']): string {
    const language = this.languageSubject.getValue();
    return this.translations[language][key] || key.toString();
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  onSubmitForm(){
    if (this.customerReviewForm.invalid) {
      this.customerReviewForm.markAllAsTouched();
      this.toaster.error('Required fields should not be empty.', 'Error Occurred!');

      return
    }
      this._configurationalmasterService.createReview(this.customerReviewForm.value).subscribe((res: any) => {
        if (res) {
          if (res.message === "Review Name is Already Exists!") {
            this.toaster.warning('Review Name Already Exists!');
          }
          else {
            this.toaster.success('Review Added Successfully');
            this.dialog.close();
            this.reloadCurrentRoute()
          }
        }
      }, (err: any) => {
        this.toaster.error(err.error.message)
        if (err.status == 400) {
          this.toaster.error('Something went Wrong!');
        } else if (err.status == 201) {
          this.toaster.error('Review Name Already Exists!');
        } else {
          this.toaster.error('Error in submission!');
        }
      })
    
  }
  onUpdateForm(){
    if (this.customerReviewForm.invalid) {
      this.customerReviewForm.markAllAsTouched();
      this.toaster.error('Required fields should not be empty.', 'Error Occurred!');

      return
    }
    this._configurationalmasterService.updateCustomerReview(this.review_id,this.customerReviewForm.value).subscribe((res: any) => {
      if (res) {
        if (res.message === "Review Name is Already Exists!") {
          this.toaster.warning('Review Name Already Exists!');
        }
        else {
          this.toaster.success('Review Updated Successfully');
          this.dialog.close();
          this.reloadCurrentRoute()
        }
      }
    }, (err: any) => {
      this.toaster.error(err.error.message)
      if (err.status == 400) {
        this.toaster.error('Something went Wrong!');
      } else if (err.status == 201) {
        this.toaster.error('Review Name Already Exists!');
      } else {
        this.toaster.error('Error in submission!');
      }
    })
  }
}
