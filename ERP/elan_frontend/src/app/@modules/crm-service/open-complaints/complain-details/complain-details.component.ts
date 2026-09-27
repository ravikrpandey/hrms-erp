import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-complain-details',
  templateUrl: './complain-details.component.html',
  styleUrls: ['./complain-details.component.scss']
})
export class ComplainDetailsComponent {
  complaindetailsForm: FormGroup;
  candidate_id: any;
  singleItem: any;
  readable: boolean = false;
  imageToUpload: any;
  imagePath: any;
  id: any;
  role: any;
  alldata: any;
  createdata: any[] = [];
  @ViewChild('audioPlayer') audioPlayer: ElementRef;
  audioPath: any;
  audioToUpload: any;
  mp3Url: any;
  imageUrl: any;
  audio: any;
  image: any;
  roleId: any;
  date = new Date();
  complainStatus: any;
  constructor(private location: Location,
    private fb: FormBuilder,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbacMasterService: RbacMasterService,
    private toaster: ToastrService,
    private router: Router,
    private toast: ToastrService,
    private $common: CommonService,
    private dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef) {
    this.complaindetailsForm = this.fb.group({
      complain_ID: new FormControl('', [Validators.required]),
      system_serial_no: new FormControl('', [Validators.required]),
      customer_mobile_no: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      alt_mobile_no: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      issue: new FormControl('', [Validators.required]),
      customer_name: new FormControl('', [Validators.required]),
      issue_details: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      // state_id: new FormControl('', [Validators.required]),
      // city_id: new FormControl('', [Validators.required]),
      document: new FormControl('', [Validators.required]),
      system_display_audio: new FormControl('', [Validators.required]),
      complain_status: new FormControl('', [Validators.required]),
      priority: new FormControl('', [Validators.required]),
      complaint_type: new FormControl('', [Validators.required]),
      brand: new FormControl('', [Validators.required]),
      system_type: new FormControl('', [Validators.required]),
      system_rating: new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')]),
      system_installation_date: new FormControl('', [Validators.required]),
      service_charge_cpplicable: new FormControl('', [Validators.required]),
      in_warranty: new FormControl('', [Validators.required]),
      blacklist_hold: new FormControl('', [Validators.required]),
      collection_status: new FormControl(''),
      collection: new FormControl(null),
      collection_date:new FormControl(''),
    });
  }
  get CF_1(): any { return this.complaindetailsForm.controls };
  ngOnInit(): void {
    let loginUser: any = localStorage.getItem('signInUser');
    let emp: any = JSON.parse(loginUser);
    this.roleId = emp?.role_id
    this.activeRoute.queryParamMap.subscribe((param: any) => {
      this.id = param.params.id
      this.complaindetailsForm.patchValue({
        complain_ID:param.params.id
      })
      this.role = param.params.role;
      if (this.role == 'view') {
        this.readable = true;
      } else {
        this.readable = false;
      }
    });
    this.getregistercomplainbyid(this.id);
    this.complainStatusList()
  }
  getregistercomplainbyid(id: any) {
    this._configurationalMasterService.getregistercomplainbyid(this.id).subscribe((res: any) => {
      this.alldata = res.data;
      this.audio = res.data.system_display_audio
      this.image = res.data.document
      console.log(this.audio);
      
      this.complaindetailsForm.patchValue({
     // register_complain_id: this.id ? this.id : null,  
     complain_ID: this.alldata?.complain_ID ? this.alldata?.complain_ID : this.id,
     system_serial_no: this.alldata?.system_serial_no,
     customer_mobile_no: this.alldata?.customer_mobile_no,
     alt_mobile_no: this.alldata?.alt_mobile_no,
     issue: this.alldata?.issue,
     customer_name: this.alldata?.customer_name,
     issue_details: this.alldata?.issue_details,
     address: this.alldata?.address,
    
     complain_status: this.alldata?.complain_status,
     priority: this.alldata?.priority,
     complaint_type: this.alldata?.complaint_type,
     brand: this.alldata?.brand,
     system_type: this.alldata?.system_type,
     system_rating: this.alldata?.system_rating,
     system_installation_date: this.alldata?.system_installation_date,
     service_charge_cpplicable: this.alldata?.service_charge_cpplicable,
     in_warranty: this.alldata?.in_warranty,
     blacklist_hold: this.alldata?.blacklist_hold, 
      document: this.alldata?.document,
      collection_status:this.alldata?.collection_status,
      collection:this.alldata?.collection,
      collection_date:this.alldata?.collection_date,
      });
    });
  }

  updatecompaindetail() {
    // if (this.complaindetailsForm.invalid) {
    //   this.toast.error('required fields should not be blank', 'Required fields');
    //   return
    // }
    let val = this.complaindetailsForm.value;
    const data = {
      // register_complain_id: this.id ? this.id : null,  
      complain_ID: val.complain_ID,
      system_serial_no: val.system_serial_no,
      customer_mobile_no: val.customer_mobile_no,
      alt_mobile_no: val.alt_mobile_no,
      issue: val.issue,
      customer_name: val.customer_name,
      issue_details: val.issue_details,
      address: val.address,
      // state_id: Number(val.state_id),
      // city_id: val.city_id,
      document: val.document,
      system_display_audio: val.system_display_audio,
      complain_status: val.complain_status,
      priority: val.priority,
      complaint_type: val.complaint_type,
      brand: val.brand,
      system_type: val.system_type,
      system_rating: val.system_rating,
      system_installation_date: val.system_installation_date,
      service_charge_cpplicable: val.service_charge_cpplicable,
      in_warranty: val.in_warranty,
      blacklist_hold: val.blacklist_hold,
      collection:val.collection,
      collection_status:val.collection_status,
      collection_date:val.complain_status=='Resolved'?this.date:''   
    }
    if (this.id) {
      this._configurationalMasterService.openupdatecomplaindetails(this.id ,data).subscribe((res: any) => {

        this.toaster.success(res.message)
        if(this.roleId == 28){
          this.router.navigate(['master/crm-service/service-center-complaint'])
        }else{
          window.history.back()
          // this.router.navigate(['master/crm-service/open-complaints'])
        }
       
      }, err => {
        this.toaster.error(err.error.message)
      })
    }
    //  else {
    //   this._configurationalMasterService.createServicecenterMaster(data).subscribe((res: any) => {
    //     this.createdata = res.data
    //     if (res.code == 200) {
    //       this.toaster.success(res.message)
    //       this.router.navigate(['master/crm-service/open-complaints'])

    //     }
    //   }, err => {
    //     this.toaster.error(err.error.message)
    //   })
    // }

  }
  onChange(e: any) {
    // Check for valid file extension
    let isValidExtension = this.$common.checkForValidFile(e, false, false);
    if (!isValidExtension) {
        // Reset the form control if invalid
        this.complaindetailsForm.patchValue({
            document: null
        });
        return;  
    }

    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0]; 
        const formData = new FormData();
        this.imageToUpload = file;
        const reader = new FileReader();
        reader.onload = (loadEvent: any) => {
            this.imagePath = loadEvent.target.result; 
            console.log(file, this.imagePath);
            
            formData.append('file', file);

            this._configurationalMasterService.uploadDocuments(formData).subscribe(
                (response: any) => {
                    if (response) {
                        this.imageUrl = response.url;
                        this.complaindetailsForm.patchValue({
                            document: this.imageUrl  
                        });
                    }
                },
                err => {
                    console.error(err);
                }
            );
        };
        reader.readAsDataURL(this.imageToUpload);
    }
}

  onChange1(e: any) {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      const file = e.target.files[0];
  
      const fileExtension = this.getFileExtension(file.name);
      if (fileExtension === 'mp3' || fileExtension === 'wav') {
        const reader = new FileReader();
  
        reader.onload = (event: any) => {
          this.audioToUpload = file; 
          this.audioPath = event.target.result; 
          console.log(this.audioToUpload,this.audioPath);
          console.log(e.target.files[0]);
          
          formData.append('file', e.target.files[0]);
          this._configurationalMasterService.uploadDocuments(formData).subscribe((response: any) => {
            if (response) {
           this.mp3Url = response.url
           this.complaindetailsForm.patchValue({
            system_display_audio:this.mp3Url
           })
            }
          }, err => {
            console.log(err);
          })
        };
  
        reader.readAsDataURL(file);
      } 
    }
  }
  
  generateMp3Url(mp:any) {
    if(this.audio){
      const servralUrl = environment.servralUrl;
      const url = `${servralUrl}/documents/${this.audio}`;
      window.open(url,'_blank')
    }
  }
  generateImageUrl(uploadDoc: any): string {
    const servralUrl = environment.servralUrl;
    return `${servralUrl}/documents/${uploadDoc}`;
  }

  isImage(uploadDoc: any): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const extension = this.getFileExtension(uploadDoc).toLowerCase();

    // return imageExtensions.includes(extension.toLowerCase());
    if (imageExtensions.includes(extension)) {
      return true;
    } else {
      return false;
    }
  }

  generateFileUrl(uploadDoc: any) {
    console.log(uploadDoc);
    
    const servralUrl = environment.servralUrl;
    const url = `${servralUrl}/documents/${uploadDoc}`;
    window.open(url,'_blank')
  }

  getFileName(uploadDoc: any): string {
    // Extract and return the file name from the path
    const pathParts = uploadDoc.split('/');
    return pathParts[pathParts.length - 1];
  }

  getFileExtension(filename: string): string {
    // Extract and return the file extension from the filename

    const parts = filename?.split('.');

    if (parts) {
      return parts[parts.length - 1];
    }
    return "";
  }
  seePreview(path: string, imagePath: any) {
    if (!this.imagePath) {
      if (path) {
        Swal.fire({
          imageUrl: environment.servralUrl + '/' + path,
          imageHeight: 250,
          imageAlt: 'Uploaded Document',
          confirmButtonColor: "#063178",
          confirmButtonText: 'Ok',
        })
      }
    } else {
      Swal.fire({
        imageUrl: imagePath,
        imageHeight: 250,
        imageAlt: 'Profile Image',
        confirmButtonColor: "#063178",
        confirmButtonText: 'Ok',
      })
    }
  };
  goBack() {
    this.location.back();
  }
  cancel() {
    window.history.back()
    // this.router.navigate(['master/crm-service/open-complaints'])
  }
  playAudio() {
    const audioPlayer: HTMLAudioElement = document.querySelector('#audioPlayer') as HTMLAudioElement;
    if (audioPlayer) {
      audioPlayer.style.display = 'block';
      audioPlayer.play();
    }
  }

  complainStatusList(){
    this._configurationalMasterService.getComplainStatusList().subscribe((res:any)=>{
      this.complainStatus = res.data
      console.log(this.complainStatus);
      
    })
  }
}

