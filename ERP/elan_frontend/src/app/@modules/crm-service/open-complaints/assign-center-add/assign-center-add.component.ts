import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  selector: 'app-assign-center-add',
  templateUrl: './assign-center-add.component.html',
  styleUrls: ['./assign-center-add.component.scss']
})
export class AssignCenterAddComponent {
  assigncenteraddForm: FormGroup;
  candidate_id: any;
  singleItem: any;
  readable: boolean = false;
  imageToUpload: any;
  imagePath: any;
  id: any;
  role: any;
  alldata: any;
  createdata: any[] = [];
  servicecenters: any;
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
    this.assigncenteraddForm = this.fb.group({
      // contact_no: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      service_center_id: new FormControl('', [Validators.required]),
      complain: new FormControl('', [Validators.required]),
      // status: new FormControl('', [Validators.required]),
      image: new FormControl(''),
      address: new FormControl('', [Validators.required]),
      system_serial_number:new FormControl('')
    });
  }
  get CF_1(): any { return this.assigncenteraddForm.controls };
  ngOnInit(): void {
    this.activeRoute.queryParamMap.subscribe((param: any) => {
      this.id = param.params.id
      this.role = param.params.role;
      if (this.role == 'view') {
        this.readable = true;
      } else {
        this.readable = false;
      }
      this._configurationalMasterService.getregistercomplainbyid(this.id).subscribe((res:any)=>{
        console.log(res);
        let data = res.data
        this.assigncenteraddForm.patchValue({
          system_serial_number:data.system_serial_no,
          complain:data.issue,
          address:data.address
        })
      })
 
    });
    if (this.id) {
      this.getByIdServicecenterMaster();
    }
    this.getServicecenterMasterList();
  }
  getServicecenterMasterList() {
    let entity_id =  localStorage.getItem("selectedEntityId");
    this._configurationalMasterService.getServicecenterMasterList(entity_id).subscribe((res: any) => {
      this.servicecenters = res.data
    })
  }
  getByIdServicecenterMaster() {
    this._configurationalMasterService.getByIdServicecenterMaster(this.id).subscribe((res: any) => {
      this.alldata = res.data;
      this.assigncenteraddForm.patchValue({
        contact_no: this.alldata?.contact_no,
        code: this.alldata?.code,
        name: this.alldata?.name,
        gst_no: this.alldata?.gst_no,
        address: this.alldata?.address
      })
    })
  }

  savecenter() {
    if (this.assigncenteraddForm.invalid) {
      this.toast.error('required fields should not be blank', 'Required fields');
      return
    }
    let val = this.assigncenteraddForm.value;
    const data = {
      contact_no: val.contact_no,
      code: val.code,
      name: val.name,
      gst_no: val.gst_no,
      address: val.address
    }
    if (this.id) {
      this._configurationalMasterService.updateServicecenterMaster(this.id, data).subscribe((res: any) => {

        this.toaster.success(res.message)
        this.router.navigate(['master/crm-service/open-complaints'])
      }, err => {
        this.toaster.error(err.error.message)
      })
    } else {

      this._configurationalMasterService.createServicecenterMaster(data).subscribe((res: any) => {
        this.createdata = res.data
        if (res.code == 200) {
          this.toaster.success(res.message)
          this.router.navigate(['master/crm-service/open-complaints'])

        }
      }, err => {
        this.toaster.error(err.error.message)
      })
    }

  }
  onChange(e: any) {
    let isValidExtension = this.$common.checkForValidFile(e, false, false);
    if (!isValidExtension) {
      return
      this.assigncenteraddForm.patchValue({
        image: null
      });
    }
    if (e.target.files && e.target.files[0]) {
      const data: FileList = e.target.files;
      this.imageToUpload = data.item(0) || null;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePath = e.target.result;

      };
      reader.readAsDataURL(this.imageToUpload);
    }

  }

  generateImageUrl(uploadDoc: any): string {
    const servralUrl = environment.servralUrl;
    return `${servralUrl}/${uploadDoc}`;
  }

  isImage(uploadDoc: any): boolean {
    // Check if the file has an image extension
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const extension = this.getFileExtension(uploadDoc).toLowerCase();

    // return imageExtensions.includes(extension.toLowerCase());
    if (imageExtensions.includes(extension)) {
      return true;
    } else {
      return false;
    }
  }

  generateFileUrl(uploadDoc: any): string {
    const servralUrl = environment.servralUrl;
    return `${servralUrl}/${uploadDoc}`;
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
    this.router.navigate(['master/crm-service/open-complaints'])
  }

  assignServiceCenter(){
    let data ={
      register_complain_id:this.id,
      service_center_id:this.assigncenteraddForm.controls['service_center_id'].value
    }
    console.log(data);
    this._configurationalMasterService.assignServiceCenter(data).subscribe((res)=>{
      if (res) {
        this.toaster.success('Saved Successfully')
        this.router.navigate(['master/crm-service/assign-complain-list'])
      }
    }, err => {
      console.log(err);
      this.toaster.error(err.error.message)
    })
    
  }
}
