import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';

@Component({
  selector: 'app-create-vehicle-type',
  templateUrl: './create-vehicle-type.component.html',
  styleUrls: ['./create-vehicle-type.component.scss']
})
export class CreateVehicleTypeComponent implements OnInit {

  createVehicleForm: FormGroup;
  vehicle_category:any=[];
  formFields = [
    { label: 'Vehicle Type Name', name: 'vehicle_type_name', type: 'text', required: true },
    { label: 'Vehicle Category ', name: 'vehicle_category_id', type: 'select', required: true },
    { label: 'Body Type', name: 'body_type', type: 'text', required: true },
    { label: 'Axle Type', name: 'axle_type', type: 'select', required: true },
    { label: 'Number Of Axles', name: 'number_of_axles', type: 'number', required: true },
    { label: 'Max Load Capacity (TON)', name: 'max_payload_ton', type: 'number', required: true },
    { label: 'Length (Feet)', name: 'length_ft', type: 'number', required: true },
    { label: 'Width (Feet)', name: 'width_ft', type: 'number', required: true },
    { label: 'Height (Feet)', name: 'height_ft', type: 'number', required: true },
    { label: 'Volume Capacity (Cubic Feet)', name: 'max_volume_cft', type: 'number', required: true },
    { label: 'Number of Tyres', name: 'number_of_tyres', type: 'text', required: true },
    { label: 'Tyre Type', name: 'tyre_type', type: 'select', required: true },
    { label: 'Tyre Size', name: 'tyre_size', type: 'text', required: true },
    { label: 'Temperature Control', name: 'temperature_control', type: 'select', required: true },
    { label: 'Hazardous Allowed', name: 'hazardous_allowed', type: 'select', required: true }
  ];

  commonOptions = [
    { label: 'YES', value: 'YES' },
    { label: 'NO', value: 'NO' },
  ];

  axleType = [
    { label: 'SINGLE', value: 'SINGLE' },
    { label: 'MULTI', value: 'MULTI' },
  ];
  
  tyreoption= [
    { label: 'TUBE', value: 'TUBE' },
    { label: 'TUBELESS', value: 'TUBELESS' },

  ];

  financial_year_id: number | null;
  entity_id: number | null;
  vehicleType_id:any;
  status:string = 'View';
  pageName: string = 'View';

  constructor(private fb: FormBuilder,private transport_service:TransportManagementService, private toast:ToastrService,
    private activeroute:ActivatedRoute,private router:Router, private accessData: AccessControlService
  ) {
    this.createVehicleForm = this.fb.group(
      this.formFields.reduce((acc:any, field:any) => {
        acc[field.name] = field.required ? new FormControl(null, Validators.required) : new FormControl(null);
        return acc;
      }, {})
    );
  }
 
  ngOnInit(): void {
    this.entity_id = this.accessData.getEntityId(); 
    this.financial_year_id = this.accessData.getFinancialId();

    this.get_vehical_category();
    
    this.activeroute.queryParams.subscribe((params:any) => {
      this.vehicleType_id=params?.vehicleType_id;
      this.status=params?.actionType;
      this.pageName=this.status =='View' ? 'View' : this.vehicleType_id ? 'Update' : 'Create';
      if(this.vehicleType_id){
        this.getVehicleTypebyId(this.vehicleType_id);
      }
    });
  }

  getOptions(fieldName: string) {
    if (fieldName === 'tyre_type') return this.tyreoption;
    if (fieldName === 'axle_type') return this.axleType;
    if (fieldName === 'temperature_control' || fieldName === 'hazardous_allowed') return this.commonOptions;
    if (fieldName === 'vehicle_category_id') return this.vehicle_category;
    return [];
  }

  getChangeValue(fieldName:any){
    const formValue = this.createVehicleForm.value;
    if (fieldName === 'height_ft' || fieldName === 'width_ft' || fieldName === 'length_ft') {
      const height = formValue.height_ft;
      const width = formValue.width_ft;
      const length = formValue.length_ft;

      if (height && width && length) {
        const volumeCapacity = height * width * length;
        this.createVehicleForm.patchValue({
          max_volume_cft: volumeCapacity
        });
      }
    }
  }

  get_vehical_category(){
    this.transport_service.get_vehical_category_Active(this.entity_id,this.financial_year_id).
    subscribe((res:any)=>{
      if(res){
        this.vehicle_category = res.data.map((item:any) => ({
          label: `${item?.vehical_category_name}`,
          value: item?.id
      }));
      }
    },(err:any)=>{

    })
  }
  
  submitForm(){
    this.createVehicleForm.markAllAsTouched();
    if (this.createVehicleForm.invalid) {
      this.toast.error('All required fields must be filled!');
      return;
    }

    let val=this.createVehicleForm.value;
    val.entity_id=this.entity_id;
    val.financial_year_id=this.financial_year_id;
    val.vehicle_type_id=this.vehicleType_id;

    this.transport_service.createUpdate_vehicleType(val).subscribe((res:any)=>{
      if(res){
        this.toast.success(res.message);
        setTimeout(() => {
          this.goBack();
        }, 2000); // time in milliseconds
      }
    },(err:any)=>{
      this.toast.error(err.error.message);
    })
  }

  getVehicleTypebyId(id:any){
    this.transport_service.getVehicleTypebyId(id).subscribe((res:any)=>{
      if(res){
        let data=res?.data[0];
        this.createVehicleForm.patchValue(data);
      }
    },(err:any)=>{

    })
  }

  goBack(){
    this.router.navigate(['master/transport-management/vehicle-type']);
  }

}
