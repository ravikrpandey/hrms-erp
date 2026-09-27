import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-document-details-form',
  templateUrl: './document-details-form.component.html',
  styleUrls: ['./document-details-form.component.scss'],
})
export class DocumentDetailsFormComponent {
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
  acceptedFiles: any = ['PDF', 'DOC', 'DOCX', 'JPEG', 'JPG', 'GIF', 'PNG'];
  submit: boolean = false;
  show: boolean = false;

  constructor(
    private fb: FormBuilder,
    private activetedRoute: ActivatedRoute,
    // private locatin: Location,
    private route: Router,
    private toastr: ToastrService,
    private employService: EmpRegistrationService,
    private recruitService: RecruitService,
    private _empRegistration: EmpRegistrationService,
  ) {
    // documentName:new FormControl(null,Validators.required),
    this.documentForm = this.fb.group({
      Document_details: new FormArray([
        new FormGroup({
          document_type: new FormControl(null, [Validators.required]),
          document_name: new FormControl(null, [Validators.required]),
          description: new FormControl(null, [Validators.required]),
          docs: new FormControl(null, [Validators.required, this.fileTypeValidator]),
        }),
      ]),
    });
  }
  fileTypeValidator(control: FormControl): { [key: string]: any } | null {
    const file = control?.value ? control?.value?.name.split('.') : null;
    const fileExe = file ? file[file.length - 1].toLowerCase() : null;

    if (fileExe && !['pdf', 'jpeg', 'jpg', 'doc', 'png'].includes(fileExe)) {
      return { invalidFileType: true };
    }
    return null;
  }
  ngOnInit(): void {
    // this.activetedRoute.queryParams.subscribe((params: any) => {
    //   this.id = params.employee_id;
    //   console.log(this.id, 'sds');
      
    //   this.employeId = parseInt(this.id);
    // });
    this.employeId = localStorage.getItem('employee_id');
   let condidateId =  localStorage.getItem('condidateId')
   if (condidateId) {
     this.trackOuterForm(condidateId)
   }
    if (this.employeId) {
      this.getOuterCondidateData(this.employeId)
    }
    this.employService.setEmpTitle('DOCUMENT DETAILS');
  }
  isSaveButtonDisabled(index: number): boolean {
    const documentTypeControl = this.documentForm.get(`Document_details.${index}.document_type`);
    return documentTypeControl ? documentTypeControl.invalid : false;
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  singleData: any;
  getOuterCondidateData(employee_id:any){

    this._empRegistration.getOuterEmployeeData(employee_id).subscribe((res:any)=>{
      console.log(res);
      
      this.singleData =res.data;
      console.log(this.singleData);
      
setTimeout(() => {
  this.basicFormPatch(res?.data)
}, 100);

  

    })
  

  }
  basicFormPatch(apiResponse:any){
// Get the 'document_data' array from your API response
const documentData = apiResponse.document_data;


if (documentData && documentData.length > 0) {
  const documentDetailsArray = this.documentForm.get('Document_details') as FormArray;
  documentDetailsArray.clear();
  documentData.forEach((detail: any) => {
    documentDetailsArray.push(this.fb.group({
      document_type: new FormControl(detail.document_type, [Validators.required]),
      document_name: new FormControl(detail.document_name, [Validators.required]),
      description: new FormControl(detail.description, [Validators.required]),
      docs: new FormControl(null), // Initialize as null, you may set the value as needed
      // You can add more form controls as per your requirement
      // For instance, you might have a form control for storing the file path or status
      fileImage: new FormControl(detail.attchment), // Example: Assigning the file path from API to a form control
    }));
  });
  // this.CF_1.Document_details.controls[i].isSend = true;
  console.log(documentDetailsArray);
  
}
  }
  errorMessages: string[] = [];
  onChange(e: any, i: any) {
    const documentDetailsArray = this.documentForm.get('Document_details') as FormArray;
    const currentFormGroup = documentDetailsArray.at(i) as FormGroup;
    if (e.target.files && e.target.files[0]) {
      const data: FileList = e.target.files;
      this.imageToUpload = data.item(0);
      const file = this.imageToUpload?.name.split('.');
      const fileExe = file[file.length - 1].toLowerCase();
  
      if (!['pdf', 'jpeg', 'jpg', 'doc', 'png'].includes(fileExe)) {
        // Handle invalid file types here or display an error message
        this.errorMessages[i] = 'Invalid file type. Please upload a valid file.';
        this.toastr.error('Invalid file types here')
        this.invalidFileTypeFlags[i] = true;
        return;
      }
      switch (fileExe) {
        case 'pdf':
          currentFormGroup.get('document_type')?.setValue('PDF');
          // Other logic for handling PDF files
          break;
        case 'doc':
          currentFormGroup.get('document_type')?.setValue('DOC');
          // Other logic for handling DOC files
          break;
          case 'doc':
  currentFormGroup.get('document_type')?.setValue('DOC');
  // Set icon for DOC files or handle its representation
  // For example, set a specific image path or class indicating a DOC file icon
  currentFormGroup.get('iconPath')?.setValue('path_to_doc_icon');
  break;
  
        // ... (handle other file types similarly)
      }
      this.errorMessages[i] = '';
      this.invalidFileTypeFlags[i] = false;
  
      // Update the form control with the selected file
      // this.CF_1.Document_details.controls[i].get('docs').setValue(file);
      const reader = new FileReader();
  
      switch (fileExe) {
        case 'pdf':
          this.CF_1.Document_details.controls[i].imagePath = this.pdfFile;
          break;
        case 'doc':
          // Handle DOC file type
          break;
        case 'jpeg':
        case 'jpg':
        case 'png':
          reader.onload = (event: any) => {
            this.imagePath = event.target.result;
            this.CF_1.Document_details.controls[i].imagePath = this.imagePath;
          };
          reader.readAsDataURL(this.imageToUpload);
          break;
        default:
          // Handle other valid file types here
          break;
      }
    }
    this.addFiles(this.imageToUpload, i);
  }
  

  addFiles(filepath: any, i: any) {
    // ! create an array of selected file path
    let result: any = [];
    result.push({ path: filepath, index: i });

    if (result.length !== 0) {
      for (let j = 0; j < result.length; j++) {
        let index = this.FilePaths.findIndex(
          (e: any) => e.index === result[j].index
        );
        if (index === -1) {
          this.FilePaths.push({ path: filepath, index: i });
        } else {
          this.FilePaths[index].path = filepath;
        }
      }
    }
    //
  }

  getSingleDocument(id: any) {
    this.employService.getSingleDocument(id).subscribe(
      (res: any) => {
        this.singleDocumentData = res.data;
        let data: any = [];
        if (res.data.length != 0) {
          for (let i = 0; i <= res.data.length - 1; i++) {
            let fileExe = res.data[i].document_type;
            if (fileExe === 'PDF') {
              res.data[i].fileImage = this.pdfFile;
            } else if (fileExe === 'XLSX') {
              res.data[i].fileImage = this.excelFile;
            } else if (fileExe === 'CSV') {
              res.data[i].fileImage = this.excelFile;
            } else if (fileExe === 'DOC') {
              res.data[i].fileImage = this.docFile;
            } else if (fileExe === 'DOCX') {
              res.data[i].fileImage = this.docFile;
            } else if (fileExe === 'DOTX') {
              res.data[i].fileImage = this.docFile;
            } else if (fileExe === 'JPEG' || 'JPG' || 'GIF' || 'PNG') {
              res.data[i].fileImage = res.data[i].docs;
            }

            data.push({
              document_type: res.data[i].document_type,
              document_name: res.data[i].document_name,
              description: res.data[i].description,
              ExsitDocument_file: res.data[i].docs,
              docs: null,
              emp_document_id: res.data[i].emp_document_id,
              fileImage: res.data[i].fileImage,
            });
          }
          this.CF_1.Document_details = this.patchData(data);
        }
      },
      (err) => {}
    );
  }

  patchData(e: any): FormArray {
    return new FormArray(
      e.map((x: any) => {
        const obj = new FormGroup({});
        Object.keys(x).forEach((k) => {
          obj.addControl(k, new FormControl(x[k]));
        });
        return obj;
      })
    );
  }

  onSubmitForm() {
    this.route.navigate(['master/hrms/employee-master/employ']);
    this.toastr.success('Submited successfully');
  }

  initiateForm(): FormGroup {
    return this.fb.group({
      documentType: [''],
      documentName: [''],
      decriptionComment: [''],
      remark: [''],
    });
  }

  get getFormControls() {
    const control = this.documentForm.get('Document_details') as FormArray;
    return control;
  }

  get CF_1(): any {
    return this.documentForm.controls;
  }
  invalidFileTypeFlags: boolean[] = [];
  addRow() {
    const Document_details = this.documentForm.get('Document_details') as FormArray;
  if (Document_details) {
    this.invalidFileTypeFlags.push(false); // Initialize flag for the new row
    Document_details.push(
      new FormGroup({
        document_type: new FormControl(null, [Validators.required]),
        document_name: new FormControl(null, [Validators.required]),
        description: new FormControl(null, [Validators.required]),
        docs: new FormControl(null, [Validators.required]),
      })
    );

    // Ensure CF_1 is defined and has Document_details
    if (this.CF_1 && this.CF_1.Document_details) {
      for (let i = 0; i < Document_details.controls.length; i++) {
        const index = i + this.curentIndex;
        if (this.CF_1.Document_details.controls[index]) {
          this.CF_1.Document_details.controls[index].isSend = false;
          this.CF_1.Document_details.controls[index].showLoader = false;
        }
      }
    }
  }
  
  }



  deleteSingleDoc(i: any, control: any) {
    if (this.CF_1.Document_details.length > 1) {
      this.CF_1.Document_details.removeAt(i);
    } else {
      this.toastr.error("Can't Deleted", 'must be one');
    }
  }

  seeDocuments(file: any, control: any) {
    //
    console.log(file, control);
    
    const fileImagePath = control.get('fileImage')?.value;
    if (fileImagePath) {
      window.open(fileImagePath, '_blank');
      // "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400"
    } else {
      this.toastr.warning('Selected file not uploaded');
    }
  }

  send_doc(i: any, controls: any) {
    if (this.invalidFileTypeFlags[i]) {
      this.toastr.error(this.errorMessages[i]);
      return;
    }
  
    // const val = controls.value;
    console.log(controls);
    
    console.log('controls', controls.value);
    let val = controls.value;
    

    const formData = new FormData();
    formData.append('document_name', val.document_name);
    formData.append('document_type', val.document_type);
    formData.append('description', val.description);
    formData.append('docs', this.imageToUpload);
    this.recruitService.upload_doc(this.employeId, formData).subscribe(
      (res: any) => {
        if (res) {
          this.submit = true;
          this.show == true;     
          this.CF_1.Document_details.controls[i].isSend = true;
          this.CF_1.Document_details.controls[i].showLoader = false;
          
          this.toastr.success(res.message);
          // this.toastr.success('Document Details Submitted successfully');
          controls.disable();
        }
      },
      (err: any) => {
        this.toastr.error(err.error.message);
      }
    );
  }
  cancel() {
    this.route.navigate(['new-employee-form/employee-details-form']);
  }

  trackOuterForm(id:any){
    console.log(id);
    
    this._empRegistration.TrackOuterform(id).subscribe((res: any) => {
     console.log(Boolean(res.data.status), 'res');
     let apiResponse = res?.data
     console.log(apiResponse.status1);
     
     this.openPopupForSuccess(apiResponse.status1);
     
   
      // this.basicFormPatch(this.getData, this.propertyManager);
    });
   
   }

   openPopupForSuccess(status1:any) {
    if (status1=="True") {
      Swal.fire({
        title: 'Thank You!',
        text: "Your Form is Already Submitted !",
        icon: 'success',
        showCancelButton: false,
        cancelButtonColor: "#f44336",
        confirmButtonColor: "#3f51b5",
        showConfirmButton: false,
        cancelButtonText: 'No',
        allowOutsideClick: false,
      });
    } else {
      // Close the popup
      Swal.close();
    }
  }
  save() {
    if (this.submit) {
     let condidateId = localStorage.getItem('condidateId')
      let data = {
        final_form_submit: "True",
        condidateId:condidateId,
        employeId:  this.employeId,
      }
      this._empRegistration.employeeFormSubmit(this.employeId, data).subscribe((res:any)=>{
        Swal.fire({
          title: 'Thank You!',
          text: "Your application was successfully submitted",
          icon: 'success',
          showCancelButton: false,
          cancelButtonColor: "#f44336",
          confirmButtonColor: "#3f51b5",
          showConfirmButton: false,
          cancelButtonText: 'No',
          allowOutsideClick:false,
          
        })
  
        this.toastr.success('Your application was successfully submitted');
        
      })
  
    
  
      // employeeFormSubmit
      // this.route.navigate(['new-employee-form/employee-details-form']);
  
    } else {
      this.toastr.error('Please Upload Your Documents');
    }
  }
}
