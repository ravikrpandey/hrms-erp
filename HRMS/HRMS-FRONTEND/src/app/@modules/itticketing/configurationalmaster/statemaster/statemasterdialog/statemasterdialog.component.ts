import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';

@Component({
  selector: 'app-statemasterdialog',
  templateUrl: './statemasterdialog.component.html',
  styleUrls: ['./statemasterdialog.component.scss']
})
export class StatemasterdialogComponent {
  state_id: any;
  countryss_id:any;
  singleStateData: any;
  singleCountryData: any;
  stateForm : FormGroup;
  countryList : any =[];
  variables: any = [];
  view : any;
  checkData: any ;
  variable: any;
  constructor(
    private fb: FormBuilder,
    private toaster : ToastrService,
    private dialog: MatDialogRef<StatemasterdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _empRegistration: EmpRegistrationService,
  ) {
    this.state_id = Number(data.id);
    // this.countryss_id= Number(data.id);
    this.view = data?.view
    console.log(data,"data");
    
this.getAllCountry()
    this.state_id = Number(data?.id);
    this.stateForm = this.fb.group({
      states_name: new FormControl(null, [Validators.required]),
      countryss_id: new FormControl(null, [Validators.required]),
    });

    if(this.state_id){
      this._configurationalmasterService.getByIdState(this.state_id).subscribe((response:any)=>{
        // this.departmentData = res.data;
        this.stateForm.patchValue({
          states_name: response.data[0]?.states_name,
          countryss_id: response.data[0]?.countryss_id
        }
      )
      })

    }
  }
  ngOnInit() {
    if(this.state_id){
  this.getByIdState();
  this.getByIdCountry();}
  }

  getByIdState() {
    
    this._configurationalmasterService.getByIdState(this.state_id).subscribe((res: any) => {
      this.singleStateData = res.data;
      
    })
  }
  getByIdCountry() {
    this._configurationalmasterService.getByIdCountry(this.countryss_id).subscribe((res: any) => {
      this.singleCountryData = res.data;
      
    })
  }


  countryFilter(e: any) {
    const aa = e
    let filteredVariable = this.checkData.filter((item: any) => aa.includes(item.countryss_name));
    this.countryList = filteredVariable
  }

  filterCountryName:any =[]
  getAllCountry() {
    this._empRegistration.getAllcountry().subscribe(
      (res: any) => {
        this.countryList = res.data;
        this.variables = this.countryList?.map((res: any) => res.countryss_name)
        this.checkData = this.countryList
        this.variable = this.countryList

          this.filterCountryName = [...this.variable]

      })
  };
  onSubmitForm(){
    if (this.stateForm.invalid) {
      this.stateForm.markAllAsTouched();
      this.toaster.error('Required fields should not be empty.', 'Error Occurred!');

      return
    }
      this._configurationalmasterService.createState(this.stateForm.value).subscribe((res: any) => {
        if (res) {
          if (res.message === "State Name is Already Exists!") {
            this.toaster.warning('State Name Already Exists!');
          }
          else {
            this.toaster.success('State Added Successfully');
            this.dialog.close();
            window.location.reload();
          }
        }
      }, (err: any) => {
        this.toaster.error(err.error.message)
        if (err.status == 400) {
          this.toaster.error('Something went Wrong!');
        } else if (err.status == 201) {
          this.toaster.error('State Name Already Exists!');
        } else {
          this.toaster.error('Error in submission!');
        }
      })
    
  }
  onUpdateForm(){
    if (this.stateForm.invalid) {
      this.stateForm.markAllAsTouched();
      this.toaster.error('Required fields should not be empty.', 'Error Occurred!');

      return
    }
    this._configurationalmasterService.updateSingleState(this.state_id,this.stateForm.value).subscribe((res: any) => {
      if (res) {
        if (res.message === "State Name is Already Exists!") {
          this.toaster.warning('State Name Already Exists!');
        }
        else {
          this.toaster.success('State Updated Successfully');
          this.dialog.close();
          window.location.reload();
        }
      }
    }, (err: any) => {
      this.toaster.error(err.error.message)
      if (err.status == 400) {
        this.toaster.error('Something went Wrong!');
      } else if (err.status == 201) {
        this.toaster.error('State Name Already Exists!');
      } else {
        this.toaster.error('Error in submission!');
      }
    })
  }
}
