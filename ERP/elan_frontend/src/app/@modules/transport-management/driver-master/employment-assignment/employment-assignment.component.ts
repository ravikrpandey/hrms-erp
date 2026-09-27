import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';

@Component({
  selector: 'app-employment-assignment',
  templateUrl: './employment-assignment.component.html',
  styleUrls: ['./employment-assignment.component.scss']
})
export class EmploymentAssignmentComponent {

driver_id:any;
  action_type:any;
  employmentform:FormGroup;
  constructor(private activeroute:ActivatedRoute,
    private _fb:FormBuilder,private toast:ToastrService,
    private readonly trasport_service:TransportManagementService,private router:Router) {
      this.employmentform = this._fb.group({
        experience_years: new FormControl(null, [Validators.required]),
        date_of_joining: new FormControl(null, [Validators.required]),
        vendor_agency_name: new FormControl(null, [Validators.required]),
        employment_type: new FormControl(null, [Validators.required]),
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
         this.employmentform.patchValue(data);
       }
    },(err:any)=>{

    })
  }
  onSubmitForm(){
    this.employmentform.markAllAsTouched();
     if(this.employmentform.invalid){
        this.toast.error('All Fields Required.!')
     }
     let val=this.employmentform.value;
     val.driver_id=this.driver_id
     val.tab_type='employment';
      this.trasport_service.create_vehicle_driver(val).subscribe((res:any)=>{
         if(res){
          this.toast.success('create Successfully');
      this.router.navigate(
        ['/master/transport-management/driver-master/create-driver/attachments-Documents'],
        { queryParams: { driver_id: res.data.driver_id } }
      );
         }
      },(err:any)=>{

      })
  }

}


