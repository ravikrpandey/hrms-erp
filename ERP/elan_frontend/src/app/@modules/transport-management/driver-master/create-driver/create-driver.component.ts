import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { environment } from 'src/app/environments/environment';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';

@Component({
  selector: 'app-create-driver',
  templateUrl: './create-driver.component.html',
  styleUrls: ['./create-driver.component.scss']
})
export class CreateDriverComponent implements OnInit {

  createForm: FormGroup;

  formFields = [
    { label: 'Driver Full Name', name: 'full_name', type: 'text', required: true },
    { label: 'Gender', name: 'gender', type: 'select', required: true },
    { label: 'Mobile No.', name: 'mobile_number', type: 'number', required: true },
    { label: 'Date Of Birth', name: 'date_of_birth', type: 'date', required: true },
    { label: 'Aadhar Number', name: 'aadhar_number', type: 'number', required: true },
    { label: 'Date Of Joining', name: 'date_of_joining', type: 'date', required: true },
    { label: 'Driving License Number', name: 'driving_license_number', type: 'text', required: true },
    { label: 'License Type', name: 'license_type', type: 'select', required: true },
    { label: 'License Expiry Date', name: 'license_expiry_date', type: 'date', required: true },
    { label: 'Experience (Years of Driving)', name: 'experience_years', type: 'number', required: true },
    { label: 'Residential Address', name: 'residential_address', type: 'textarea', required: true },
    { label: 'Permanent Address', name: 'permanent_address', type: 'textarea', required: true },
    { label: 'DL Copy Upload', name: 'driving_license_copy', type: 'file', required: true },
    { label: 'Aadhar Copy Upload', name: 'id_proof_copy', type: 'file', required: true },
    { label: 'Profile Picture Upload', name: 'profile_picture', type: 'file', required: true },
  ];

  genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' }
  ];

  licenseTypeOptions = [
    { label: 'LMV', value: 'LMV' },
    { label: 'HMV', value: 'HMV' }
  ];

  financial_year_id: number | null;
  entity_id: number | null;
  driver_id:any;
  status:any;
  maxDobDate: Date;
  filePath:any;
  folderName:string='driver_master_documents';

  constructor(private fb: FormBuilder,private transport_service:TransportManagementService,private toast:ToastrService,
    private activeroute:ActivatedRoute,private router:Router, private accessData: AccessControlService
  ) {
    this.createForm = this.fb.group(
      this.formFields.reduce((acc:any, field:any) => {
        acc[field.name] = field.required ? new FormControl(null, Validators.required) : new FormControl(null);
        return acc;
      }, {})
    );
  }
  
  ngOnInit(): void {
    this.entity_id = this.accessData.getEntityId(); 
    this.financial_year_id = this.accessData.getFinancialId();

    this.activeroute.queryParams.subscribe((params:any) => {
       this.driver_id=params?.driver_id;
       this.status=params.action_type;
      if(this.driver_id){
        this.getDatabyId(this.driver_id);
      }
    });

    const today = new Date();
    this.maxDobDate = new Date(
      today.getFullYear() - 20,
      today.getMonth(),
      today.getDate()
    );
  }

  getOptions(fieldName: string) {
    if (fieldName === 'gender') return this.genderOptions;
    if (fieldName === 'license_type') return this.licenseTypeOptions;
    return [];
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
          this.createForm.controls[field.name].setValue(uploadedUrl);
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
    this.createForm.markAllAsTouched();
    if (this.createForm.invalid) {
      this.toast.error('All required fields must be filled!');
      return;
    }
    let val=this.createForm.value;
    val.entity_id=this.entity_id;
    val.financial_year_id=this.financial_year_id;
    val.driver_id=this.driver_id;
    
    this.transport_service.createUpdate_driverMaster(val).subscribe((res:any)=>{
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

  getDatabyId(id:any){
    this.transport_service.get_vehicle_driver_by_id(id).subscribe((res:any)=>{
      if(res){
        let data=res?.data;
        this.createForm.patchValue(data);
      }
    },(err:any)=>{

    })
  }

  goBack(){
    this.router.navigate(['master/transport-management/driver-master']);
  }
}