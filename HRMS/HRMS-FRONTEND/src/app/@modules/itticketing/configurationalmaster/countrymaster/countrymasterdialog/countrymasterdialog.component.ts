import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { LanguageTranslateService } from 'src/app/@shared/services/language_translate/language-translate.service';
// import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-countrymasterdialog',
  templateUrl: './countrymasterdialog.component.html',
  styleUrls: ['./countrymasterdialog.component.scss']
})
export class CountrymasterdialogComponent {
  country_id: any;
  singleCountryData: any;
  private languageSubject = new BehaviorSubject<'en' | 'pt'>('en');
  language$ = this.languageSubject.asObservable();
  languageFlag: 'en' | 'pt' = 'en';
  view: any;
  countryForm: FormGroup;

  translations = {
    en: {
      countryCode: 'Country Code',
      countryName: 'Country Name',
      status: 'Status',
      closeButton: 'close',
      header : 'Country Record'
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
    private dialog: MatDialogRef<CountrymasterdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,
    private language_service: LanguageTranslateService,
    public toaster: ToastrService
  ) {
    this.country_id = Number(data?.id);
    this.countryForm = this.fb.group({
      countryss_name: new FormControl(null, [Validators.required]),
      country_code: new FormControl(null, [Validators.required]),
      phone_code: new FormControl(null),
    });

    if(this.country_id){
      this._configurationalmasterService.getByIdCountry(this.country_id).subscribe((response:any)=>{
        // this.departmentData = res.data;
        this.countryForm.patchValue({
          countryss_name: response.data?.countryss_name,
          phone_code: response.data?.phone_code,
          country_code: response.data?.country_code
        }
      )
      })

    }
  }
  ngOnInit() {
    this.getByIdCountry()
    this.language_service.data$.subscribe((languagetype: any) => {
      this.languageFlag = languagetype || 'pt';
      this.languageSubject.next(this.languageFlag);
    });
    this.view = this.data?.view
  }

  getByIdCountry() {
    this._configurationalmasterService.getByIdCountry(this.country_id).subscribe((res: any) => {
      this.singleCountryData = res.data;
      
    })
  }

  translate(key: keyof typeof CountrymasterdialogComponent.prototype.translations['en']): string {
    const language = this.languageSubject.getValue();
    return this.translations[language][key] || key.toString();
  }
  
  onSubmitForm(){
    if (this.countryForm.invalid) {
      this.countryForm.markAllAsTouched();
      this.toaster.error('Required fields should not be empty.', 'Error Occurred!');

      return
    }
      this._configurationalmasterService.createCountry(this.countryForm.value).subscribe((res: any) => {
        if (res) {
          if (res.message === "Country Name is Already Exists!") {
            this.toaster.warning('Country Name Already Exists!');
          }
          else {
            this.toaster.success('Country Added Successfully');
            this.dialog.close();
            window.location.reload();
          }
        }
      }, (err: any) => {
        this.toaster.error(err.error.message)
        if (err.status == 400) {
          this.toaster.error('Something went Wrong!');
        } else if (err.status == 201) {
          this.toaster.error('Country Name Already Exists!');
        } else {
          this.toaster.error('Error in submission!');
        }
      })
    
  }
  onUpdateForm(){
    if (this.countryForm.invalid) {
      this.countryForm.markAllAsTouched();
      this.toaster.error('Required fields should not be empty.', 'Error Occurred!');

      return
    }
    this._configurationalmasterService.updateSingleCountry(this.country_id,this.countryForm.value).subscribe((res: any) => {
      if (res) {
        if (res.message === "Country Name is Already Exists!") {
          this.toaster.warning('Country Name Already Exists!');
        }
        else {
          this.toaster.success('Country Updated Successfully');
          this.dialog.close();
          window.location.reload();
        }
      }
    }, (err: any) => {
      this.toaster.error(err.error.message)
      if (err.status == 400) {
        this.toaster.error('Something went Wrong!');
      } else if (err.status == 201) {
        this.toaster.error('Country Name Already Exists!');
      } else {
        this.toaster.error('Error in submission!');
      }
    })
  }
}
