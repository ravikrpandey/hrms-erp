import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { LanguageTranslateService } from 'src/app/@shared/services/language_translate/language-translate.service';
@Component({
  selector: 'app-city-master-dialog',
  templateUrl: './city-master-dialog.component.html',
  styleUrls: ['./city-master-dialog.component.scss']
})
export class CityMasterDialogComponent {
  stateVar: any = [];
  city_id: any;
  singleCityData: any;
  private languageSubject = new BehaviorSubject<'en' | 'pt'>('en');
  language$ = this.languageSubject.asObservable();
  languageFlag: 'en' | 'pt' = 'en';
  view: any;
  cityForm: FormGroup;
  getStateId :any =Number

  translations = {
    en: {
      cityCode: 'City Code',
      cityName: 'City Name',
      status: 'Status',
      closeButton: 'close',
      header : 'City Record'
    },
    pt: {
      cityCode: 'Código da Cidade',
    cityName: 'Cidade',
    status: 'Estado',
    closeButton: 'fechar',
    header: 'Registro do Cidade',
    }
  };
  stateVar2: any;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialogRef<CityMasterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,
    private language_service: LanguageTranslateService,
    public toaster: ToastrService,
    private _empRegistration: EmpRegistrationService,
  ) {
    this.city_id = Number(data?.id);
    this.cityForm = this.fb.group({
      city_name: new FormControl(null, [Validators.required]),
      states_id: new FormControl(null, [Validators.required]),
    });

    if(this.city_id){
      this._configurationalmasterService.getByIdCity(this.city_id).subscribe((response:any)=>{
        this.cityForm.patchValue({
          city_name: response.data?.city_name,
          states_id : response.data?.states_id,
        }
      )
      this.getStateId = response.data?.states_id
      })
      this._configurationalmasterService.getByIdState(this.getStateId).subscribe((response:any)=>{
      this.StateDataList = response.data[0];
      })

    }
  }
  ngOnInit() {
    this.getStateList()
    this.getByIdCity()
    this.language_service.data$.subscribe((languagetype: any) => {
      this.languageFlag = languagetype || 'pt';
      this.languageSubject.next(this.languageFlag);
    });
    this.view = this.data?.view
  }


  getByIdCity() {
    this._configurationalmasterService.getByIdCity(this.city_id).subscribe((res: any) => {
      this.singleCityData = res.data;
      
    })
  }

  stateFilter(e: any) {
    const aa = e
    let filteredVariable = this.stateVar2.filter((item: any) => aa.includes(item.states_name));
    this.StateDataList = filteredVariable

  }

  translate(key: keyof typeof CityMasterDialogComponent.prototype.translations['en']): string {
    const language = this.languageSubject.getValue();
    return this.translations[language][key] || key.toString();
  }
  
  onSubmitForm(){
    if (this.cityForm.invalid) {
      this.cityForm.markAllAsTouched();
      this.toaster.error('Required fields should not be empty.', 'Error Occurred!');

      return
    }
      this._configurationalmasterService.createCity(this.cityForm.value).subscribe((res: any) => {
        if (res) {
          if (res.message === "City Name is Already Exists!") {
            this.toaster.warning('City Name Already Exists!');
          }
          else {
            this.toaster.success('City Added Successfully');
            this.dialog.close();
            window.location.reload();
          }
        }
      }, (err: any) => {
        this.toaster.error(err.error.message)
        if (err.status == 400) {
          this.toaster.error('Something went Wrong!');
        } else if (err.status == 201) {
          this.toaster.error('City Name Already Exists!');
        } else {
          this.toaster.error('Error in submission!');
        }
      })
    
  }
  StateDataList:any=[]
  getStateList() {
    this._empRegistration.getAllstate().subscribe(
      (res: any) => {
        
        if (res && res?.data) {
          this.StateDataList = res?.data;
          this.stateVar = this.StateDataList.map((res: any) => res.states_name);
          this.stateVar2 = this.StateDataList;

          this.StateDataList = [...this.stateVar2]

        }
      }
    );
  }
  onUpdateForm(){
    if (this.cityForm.invalid) {
      this.cityForm.markAllAsTouched();
      this.toaster.error('Required fields should not be empty.', 'Error Occurred!');

      return
    }
    this._configurationalmasterService.updateSingleCity(this.city_id,this.cityForm.value).subscribe((res: any) => {
      if (res) {
        if (res.message === "City Name is Already Exists!") {
          this.toaster.warning('City Name Already Exists!');
        }
        else {
          this.toaster.success('City Updated Successfully');
          this.dialog.close();
          window.location.reload();
        }
      }
    }, (err: any) => {
      this.toaster.error(err.error.message)
      if (err.status == 400) {
        this.toaster.error('Something went Wrong!');
      } else if (err.status == 201) {
        this.toaster.error('City Name Already Exists!');
      } else {
        this.toaster.error('Error in submission!');
      }
    })
  }
}
