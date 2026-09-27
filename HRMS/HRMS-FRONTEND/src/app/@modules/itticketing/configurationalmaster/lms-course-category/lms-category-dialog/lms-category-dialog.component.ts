import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { LanguageTranslateService } from 'src/app/@shared/services/language_translate/language-translate.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-lms-category-dialog',
  templateUrl: './lms-category-dialog.component.html',
  styleUrls: ['./lms-category-dialog.component.scss']
})
export class LmsCategoryDialogComponent {
  category_id: any;
  singleCountryData: any;
  private languageSubject = new BehaviorSubject<'en' | 'pt'>('en');
  language$ = this.languageSubject.asObservable();
  languageFlag: 'en' | 'pt' = 'en';
  view: any;
  CategoryForm: FormGroup;

  translations = {
    en: {
      countryCode: 'Category Code',
      countryName: 'Category Name',
      status: 'Status',
      closeButton: 'close',
      header : 'Category Record'
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
    private dialog: MatDialogRef<LmsCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,
    private language_service: LanguageTranslateService,
    public toaster: ToastrService,
    private route: Router,
  ) {
    this.category_id = Number(data?.category_id);
    this.CategoryForm = this.fb.group({
      category_name: new FormControl(null, [Validators.required]),
    });
console.log(this.category_id,'csid')
    if(this.category_id){
      this._configurationalmasterService.getByIdLmsCourseCategory(this.category_id).subscribe((response:any)=>{
        this.CategoryForm.patchValue({
          category_name: response.data?.category_name,
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



  translate(key: keyof typeof LmsCategoryDialogComponent.prototype.translations['en']): string {
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
    if (this.CategoryForm.invalid) {
      this.CategoryForm.markAllAsTouched();
      this.toaster.error('Required fields should not be empty.', 'Error Occurred!');

      return
    }
      this._configurationalmasterService.createLmsCourseCategory(this.CategoryForm.value).subscribe((res: any) => {
        if (res) {
          if (res.message === "Category Name is Already Exists!") {
            this.toaster.warning('Category Name Already Exists!');
          }
          else {
            this.toaster.success('Category Added Successfully');
            this.dialog.close();
            this.reloadCurrentRoute()
          }
        }
      }, (err: any) => {
        this.toaster.error(err.error.message)
        if (err.status == 400) {
          this.toaster.error('Something went Wrong!');
        } else if (err.status == 201) {
          this.toaster.error('Category Name Already Exists!');
        } else {
          this.toaster.error('Error in submission!');
        }
      })
    
  }
  onUpdateForm(){
    if (this.CategoryForm.invalid) {
      this.CategoryForm.markAllAsTouched();
      this.toaster.error('Required fields should not be empty.', 'Error Occurred!');

      return
    }
    this._configurationalmasterService.updateLmsCourseCategory(this.category_id,this.CategoryForm.value).subscribe((res: any) => {
      if (res) {
        if (res.message === "Category Name is Already Exists!") {
          this.toaster.warning('Category Name Already Exists!');
        }
        else {
          this.toaster.success('Category Updated Successfully');
          this.dialog.close();
          this.reloadCurrentRoute()
        }
      }
    }, (err: any) => {
      this.toaster.error(err.error.message)
      if (err.status == 400) {
        this.toaster.error('Something went Wrong!');
      } else if (err.status == 201) {
        this.toaster.error('Category Name Already Exists!');
      } else {
        this.toaster.error('Error in submission!');
      }
    })
  }
}
