import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-basic-driver',
  templateUrl: './basic-driver.component.html',
  styleUrls: ['./basic-driver.component.scss']
})
export class BasicDriverComponent implements OnInit {

  employees:any;
  basicform:FormGroup;
  filePath: any;
  emp_id:any;
  financial_year_id:any;
  entity_id:any;
  action_type:any;
  driver_id:any;
  loginUser:any;
  maxDobDate: Date;

  constructor(private readonly tranport_service:TransportManagementService,
    private _fb:FormBuilder,
    private toast:ToastrService,private recruitService:RecruitService,
    private activeroute:ActivatedRoute,
    private _empRegistration: EmpRegistrationService,
    private readonly router:Router
  ) {
this.basicform = this._fb.group({
      full_name: new FormControl(null, [Validators.required]),
      date_of_birth: new FormControl(null, [Validators.required]),
      gender: new FormControl(null, [Validators.required]),
      employee_id: new FormControl(null),
      profile_picture: new FormControl(null, [Validators.required]),
      blood_group: new FormControl(null, [Validators.required]),
      nationality: new FormControl(null, [Validators.required]),
      })
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.emp_id = localStorage.getItem('EmpMainId');
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    this.activeroute.queryParams.subscribe((params: any) => {
      let id = params;
      this.driver_id = id.driver_id;
      this.action_type = id.action_type;
    });
    if(this.driver_id){
      this.get_vehicle_driver_by_id();
    }
    this.getAllSuperviser();

    const today = new Date();
    this.maxDobDate = new Date(
      today.getFullYear() - 20,
      today.getMonth(),
      today.getDate()
    );
  }

  onChangefile(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        let imagePath =
          file.type === 'application/pdf'
            ? '/assets/icons/pdfimg.png'
            : e.target.result;
            this.filePath=imagePath;
      };

      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file);

      this.recruitService.uploaddocumentsUpdate(formData).subscribe(
        (res: any) => {
          this.toast.success('File Upload Successfully!')
          const uploadedUrl = res?.url;
          this.basicform.controls['profile_picture'].setValue(uploadedUrl);
        },
        (err: any) => {
          this.toast.error(`${err?.error?.message}`);
        }
      );
    }
  }
    sevralUrl() {
          return environment.servralUrl + '/uploaded_files/' ;
        }
    openFileInNewTab(url: string) {
      window.open(this.sevralUrl() + url, '_blank');
    }
    getAllSuperviser() {
      let entity_id = localStorage.getItem("selectedEntityId");
      this._empRegistration.grtEmployeeList(entity_id, this.loginUser?.role).subscribe((res: any) => {

        this.employees = res.data;


      });
    }
  onSubmitForm(){
     this.basicform.markAllAsTouched();
     if(this.basicform.invalid){
      this.toast.error('All fields required.!')
      return;
     }
     let val=this.basicform.value;
     val.entity_id=this.entity_id;
     val.financial_year_id=this.financial_year_id;
     val.created_by=this.emp_id;
     val.driver_id=this.driver_id;
     val.tab_type='basic'
    this.tranport_service.create_vehicle_driver(val).subscribe((res:any)=>{
    if(res){
      this.toast.success('create Successfully');
      this.router.navigate(
        ['/master/transport-management/driver-master/create-driver/contact-address'],
        { queryParams: { driver_id: res.data.driver_id } }
      );
    }
    },(err:any)=>{

    })

  }
  get_vehicle_driver_by_id(){
    this.tranport_service.get_vehicle_driver_by_id(this.driver_id).subscribe((res:any)=>{
       if(res){
        let data=res.data;
         this.basicform.patchValue(data);
       }
    },(err:any)=>{

    })
  }
  redirectToList(){

  }
}
