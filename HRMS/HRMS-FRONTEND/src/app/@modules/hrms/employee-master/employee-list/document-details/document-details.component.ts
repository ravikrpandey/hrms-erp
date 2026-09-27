import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
// import { DMSService } from 'src/app/@shared/services/dms.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { environment } from 'src/app/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.scss']
})
export class DocumentDetailsComponent implements OnInit, AfterViewInit {
  documentForm: any;
  file: any;
  imageToUpload: any;
  imagePath: any;
  documentDetails: any;
  id: any;
  documentDetailss: any;
  employeId: any;
  empId: any;
  FilePaths: any = [];
  isSend: boolean = false;
  singleDocumentData: any;
  isDisable: boolean = false;
  curentIndex: any;
  selectedImg: any;
  pdfFile: any = '/assets/icons/pdfimg.png';
  docFile: any = '/assets/icons/word.png';
  excelFile: any = '/assets/icons/exc3.png';
  acceptedFiles: any = ['PDF', 'DOC', 'DOCX', 'JPEG', 'JPG', 'GIF', 'PNG']
  file_type: any;
  add_document: boolean = false;
  doc_id: any;
  show: boolean = true;
  documents_detail: any = [];
  baseUrl: any;
  action_type: any;

  constructor(private fb: FormBuilder,
    private activetedRoute: ActivatedRoute,
    private locatin: Location,
    private route: Router, private toastr: ToastrService,
    private recruitService: RecruitService,
    private toast: ToastrService,
    private employService: EmpRegistrationService,
    private $common: CommonService,
    private $miscellaneousService: MiscellaneousService,
    private http: HttpClient
  ) {
    this.baseUrl = environment.serverUrl;
    // documentName:new FormControl(null,Validators.required),
    this.documentForm = this.fb.group({
      document_name: new FormControl(null, Validators.required),
      document_description: new FormControl(null, Validators.required),
      documents: new FormControl(null),
    })

  }

  ngOnInit(): void {
    this.activetedRoute.queryParams.subscribe((params: any) => {

      this.id = params;
      this.action_type = this.id?.action_type;
      this.employeId = parseInt(this.id.employee_id);

      if (params.employee_idparams.employee_id) {
        this.getSingleDocument(params.employee_id)
      }
    })
    this.employService.setEmpTitle('DOCUMENT DETAILS')

    // if (this.employeId) {
    //   this.getSingleDocument(this.employeId);
    // };
  }

  ngAfterViewInit(): void {
    if (this.employeId) {
      this.getSingleDocument(this.employeId);
    };
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  onChange(e: any, i: any) {
    if (e.target.files && e.target.files[0]) {
      const data: FileList = e.target.files;

    }
  };

  getSingleDocument(id: any) {

    this.employService.getByUserId(id).subscribe((res: any) => {
      if (res) {
        this.singleDocumentData = res?.data;
        this.documents_detail = res?.data?.documents_detail;
      }
    }, (err) => {

    })
  }

  patchData(e: any): FormArray {
    return new FormArray(
      e.map((x: any) => {
        const obj = new FormGroup({});
        Object.keys(x).forEach(k => {
          obj.addControl(k, new FormControl(x[k]));
        });
        return obj;
      })
    );
  }

  onSubmitForm() {

    if (!this.documents_detail?.length) {
      return this.toastr.error('Add at least one document', 'Fields Error');
    }
    let req = {
      documents_detail: this.documents_detail,
      tab_type: "Document",
      employee_id: null,
    }

    if (this.employeId) {
      req.employee_id = this.employeId;
    }

    this.employService.basicSignUp(req).subscribe(
      (res: any) => {
        this.toastr.success('Created Successfully..');
        this.route.navigate(
          ['master/hrms/employee-master/employee-list/employee-create/contract-details'],
          { queryParams: { employee_id: this.id?.employee_id } }
        );
      },
      (err) => {
        if (err.status === 400) {
          this.toastr.error('Failed! Email is already in use!');
        } else if (err.status == 500) {
          this.toastr.error('bad request ');
        } else if (err.status == 404) {
          this.toastr.error(
            'Somthing went wrong.. Please try agin',
            'Error Massage'
          );
        } else {
          this.toastr.error('Login failed');
        }
      }
    );
  }

  initiateForm(): FormGroup {
    return this.fb.group({
      documentType: [''],
      documentName: [''],
      decriptionComment: [''],
      remark: [''],

    });
  };

  get getFormControls() {
    const control = this.documentForm.get('tableRows') as FormArray;
    return control;
  };

  get CF_1(): any { return this.documentForm.controls };

  addRow() {

    // if (this.singleDocumentData && this.singleDocumentData.length !== 0) {
    //   this.toastr.warning('You are not able to add new Document Details');
    // } else if (this.singleDocumentData && this.singleDocumentData.length === 0) {
    //   const tableRows = this.documentForm.get('tableRows') as FormArray;
    //   this.CF_1.tableRows.push(
    //     new FormGroup({
    //       document_type: new FormControl(null, [Validators.required]),
    //       document_name: new FormControl(null, [Validators.required]),
    //       description: new FormControl(null, [Validators.required]),
    //       document_file: new FormControl(null, [Validators.required]),
    //     })
    //   )
    //   for (let i = 1; i < this.CF_1.tableRows.controls.length; i++) {
    //      this.CF_1.tableRows.controls[i + this.curentIndex].isSend = false;
    //      this.CF_1.tableRows.controls[i + this.curentIndex].showLoader = false;        
    //   };
    // }

    // new code 
    if (this.documentForm.controls?.tableRows?.value && this.documentForm.controls?.tableRows?.value.length > 0) {
      let canAddNewRow = true;

      for (const obj of this.documentForm.controls?.tableRows?.value) {
        if (!obj.document_file && !obj.ExsitDocument_file) {
          canAddNewRow = false;
          break;
        }
      }

      if (canAddNewRow) {
        // Logic to add a new row
        const tableRows = this.documentForm.get('tableRows') as FormArray;
        this.CF_1.tableRows.push(
          new FormGroup({
            document_type: new FormControl(null, [Validators.required]),
            document_name: new FormControl(null, [Validators.required]),
            description: new FormControl(null, [Validators.required]),
            document_file: new FormControl(null, [Validators.required]),
          })
        )
        for (let i = 1; i < this.CF_1.tableRows.controls.length; i++) {
          this.CF_1.tableRows.controls[i + this.curentIndex].isSend = false;
          this.CF_1.tableRows.controls[i + this.curentIndex].showLoader = false;
        };
        // ... Add new row logic here
      } else {
        // Show error because some existing rows have empty document files
        this.toastr.error('Please add document details first');
        // Display an error message for the user
      }
    } else {
      // Allow to add a new row since there are no existing rows
      //   console.log("Adding a new row");
      //   const tableRows = this.documentForm.get('tableRows') as FormArray;
      //  this.CF_1.tableRows.push(
      //    new FormGroup({
      //      document_type: new FormControl(null, [Validators.required]),
      //      document_name: new FormControl(null, [Validators.required]),
      //      description: new FormControl(null, [Validators.required]),
      //      document_file: new FormControl(null, [Validators.required]),
      //    })
      //  )
      //  for (let i = 1; i < this.CF_1.tableRows.controls.length; i++) {
      //     this.CF_1.tableRows.controls[i + this.curentIndex].isSend = false;
      //     this.CF_1.tableRows.controls[i + this.curentIndex].showLoader = false;        
      //  };
      // ... Add new row logic here
    }


    // console.log(obj);


    // }
    //  if(this.show == true){
    //   const tableRows = this.documentForm.get('tableRows') as FormArray;
    //     this.CF_1.tableRows.push(
    //       new FormGroup({
    //         document_type: new FormControl(null, [Validators.required]),
    //         document_name: new FormControl(null, [Validators.required]),
    //         description: new FormControl(null, [Validators.required]),
    //         document_file: new FormControl(null, [Validators.required]),
    //       })
    //     )
    //     for (let i = 1; i < this.CF_1.tableRows.controls.length; i++) {
    //        this.CF_1.tableRows.controls[i + this.curentIndex].isSend = false;
    //        this.CF_1.tableRows.controls[i + this.curentIndex].showLoader = false;        
    //     };
    // }
    // else if(this.show == false){
    //   this.toastr.error('You are not able to add new Document Details');
    // }

  };

  sendAndUpdate(i: any, control: any) {
    this.curentIndex = i;
    if (control.invalid) {
      this.toastr.error("required fields should not be empty", "Required fields");
      return
    }
    // ! check if not matched document file to document type------------------:(
    let doc: any = `${control.value.document_file}`.split('.');
    let doc_file = doc[doc.length - 1].toUpperCase();
    let doc_type = control.value.document_type.toUpperCase();

    let exist = this.acceptedFiles.findIndex((e: any) => e === doc_file);
    if (exist === -1) {
      this.toastr.error("selected file format not acceptable", "File not acceptable");
      return
    }

    if (doc_file !== doc_type) {
      this.toastr.error("selected file did not match to document type", "Not Match");
      return
    }

    // ! modify document_file control from file path------------------:(
    for (let j = 0; j < this.FilePaths.length; j++) {
      if (this.FilePaths[j].index === i) {
        control.value.document_file = this.FilePaths[j].path
      };
    };
    const val = control.value;

    const data: any = {
      document_type: val.document_type,
      document_name: val.document_name,
      description: val.description,
      employee_id: this.employeId
    }
    const file = val.document_file;
    this.CF_1.tableRows.controls[i].showLoader = true;
    this.doc_id = control.value.emp_document_id;
    if (this.singleDocumentData && this.singleDocumentData.length === 0 || (this.doc_id == null || undefined)) {
      // !create documnet------------------:(
      this.employService.create_DocumentDetails(data, file).subscribe((res) => {

        this.CF_1.tableRows.controls[i].isSend = true;
        this.CF_1.tableRows.controls[i].showLoader = false;
        this.add_document = false;

        this.toastr.success("Document Details Submitted successfully");
        control.disable();
      }, (err) => {
        this.toastr.error("Something went wrong please try again", "Error Message");

        this.CF_1.tableRows.controls[i].isSend = false;
        this.CF_1.tableRows.controls[i].showLoader = false;
        this.add_document = true;
      }
      );
    } else {
      // ! update documnet ------------------:(
      const doc_id = control.value.emp_document_id;
      this.employService.update_DocumentDetails(doc_id, data, file).subscribe((res) => {

        this.CF_1.tableRows.controls[i].isSend = true;
        this.CF_1.tableRows.controls[i].showLoader = false;
        this.add_document = false;

        this.toastr.success("Document Details Updated successfully");
        control.disable();
        // this.route.navigate(['/hrms/employee-master/employ']);
      }, (err) => {
        this.toastr.error("Something went wrong please try again", "Error Message");

        this.CF_1.tableRows.controls[i].isSend = false;
        this.CF_1.tableRows.controls[i].showLoader = false;
      }
      );
    }
  }

  deleteSingleDoc(i: any, control: any,) {
    this.doc_id = control.value.emp_document_id;
    if (this.doc_id == null || undefined) {
      if (this.CF_1.tableRows.length > 1) {
        this.CF_1.tableRows.removeAt(i);
      } else {
        this.toastr.error("Can't Deleted", "must be one")
      }
    }
    else {
      if (this.CF_1.tableRows.length > 1) {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#be0000',
          cancelButtonColor: '#5d6c7c',
          confirmButtonText: 'Delete'
        }).then((result) => {
          if (result.isConfirmed) {
            this.employService.deleteDocument(control.value.emp_document_id).subscribe(
              (res) => {

                this.CF_1.tableRows.removeAt(i);
                this.toastr.success('Item delete successful', 'Delete successfully ');
              },
              (err) => {

                this.toastr.error('Somthing wrong please try again..!', 'Error Message ');
              }
            )
          };
        })
      } else {
        this.toastr.error("Can't Deleted", "must be one")
      };

    }
    // if ((this.singleDocumentData && this.singleDocumentData.length !== 0)) {
    //    if (this.CF_1.tableRows.length > 1) {
    //     Swal.fire({
    //       title: 'Are you sure?',
    //       text: "You won't be able to revert this!",
    //       icon: 'question',
    //       showCancelButton: true,
    //       confirmButtonColor: '#be0000',
    //       cancelButtonColor: '#5d6c7c',
    //       confirmButtonText: 'Delete'
    //     }).then((result) => {
    //       if (result.isConfirmed) {
    //         this.employService.deleteDocument(control.value.emp_document_id).subscribe(
    //           (res) => {

    //             this.CF_1.tableRows.removeAt(i);
    //             this.toastr.success('Item delete successful', 'Delete successfully ');
    //           },
    //           (err) => {

    //             this.toastr.error('Somthing wrong please try again..!', 'Error Message ');
    //           }
    //         )
    //       };
    //     })
    //   } else {
    //     this.toastr.error("Can't Deleted", "must be one")
    //   };
    // } else if (this.singleDocumentData && this.singleDocumentData.length === 0 || (this.doc_id == null || undefined)) {
    //   if (this.CF_1.tableRows.length > 1) {
    //     this.CF_1.tableRows.removeAt(i);
    //   } else {
    //     this.toastr.error("Can't Deleted", "must be one")
    //   }
    // };
  };

  seeDocuments(file: any, control: any) {
    // 
    if (!control.controls.document_file.value) {
      window.open(file, '_blank');
      // "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400"
    } else {
      this.toastr.warning('Selected file not uploaded');
    };
  };

  Skip() {
    this.route.navigate(
      ['master/hrms/employee-master/employee-list/employee-create/contract-details'],
      { queryParams: { employee_id: this.employeId } }
    );
  }

  // file start
  fileError: boolean = false;
  validateFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      const fileName = file.name;
      const extension = fileName.split('.').pop()?.toLowerCase();
      if (extension !== 'jpg' && extension !== 'jpeg' && extension !== 'png') {
        // Show error message or handle invalid file type here
        this.fileError = true;
        // Reset the file input to clear the invalid selection
        event.target.value = '';
      } else {
        // Proceed with handling the selected file
        this.fileError = false;
        this.onChange(event, null);
      }
    }
  }


  seePreview(path: string, imagePath: any) {


    if (!this.imagePath) {
      if (path) {
        Swal.fire({
          imageUrl: path,
          imageHeight: 250,
          imageAlt: 'Profile Image',
          confirmButtonColor: "#5d6c7c",
          confirmButtonText: 'Ok',
        })
      }
    } else {
      Swal.fire({
        imageUrl: imagePath,
        imageHeight: 250,
        imageAlt: 'Profile Image',
        confirmButtonColor: "#5d6c7c",
        confirmButtonText: 'Ok',
      })
    }
  };
  // file end

  // Add document start
  docIndex: null;
  addDocument() {
    
    this.documentForm.markAllAsTouched();
    if (this.documentForm.invalid) {
      return this.toastr.error('Required fields should not be empty', 'Fields Error');
    }
    if (!this.documents) {
      return this.toastr.error('Document field is required', 'Fields Error');
    }
    let value = this.documentForm?.value;
    value.documents = this.documents;
    if (this.docIndex != null) {
      this.documents_detail[this.docIndex] = value;
    }
    else {
      this.documents_detail.push(value);
    }
    this.docIndex = null;
    this.documentForm = null;
    this.documentForm = this.fb.group({
      document_name: ['', Validators.required],
      document_description: ['', Validators.required],
      documents: [''],
    });
    this.documents = null
  }


  // File upload start
  documents: any;
  uploadDoc(evemt: any) {
    try {

      let isValidExtension = this.$common.checkForValidFile(evemt, false, true, false);
      if (!isValidExtension) return this.documents = null;
      const formData = new FormData();
      if (evemt.target.files && evemt.target.files[0]) {
        formData.append('file', evemt.target.files[0]);
      }
      this.$miscellaneousService.documents(formData).subscribe((response: any) => {
        if (response) {
          this.documents = `uploaded_files/${response?.url}`;
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }

  viewImg() {

    window.open(this.baseUrl + '/' + this.documents, '_blank');
  }

  viewImage(url: any) {

    window.open(this.baseUrl + '/' + url, '_blank');
  }

  prevTab = () => {
    this.route.navigate(
      ['master/hrms/employee-master/employee-list/employee-create/payment-details'],
      { queryParams: { employee_id: this.employeId } }
    );
  }

  downloadFile(url: string) {
    this.http.get(url, { responseType: 'blob' });
    this.http.get(url, { responseType: 'blob' }).subscribe(
      (blob: Blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        const filename = this.getFilenameFromUrl(url);
        link.download = filename;
        link.click();
      },
      (error: HttpErrorResponse) => {
        console.error('Error downloading file:', error);
      }
    );
  }
  private getFilenameFromUrl(url: string): string {
    return url.substring(url.lastIndexOf('/') + 1);
  }


  // File upload end
  editRecord(index: any, data: any) {

    this.docIndex = index;
    this.documentForm.patchValue({
      document_name: data?.document_name,
      document_description: data?.document_description,
    })
    this.documents = data?.documents;
    console.log(this.documentForm);
  }

  deleteRecord(index: any) {
    this.documents_detail?.splice(index, 1)
  }

}
