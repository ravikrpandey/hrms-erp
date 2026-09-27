import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { environment } from 'src/app/environments/environment';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';

@Component({
  selector: 'app-create-vehicle-master',
  templateUrl: './create-vehicle-master.component.html',
  styleUrls: ['./create-vehicle-master.component.scss']
})
export class CreateVehicleMasterComponent implements OnInit {

  createVehicleForm: FormGroup;
  vehicleTypeList:any=[];
  fuelTypeList:any=[];

  formFields = [
    { label: 'Vehicle Type', name: 'vehicle_type_id', type: 'select', required: true },
    { label: 'Vehicle Make', name: 'vehicle_make', type: 'text', required: true },
    { label: 'Vehicle Model', name: 'vehicle_model', type: 'text', required: true },
    { label: 'Fuel Type', name: 'fuel_type_id', type: 'select', required: true },
    { label: 'Vehicle Registration Number', name: 'vehicle_number', type: 'text', required: true },
    { label: 'Chassis Number', name: 'chassis_number', type: 'text', required: true },
    { label: 'Engine / Motor Number', name: 'engine_number', type: 'text', required: true },
    { label: 'Registration Expiry Date', name: 'registration_expiry_date', type: 'date', required: true },
    { label: 'Insurance Policy Number', name: 'insurance_policy_number', type: 'text', required: true },
    { label: 'Insurance Expiry Date', name: 'insurance_expiry_date', type: 'date', required: true },
    { label: 'Permit Type', name: 'permit_type', type: 'select', required: true },
    { label: 'GPS Enabled', name: 'gps_enabled', type: 'select', required: true },
    { label: 'RC Copy Upload', name: 'rc_copy_upload', type: 'file', required: true },
    { label: 'Insurance Copy Upload', name: 'insurance_copy_upload', type: 'file', required: true },
    { label: 'Permit Document Upload', name: 'permit_document_upload', type: 'file', required: true },
  ];

  gpsOptions = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];

  Permit= [
    { label: 'National', value: 'National' },
    { label: 'State', value: 'State' },
  ];

  financial_year_id: number | null;
  entity_id: number | null;
  vehicle_id:any;
  status:any;
  filePath:any;
  folderName:string='vehicle_master_documents';

  constructor(private fb: FormBuilder,private transport_service:TransportManagementService,private toast:ToastrService,
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
    this.getVehicleType();
    this.getFuelType();
    this.activeroute.queryParams.subscribe((params:any) => {
       this.vehicle_id=params?.id;
       this.status=params.status;
      if(this.vehicle_id){
        this.get_vehicle_master_byId(this.vehicle_id);
      }
    });
  }

  getOptions(fieldName: string) {
    if (fieldName === 'fuel_type_id') return this.fuelTypeList;
    if (fieldName === 'gps_enabled') return this.gpsOptions;
    if (fieldName === 'permit_type') return this.Permit;
    if (fieldName === 'vehicle_type_id') return this.vehicleTypeList;
    return [];
  }

  getVehicleType(){
    this.transport_service.getAll_vehicleType(this.entity_id,'ACTIVE').
    subscribe((res:any)=>{
      if(res){
        this.vehicleTypeList = res.data.map((item:any) => ({
          label: `${item?.vehicle_type_name} (${item?.vehical_category_name})`,
          value: item?.vehicle_type_id
      }));
      }
    },(err:any)=>{

    })
  }

  getFuelType(){
    this.transport_service.getAll_fuelType(this.entity_id,'ACTIVE').
    subscribe((res:any)=>{
      if(res){
        this.fuelTypeList = res.data.map((item:any) => ({
          label: `${item?.fuelType}`,
          value: item?.id
      }));
      }
    },(err:any)=>{

    })
  }

  onChangefile(event: any, field: any) {
    const file = event.target.files[0];
    if (file) {
      const actualFileName = file.name;
      
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

      this.transport_service.uploaddocuments(formData,this.folderName,true).subscribe(
        (res: any) => {
          this.toast.success('Your file has been uploaded successfully. Please submit to continue.')
          const uploadedUrl = res?.url[0];
          this.createVehicleForm.controls[field.name].setValue(uploadedUrl);
          field.value = uploadedUrl;
        },
        (err: any) => {
          this.toast.error(`${err?.error?.message}`);
        }
      );
    }
  }

  sevralUrl() {
    return environment.servralUrl + '/uploaded_files/'+this.folderName+'/' ;
  }

  openFileInNewTab(url: string) {
    window.open(this.sevralUrl() + url, '_blank');
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
    val.id=this.vehicle_id;
    
    this.transport_service.createUpdate_vehicleMaster(val).subscribe((res:any)=>{
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

  get_vehicle_master_byId(id:any){
    this.transport_service.get_vehicle_master_byId(id).subscribe((res:any)=>{
      if(res){
        let data=res?.data[0];
        this.createVehicleForm.patchValue(data);
      }
    },(err:any)=>{

    })
  }

  goBack(){
    this.router.navigate(['master/transport-management/vehicle-master']);
  }
}
