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
  selector: 'app-add-register-compalin',
  templateUrl: './add-register-compalin.component.html',
  styleUrls: ['./add-register-compalin.component.scss']
})
export class AddRegisterCompalinComponent {
  registercompainForm: FormGroup;
  candidate_id: any;
  imageToUpload: any;
  imagePath: any;
  singleItem: any;
  serialNo: any;

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
    this.registercompainForm = this.fb.group({
      system_serial_no: new FormControl('', [Validators.required]),
      document: new FormControl('', [Validators.required]),
      customer_mobile_no: new FormControl('', [Validators.required,Validators.pattern('^[6-9]\\d{9}$')]),
      customer_name: new FormControl('', [Validators.required]),
      issue: new FormControl('', [Validators.required]),
      issue_details: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      syatem_type: new FormControl('', [Validators.required]),
      syatem_rating: new FormControl('', [Validators.required,Validators.pattern('^\\d{1,3}$')]),
      alt_mobile_no: new FormControl('', [Validators.required,Validators.pattern('^[6-9]\\d{9}$')]),
      complaint_type: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(params => {
      this.serialNo = params['serial_no'];
      console.log(this.serialNo); 
      this.registercompainForm.patchValue({
        system_serial_no:this.serialNo
      })
    });
  }
  onChange(e: any) {
    let isValidExtension = this.$common.checkForValidFile(e, false, false);
    if (!isValidExtension) {
      return
      this.registercompainForm.patchValue({
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
cancel(){
  this.router.navigate(['master/crm-service/register-complain'])
  }

  submitData(){
    let data = {
      ...this.registercompainForm.value,
      entity_id : localStorage.getItem("selectedEntityId")
    }
    this._configurationalMasterService.createConplain(data).subscribe((res)=>{
      if (res) {
        this.toaster.success('Saved Successfully')
        this.router.navigate(['master/crm-service/open-complaints'])
      }
    }, err => {
      console.log(err);
      this.toaster.error(err.error.message)
    })
  }
}
