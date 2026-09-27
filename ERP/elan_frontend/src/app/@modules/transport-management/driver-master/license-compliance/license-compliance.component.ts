import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';

@Component({
  selector: 'app-license-compliance',
  templateUrl: './license-compliance.component.html',
  styleUrls: ['./license-compliance.component.scss']
})
export class LicenseComplianceComponent {
driver_id:any;
  action_type:any;
  licenseform:FormGroup;
  constructor(private activeroute:ActivatedRoute,
    private _fb:FormBuilder,private toast:ToastrService,
    private readonly trasport_service:TransportManagementService,private router:Router) {
      this.licenseform = this._fb.group({
        police_verification_status: new FormControl(null, [Validators.required]),
        work_permit_expiry_date: new FormControl(null, [Validators.required]),
        passport_number: new FormControl(null, [Validators.required]),
        pan_number: new FormControl(null, [Validators.required]),
        aadhar_number: new FormControl(null, [Validators.required]),
        license_type: new FormControl(null, [Validators.required]),
        license_expiry_date: new FormControl(null, [Validators.required]),
        license_issuing_authority: new FormControl(null, [Validators.required]),
        driving_license_number: new FormControl(null, [Validators.required]),
    })


  }
  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params: any) => {
      let id = params;
      this.driver_id = id.driver_id;
      this.action_type = id.action_type;
    });
    if(this.driver_id){
      this.get_vehicle_driver_by_id();
    }
  }

  get_vehicle_driver_by_id(){
    this.trasport_service.get_vehicle_driver_by_id(this.driver_id).subscribe((res:any)=>{
       if(res){
        let data=res.data;
         this.licenseform.patchValue(data);
       }
    },(err:any)=>{

    })
  }
  onSubmitForm(){
    this.licenseform.markAllAsTouched();
     if(this.licenseform.invalid){
        this.toast.error('All Fields Required.!')
     }
     let val=this.licenseform.value;
     val.tab_type='license';
     val.driver_id=this.driver_id
      this.trasport_service.create_vehicle_driver(val).subscribe((res:any)=>{
         if(res){
          this.toast.success('create Successfully');
      this.router.navigate(
        ['/master/transport-management/driver-master/create-driver/employment-assignment'],
        { queryParams: { driver_id: res.data.driver_id } }
      );
         }
      },(err:any)=>{

      })
  }

}

