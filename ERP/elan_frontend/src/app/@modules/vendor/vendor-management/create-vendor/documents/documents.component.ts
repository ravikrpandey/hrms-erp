import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { HrServiceService } from 'src/app/@shared/services/hr-service.service';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import { UploadDocument } from '../upload-document/upload-document';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { RejectRemarkComponent } from '../reject-remark/reject-remark.component';
import { MatDialog } from '@angular/material/dialog';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { environment } from 'src/app/environments/environment';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  docForm: FormGroup;
  file: File; id: number;
  vendor_id: any;
  editDocData: any;
  imageToUpload: any;
  imagePath: any;
  vendorName: any;
  status: any;
  checked: boolean = false;
  arrayDataPush: any[] = [];
  fileUpload: any;
  priorCondition: boolean = false;
  editBankData: any;
  type: any;
  check_notification: any;
  fileExtention: any;
  extenstionCheck: any;
  @ViewChild('fileInput') fileInput: any | undefined;
  indexDetail: any = null;
  documentView: any;
  accountHolderNameExists: any;
  constructor(
    private route: Router,
    private vendorService: VendorManagementService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private activeroute: ActivatedRoute,
    public dialog: MatDialog,
    private recruitService: RecruitService,
    private _commonService : CommonService
  ) {
    this.rowClass = 'rowClass';

    this.docForm = this.fb.group({
      //  vendor_management_id: new FormControl(null),
      document_type: new FormControl(null),
      document_name: new FormControl(null),
      upload_document: new FormControl(null),
      expiry_date: new FormControl(null),
      check_box: new FormControl(null),
      prior_notice_perid: new FormControl(null),
      check_notification: new FormControl(null)
    })
    this.getAllDocs();
  }

  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.vendor_id = params.vandor_id || params.id;
      this.status = params.status;
      this.type = params?.type
      this.getByVendor()
      if (this.status) {
        this.docForm.controls['document_type'].disable();
        this.docForm.controls['upload_document'].disable();
        this.docForm.controls['expiry_date'].disable();
        this.docForm.controls['remarks'].disable();
      }
    });

    this._commonService?.showLoader()
    this.vendorService.getVendorById(this.vendor_id).subscribe((res: any) => {
      this._commonService?.hideLoader()
      this.editDocData = res.data;
      this.docForm.patchValue({
        document_type: this.editDocData?.document_type,
        expiry_date: this.editDocData?.expiry_date,
        remarks: this.editDocData?.remarks,
        document_name: this.editDocData?.document_name
        //  upload_document: this.editDocData?.upload_document,

      })
    },(err:any) => {
      this._commonService?.hideLoader()
    })

    this.getAllDocs();
    this.getAllVendorName();
  }

  getByVendor() {
    this._commonService?.showLoader()
    this.vendorService.getByVendor(this.vendor_id).subscribe((res: any) => {
      this.editBankData = res.data;
      this.arrayDataPush = res.data?.doc_details;
      this._commonService?.hideLoader()
      // this.getStateByCountry(Number(this.editBankData?.country_id));
      // this.getCityByState((Number(this.editBankData?.state_id)));

    },(err:any) => {
      this._commonService?.hideLoader()
    })
  }
  checking(event: any) {
    console.log(this.checked); // Log current value of checked
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log('Checkbox checked:', isChecked);
    //     let val=this.docForm.value;
    //     console.log(val);
    this.docForm.get('prior_notice_perid')?.reset();

    if (isChecked == true) {
      this.priorCondition = true;
    } else {
      this.priorCondition = false; 

    }

  }
  public rowData: any;
  public columnDefs = [
    {
      headerName: 'DOCUMENT TYPE',
      field: 'document_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'DOCUMENT NAME',
      field: 'document_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'UPLOAD DOCUMENT',
      field: 'upload_document',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        return `<a href=${params.data.upload_document} target="_blank">See Doc</a>`

      },

    },
    {
      headerName: 'EXPIRY DATE',
      field: 'expiry_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      //valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 150,
      valueFormatter: (params: any) => {
        return moment(new Date(params.value)).format('LL')
      },
    },
    {
      headerName: 'REMARKS',
      field: 'remarks',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 150,
    },

  ];
  bankData: any;

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

  }
  generateImageUrl() {
    return environment.servralUrl + '/uploaded_files' + '/'
  }

  checkName(acc:any){
    console.log(acc.value);
    const accountHolderNameExists = this.arrayDataPush.some((item: { document_name: any; }) => 
          item.document_name === acc.value
        );
    this.accountHolderNameExists=accountHolderNameExists
        console.log(accountHolderNameExists,'accountHolderNameExists');
        if (this.accountHolderNameExists) {
          this.toast.error('Document Name already exists!');
          return;
        }
      }
  addDocumetn() {
    let val=this.docForm.value;
    if (val?.document_type === null) {
      this.toast.warning('Please Add The Document Details');

      return;
    }
    console.log(this.fileExtention,'this.fileExtention');
    console.log(this.extenstionCheck,'this.extenstionCheck');
    
    if (this.extenstionCheck?.toLowerCase() !== this.fileExtention?.toLowerCase()) {
      // Show warning message
      this.toast.warning("Please Attach Valid File.");
      // this.imageToUpload = null;
      return;
    }
    // const accountHolderNameExists = this.arrayDataPush.some((item: { document_name: any; }) => 
    //   item.document_name === val?.document_name
    // );
  
    // if (accountHolderNameExists) {
    //   this.toast.error('Document Name already exists!');
    //   return;
    // }
    if (this.accountHolderNameExists) {
      this.toast.error('Document Name already exists!');
      return;
    }

    console.log(val);

    if (val?.check_notification === true) {
      this.check_notification = "YES"
    } else if (val?.check_notification === false) {
      this.check_notification = "NO"

    }

    let data = {
      document_type: val?.document_type,
      document_name: val?.document_name,
      upload_doc: this.fileUpload,
      expired_date: moment(val?.expiry_date).format('YYYY-MM-DD'),
      notice_day: val?.prior_notice_perid,
      notification_required: this.check_notification,

    }
    console.log(data, 'data');
    if (!this.arrayDataPush) {
      this.arrayDataPush = [];
    }
    if (this.indexDetail !== null && this.indexDetail >= 0) {
      // alert("updated")
      this.arrayDataPush[this.indexDetail] = data;
    } else {
      this.arrayDataPush.push(data)
    }
    this.indexDetail = null;
    this.priorCondition=false
    this.docForm.patchValue({ check_notification: false })
    this.docForm.get('document_type')?.reset();
    this.docForm.get('document_name')?.reset();
    this.docForm.get('expiry_date')?.reset();
    this.docForm.get('prior_notice_perid')?.reset();
    this.fileInput.nativeElement.value = '';
    this.imageToUpload = null


  }

  fileCheck(e: any) {
    console.log(e, 'eee');
    this.fileExtention = e?.value;
  }
  submitDocument() {

    let val = this.docForm.value;
    console.log(val);

    if (val?.check_notification === true) {
      this.check_notification = "YES"
    }

    let data = {
      id: this.vendor_id,
      tab_type: "Document_Details",
      doc_item: this.arrayDataPush,

    }

    console.log(data, 'data');

    this._commonService?.showLoader()
    this.vendorService.createVendorNew(data).subscribe((res: any) => {
      if (res.code == 200) {
        this._commonService?.hideLoader()
        this.toast.success(res.message);
        this.vendor_id = res.data;
        if (this.type == "Edit") {
          this.route.navigate(
            ['master/vendor/vendor-list/create-vendor/account-payble'],
            { queryParams: { id: this.vendor_id,type:"Edit"} }
          );
        }else{
          this.route.navigate(
            ['master/vendor/vendor-list/create-vendor/account-payble'],
            { queryParams: { id: this.vendor_id } }
          );
        }
     
      }
    }, (err) => {
      this._commonService?.hideLoader()
      this.toast.error(err.error.message);
    })

  }
  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  addDoc(path: any) {
    this.route.navigate([path]);
  }

  onCancel(path: any) {
    this.route.navigate([path])
  }

  onChange(e: any) {
    if (this.fileExtention == undefined) {
      this.toast.error("First Select The Document Type");
      return
    } else {
      if (e.target.files && e.target.files[0]) {
        const data: FileList = e.target.files;
        this.imageToUpload = data.item(0) || null;

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePath = e.target.result;
          console.log(this.imagePath, 'this.imagePath');

        };
        reader.readAsDataURL(this.imageToUpload);
      }
      console.log(this.imageToUpload, 'this.imagePath');
      let nameFile = this.imageToUpload?.name;
      console.log(nameFile, 'nameFile');

      let parts = nameFile.split('.');

      // Get the last part of the array (which is the file extension)
      let extension = parts[parts?.length - 1];

      console.log(extension);
      console.log(this.fileExtention, 'this.fileExtention');

      this.extenstionCheck = extension;
      if (extension.toLowerCase() !== this.fileExtention.toLowerCase()) {

        this.toast.warning("Please Attach Valid File.");
        // this.imageToUpload = null;
        return;
      }
      let formData = new FormData();

      formData.append('file', this.imageToUpload);

      this.recruitService.documentsUpdate(formData).subscribe((res: any) => {
        console.log(res, 'reessss');
        this.fileUpload = res?.url;
      })
    }


  }

  seePreview(path: string, imagePath: any) {
    if (!this.imagePath) {
      if (path) {
        Swal.fire({
          imageUrl: path,
          imageHeight: 250,
          imageAlt: 'Uploaded Document',
          confirmButtonColor: "#858586",
          confirmButtonText: 'Ok',
        })
      }
    } else {
      Swal.fire({
        imageUrl: imagePath,
        imageHeight: 250,
        imageAlt: 'Profile Image',
        confirmButtonColor: "#858586",
        confirmButtonText: 'Ok',
      })
    }
  };

  updateDocument() {
    if (this.docForm.invalid) {
      this.toast.error('Required fields should not be empty', 'Fields Error');

      return;
    }
    var formData: any = new FormData();
    formData.append('document_type', this.docForm.value.document_type);
    formData.append('document_name', this.docForm.value.document_name);
    formData.append('expiry_date', this.docForm.value.expiry_date);
    formData.append('remarks', this.docForm.value.remarks);
    formData.append('upload_document', this.imageToUpload);
    formData.append('document_status', 'verify');
    this.vendorService.updateDocument(this.vendor_id, formData).subscribe((res: any) => {
      this.bankData = res.data;
      if (res) {
        this.toast.success(res.message);
        this.route.navigate(['master/vendor/vendor-list/unapproved-list'])
      }
    })
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  deletData(data: any) {
    console.log(data, 'data');
    console.log(data, 'data');
 
if(data?.id){
  // alert("delete")
  this._commonService?.showLoader()
  this.vendorService.deleteDocVendor(data?.id).subscribe((res:any)=>{
    this._commonService?.hideLoader()
    console.log(res,'resssss');
  data.isDeleted = true;

    const newArrayData = this.arrayDataPush.filter((data: any) => !data.isDeleted);

    console.log(newArrayData, 'newArrayData');
    this.arrayDataPush = newArrayData
    // this.id=res.data;
  },(err:any) => {
    this._commonService?.hideLoader()
  })
}else{
  data.isDeleted = true;

  const newArrayData = this.arrayDataPush.filter((data: any) => !data.isDeleted);

  console.log(newArrayData, 'newArrayData');
  this.arrayDataPush = newArrayData
}
    
  }

  editData(data: any, i: any) {
    console.log(i, 'iii');
    console.log(data, 'data');
     this.indexDetail = i;
    this.documentView = data?.upload_doc;
    this.fileExtention=data?.document_type;
    this.extenstionCheck=data?.document_type
    this.docForm.patchValue({
      document_type: data?.document_type,
      document_name: data?.document_name,

      expiry_date: data?.expired_date,
      check_box: data?.check_box,
      prior_notice_perid: data?.notice_day,
      check_notification: data?.notification_required
    })

    if (data?.notification_required === "NO") {
      this.priorCondition = false;
      this.docForm.patchValue({
        check_notification:false
      })
    }else{  
      this.priorCondition = true;
      this.docForm.patchValue({
        check_notification:true
      })

    }

  }
  addDocs() {
    if (this.docForm.invalid) {
      this.toast.error('Required fields should not be empty', 'Fields Error');

      return;
    }
    var formData: any = new FormData();
    // formData.append('vendor_management_id', this.docForm.value.vendor_management_id);
    formData.append('document_type', this.docForm.value.document_type);
    formData.append('document_name', this.docForm.value.document_name);
    formData.append('upload_document', this.imageToUpload);
    formData.append('expiry_date', this.docForm.value.expiry_date);
    formData.append('remarks', this.docForm.value.remarks);
    this.vendorService.addDocument(formData).subscribe((res: any) => {
      this.bankData = res.data;
      if (res.code == 200) {
        this.toast.success(res.message);
        this.reloadCurrentRoute();
      }
    }, (err) => {

      if (err.status === 400) {

        this.toast.error(err.error.message);
      }

      if (err.status === 405) {

        this.toast.error(err.error.message);
      }
      else if (err.status == 500) {
        this.toast.error(err.error.message)
      }
      else {
        this.toast.error('Something Went Wrong!!')
      }
    })
  }

  getAllDocs() {
    this._commonService?.showLoader()
    this.vendorService.getAllDocs().subscribe((res: any) => {
      this.rowData = res.data;
      this._commonService?.hideLoader()
    },(err:any) => {
      this._commonService?.hideLoader()
    })
  }

  getAllVendorName() {
    this._commonService?.showLoader()
    this.vendorService.getAllVendorName().subscribe((res: any) => {
      this.vendorName = res.data;
      this._commonService?.hideLoader()
    },(err:any) => {
      this._commonService?.hideLoader()
    })
  }

  rejectVendor(e: any) {

    const dialogRef = this.dialog.open(RejectRemarkComponent, { width: '400px', data: this.vendor_id });
    dialogRef.afterClosed().subscribe(result => {

    })

  }

  onReject() {
    Swal.fire({
      title: 'Are you sure want to Reject?',
      // text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#858586',
      confirmButtonColor: '#f44336',
      confirmButtonText: 'Yes',
      cancelButtonText: 'NO',
    }).then((result) => {
      if (result.value) {
        let data = {
          vendor_status: "REJECTED",
        }
        this._commonService?.showLoader()
        this.vendorService.updateStatus(this.vendor_id, data).subscribe((res: any) => {
          this._commonService?.hideLoader()
          console.log("success", res.data)
          if (res.code == 200) {
            this.toast.success('Account Rejected Successfully');
            this.route.navigate(['/master/vendor/vendor-management/vendor-list/rejected-list'])
          }
        },(err:any) => {
          this._commonService?.hideLoader()
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }


  accountApproval() {
    let data = {
      vendor_status: "ACCOUNT APPROVED",
    }
    this._commonService?.showLoader()
    this.vendorService.updateStatus(this.vendor_id, data).subscribe((res: any) => {
      this._commonService?.hideLoader()
      console.log("success", res.data)
      if (res.code == 200) {
        this.toast.success('Account Approved Successfully');
        this.route.navigate(['/master/vendor/vendor-management/vendor-list/approved-list'])
      }
    },(err:any) => {
      this._commonService?.hideLoader()
    })
  }

}
