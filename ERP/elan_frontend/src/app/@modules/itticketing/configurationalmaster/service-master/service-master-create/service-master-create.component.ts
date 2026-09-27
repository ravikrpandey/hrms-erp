import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { environment } from 'src/app/environments/environment';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}
@Component({
  selector: 'app-service-master-create',
  templateUrl: './service-master-create.component.html',
  styleUrls: ['./service-master-create.component.scss'],
})
export class ServiceMasterCreateComponent {
  serviceMasterForm: any;
  service_id: any;
  parm: any;
  getData: any;
  propertyManager: any;
  firstLastName: any;
  personalIdData: any;
  wordCount: any;
  @ViewChild('text') text: ElementRef;
  words: any;
  extraWords: boolean = false;
  asignData: any;
  asignvariables: any;
  asignvariable: any;
  uniqueId: any;
  uniquedata: any;
  countrey_id: any;
  cityList: any;
  nameSearch: any = '';
  variables: any = [];
  variable: any = [];
  checkData: any;
  getCat_data: any[] = [];
  imageToUpload: any;
  chart_of_account_id:any=[]
  imagePath: any;
  singleItem: any;
  urlImge: any;
  fileShow: any;
  getCat_data2: any;
  serviceCategoryList: any[];
  sacCodeList:any[]=[];
  data:any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private emp_master: EmpMasterService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private $common: CommonService,
    private toast: ToastrService,
    private location: Location,
    private recruitService: RecruitService,
    private _commonService: CommonService,
    private _finance:FinaceService
  ) {
    this.serviceMasterForm = this.fb.group({
      // service_category_id: new FormControl(null, [Validators.required]),
      service_name: new FormControl(null, [
        Validators.required,
        noLeadingSpaces(),
      ]),
      service_description: new FormControl(null, [
        Validators.required,
        noLeadingSpaces(),
      ]),
      // MVP: new FormControl(null, [Validators.required]),
      service_code: new FormControl(null, [Validators.required]),
      sac_code_id: new FormControl(null),
      chart_of_account_id: new FormControl(null),
      cgst: new FormControl(null),
      sgst: new FormControl(null),
      igst: new FormControl(null),
      // image: new FormControl(null, [Validators.required]),
    });
  }
  get CF_1(): any {
    return this.serviceMasterForm.controls;
  }
  ngOnInit(): void {
    this.activetedRoute.queryParams.subscribe((params: any) => {
      this.parm = params;
      this.service_id = params.service_id;
    });
    let entity_id = localStorage.getItem('selectedEntityId');
    this.getSacCode(entity_id);

    this.chartAccountDetails()
    if (this.service_id) {
      this.getByIdRole()
      this._commonService?.showLoader();
      this.CF_1['image'].setErrors(null);
      this._configurationalMasterService
        .getByIdServiceMaster(this.service_id)
        .subscribe(
          (res: any) => {
            this._commonService?.hideLoader();
            this.singleItem = res.data;
            // this.fileShow = `${
            //   environment.servralUrl + '/' + this.singleItem?.service_document
            // }`;

            // this.CF_1['image'].setErrors(null);
            this.serviceMasterForm.patchValue({
              service_category_id: this.singleItem?.service_category_id,
              service_name: this.singleItem?.service_name,
              service_description: this.singleItem?.service_description,
              MVP: this.singleItem?.MVP,
              igst: this.singleItem?.igst,
              sac_code_id: this.singleItem?.sac_code_id
            });
            // if (this.singleItem?.service_document) {
            //   this.imagePath = `${
            //   environment.servralUrl + '/' + this.singleItem?.service_document
            // }`;
            // }
          },
          (err: any) => {
            this._commonService?.hideLoader();
          }
        );
    }
    this._configurationalMasterService
      .getActiveServiceCategoryMasterList()
      .subscribe((res: any) => {
        this.getCat_data = res.data;
        this.getCat_data2 = res.data;
        this.serviceCategoryList = this.getCat_data.map(
          (value: any) => value.service_category_name
        );
      });
    if (!this.service_id) {
      this.getuniqueNumber();
    }
  }
  goBack() {
    this.location.back();
  }

  back() {
    history.back();
  }
  chartAccountDetails(){
    this.entity_id = localStorage.getItem('selectedEntityId');
    this._finance.getChartOfAccountList(this.entity_id).subscribe((res:any)=>{
      this._commonService?.hideLoader()
      this.data=res?.data;
    },(err:any) => {
      this._commonService?.hideLoader()
    })
  }

  seePreview(path: string, imagePath: any) {
    if (!this.imagePath) {
      if (path) {
        Swal.fire({
          imageUrl: path,
          imageHeight: 250,
          imageAlt: 'Uploaded Document',
          confirmButtonColor: '#858586',
          confirmButtonText: 'Ok',
        });
      }
    } else {
      Swal.fire({
        imageUrl: imagePath,
        imageHeight: 250,
        imageAlt: 'Profile Image',
        confirmButtonColor: '#858586',
        confirmButtonText: 'Ok',
      });
    }
  }
  removePlus(event: any): void {
    const key = event.key;
    if (key === '+' || key === '-') {
      event.preventDefault();
    }
  }
  // onChange(e: any) {
  //   let isValidExtension = this.$common.checkForValidFile(e, false, false);
  //   if (!isValidExtension)
  //     return this.serviceMasterForm.value.image.setValue(null);
  //   if (e.target.files && e.target.files[0]) {
  //     if (!this.isImage(this.serviceMasterForm?.get('image')?.value)) {
  //       this.serviceMasterForm.get('image').patchValue(null);
  //     }
  //     const data: FileList = e.target.files;
  //     this.imageToUpload = data.item(0) || null;

  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.imagePath = e.target.result;
  //     };
  //     reader.readAsDataURL(this.imageToUpload);
  //   }

  //   const formData = new FormData();

  //   formData.append('file', this.imageToUpload);

  //   this.recruitService.uploaddocumentsUpdate(formData).subscribe(
  //     (res: any) => {
  //       this.toast.success('File Uploaded Successfully');
  //       this.urlImge = res?.url;
  //     },
  //     (err: any) => {
  //       this.toast.error(`${err?.error?.message}`);
  //     }
  //   );
  // }

  // generateImageUrl(uploadDoc: any): string {
  //   const servralUrl = environment.servralUrl;
  //   return `${servralUrl}/${uploadDoc}`;
  // }

  // isImage(uploadDoc: any): boolean {
  //   const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  //   const extension = this.getFileExtension(uploadDoc).toLowerCase();
  //   if (imageExtensions.includes(extension)) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // generateFileUrl(uploadDoc: any): string {
  //   const servralUrl = environment.servralUrl;
  //   return `${servralUrl}/${uploadDoc}`;
  // }

  // getFileName(uploadDoc: any): string {
  //   const pathParts = uploadDoc?.split('/');
  //   if (pathParts) {
  //     return pathParts[pathParts.length - 1];
  //   } else {
  //     return '';
  //   }
  // }

  // getFileExtension(filename: string): string {
  //   const parts = filename?.split('.');
  //   if (parts) {
  //     return parts[parts.length - 1];
  //   } else {
  //     return '';
  //   }
  // }
  basicFormPatch(getData: any) {
    this.serviceMasterForm.patchValue({
      service_name: getData.service_name,
      service_code: getData.hsn_sac_code,
      igst: getData.igst,
      cgst: getData.cgst,
      sgst: getData.sgst,
      sac_code_id: getData.sac_code_id,
      service_description: getData?.service_description,
      chart_of_account_id:getData?.chart_of_account_id
    });
  }
  getByIdRole() {
    this._commonService?.showLoader()
    this._configurationalMasterService.getByIdServiceMaster(this.service_id).subscribe((res: any) => {
      this._commonService?.hideLoader()
      // this.singleServiceMasterData = res.data;
      this.basicFormPatch(res.data)
    },(err:any) => {
      this._commonService?.hideLoader()
    })
  }
  updateForm(e: any) {


    // let val1 = this.serviceMasterForm.value;

    // this.serviceMasterForm.patchValue({
    //   service_name: val1.service_name,
    //   service_code: val1.hsn_sac_code,
    //   igst: val1.igst,
    //   cgst: val1.cgst,
    //   sgst: val1.sgst,
    //   sac_code_id: val1.sac_code_id
    // });

    this.entity_id = localStorage.getItem('selectedEntityId');


    let val = this.serviceMasterForm.value;



    const body = {
      cgst: val.cgst,
      sgst: val.sgst,
      igst: val.igst,
      sac_code_id:val.sac_code_id,
      service_code: val.service_code,
      chart_of_account_id: val.chart_of_account_id,
      service_name: val.service_name,
      service_description: val.service_description,
      entity_id: this.entity_id
    };
    this._commonService?.showLoader();
    this._configurationalMasterService
      .updateServiceMaster(this.service_id, body)
      .subscribe(
        (res: any) => {
          this._commonService?.hideLoader();
          this.toast.success(
            'Service updated successfully',
            'Updated successfully!'
          );
          this.router.navigate([
            'master/configurational-master/service-master',
          ]);
        },
        (err) => {
          this._commonService?.hideLoader();
          this.toast.error(
            'Something went wrong please try again',
            'Error Massage'
          );
        }
      );
  }
  entity_id:any;
  onSubmitForm() {

    let val1 = this.serviceMasterForm.value;
    this.entity_id = localStorage.getItem('selectedEntityId');

    this.serviceMasterForm?.get('cgst')?.patchValue(val1.igst / 2);
    this.serviceMasterForm?.get('sgst')?.patchValue(val1.igst / 2);

    let val = this.serviceMasterForm.value;

    // if (this.serviceMasterForm.invalid) {
    //   this.toast.error(
    //     'required fields should not be blank',
    //     'Required fields'
    //   );
    //   return;
    // }

    const body = {
      cgst: val.cgst,
      sgst: val.sgst,
      igst: val.igst,
      sac_code_id:val.sac_code_id,
      service_code: val.service_code,
      chart_of_account_id: val.chart_of_account_id,
      service_name: val.service_name,
      service_description: val.service_description,
      entity_id: this.entity_id
    };

    this._commonService?.showLoader();

    this._configurationalMasterService.createServiceMaster(body).subscribe(
      (res: any) => {
        this._commonService?.hideLoader();
        this.toast.success(
          'Service Added successfully',
          'Added successfully'
        );
        this.router.navigate(['master/configurational-master/service-master']);
      },
      (err) => {
        this._commonService?.hideLoader();

          this.toast.error(`${err.error.message}`, 'Error Message');



      }
    );
  }
  getuniqueNumber() {
    this.emp_master.getUniqueNumber().subscribe((res: any) => {
      this.uniquedata = res.data;

      this.serviceMasterForm.patchValue({
        request_no: this.uniquedata,
      });
      this.serviceMasterForm.controls['request_no']?.disable();
    });
  }
  serviceCategoryFilter(e: any) {
    const aa = e;
    let filteredVariable = this.getCat_data2.filter((item: any) =>
      aa.includes(item.service_category_name)
    );
    this.getCat_data = filteredVariable;
  }

  getSacCode(id:any){
    this._configurationalMasterService.getSacCode(id).subscribe((res:any)=>{
      this.sacCodeList = res?.data;
    })
  }

  onSacCodeChange(data:any){
    this.serviceMasterForm.get('igst')?.patchValue(data?.value);
  }
}
