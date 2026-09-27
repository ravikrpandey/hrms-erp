import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-attachments-documents',
  templateUrl: './attachments-documents.component.html',
  styleUrls: ['./attachments-documents.component.scss']
})
export class AttachmentsDocumentsComponent {
driver_id:any;
  action_type:any;
  attachmentform:FormGroup;
  filePath: any;
  constructor(private activeroute:ActivatedRoute,
    private _fb:FormBuilder,private toast:ToastrService,
    private readonly trasport_service:TransportManagementService,private router:Router,
  private recruitService:RecruitService) {
      this.attachmentform = this._fb.group({
        work_permit_document: new FormControl(null, [Validators.required]),
        medical_fitness_certificate: new FormControl(null, [Validators.required]),
        police_verification_document: new FormControl(null, [Validators.required]),
        id_proof_copy: new FormControl(null, [Validators.required]),
        driving_license_copy: new FormControl(null, [Validators.required]),
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
         this.attachmentform.patchValue(data);
       }
    },(err:any)=>{

    })
  }
  onChangefile(event: any,field_Name:any) {
    
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
          this.attachmentform.controls[field_Name].setValue(uploadedUrl);
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
  onSubmitForm(){
    this.attachmentform.markAllAsTouched();
     if(this.attachmentform.invalid){
        this.toast.error('All Fields Required.!')
     }
     let val=this.attachmentform.value;
     val.driver_id=this.driver_id
     val.tab_type='attachments';
      this.trasport_service.create_vehicle_driver(val).subscribe((res:any)=>{
         if(res){
          this.toast.success('create Successfully');
      this.router.navigate(
        ['/master/transport-management/driver-master'],

      );
         }
      },(err:any)=>{

      })
  }

}


