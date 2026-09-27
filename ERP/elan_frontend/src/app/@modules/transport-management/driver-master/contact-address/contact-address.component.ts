import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';

@Component({
  selector: 'app-contact-address',
  templateUrl: './contact-address.component.html',
  styleUrls: ['./contact-address.component.scss']
})
export class ContactAddressComponent implements OnInit {

  driver_id:any;
  action_type:any;
  contactform:FormGroup;
  constructor(private activeroute:ActivatedRoute,
    private _fb:FormBuilder,private toast:ToastrService,
    private readonly trasport_service:TransportManagementService,private router:Router) {
this.contactform = this._fb.group({
  permanent_address: new FormControl(null, [Validators.required]),
  residential_address: new FormControl(null, [Validators.required]),
  email_address: new FormControl(null, [Validators.required]),
  alternate_contact_number: new FormControl(null, [Validators.required]),
  mobile_number: new FormControl(null, [Validators.required]),
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


  onSubmitForm(){
    this.contactform.markAllAsTouched();
     if(this.contactform.invalid){
        this.toast.error('All Fields Required.!')
     }
     let val=this.contactform.value;
     val.driver_id=this.driver_id
     val.tab_type='contact';
      this.trasport_service.create_vehicle_driver(val).subscribe((res:any)=>{
         if(res){
          this.toast.success('create Successfully');
      this.router.navigate(
        ['/master/transport-management/driver-master/create-driver/license-compliance'],
        { queryParams: { driver_id: res.data.driver_id } }
      );
         }
      },(err:any)=>{

      })
  }
  get_vehicle_driver_by_id(){
    this.trasport_service.get_vehicle_driver_by_id(this.driver_id).subscribe((res:any)=>{
       if(res){
        let data=res.data;
         this.contactform.patchValue(data);
       }
    },(err:any)=>{

    })
  }
}
