import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import moment from 'moment';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/environments/environment';


import { Location } from '@angular/common';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';



@Component({
  selector: 'app-upload-declaration-create',
  templateUrl: './upload-declaration-create.component.html',
  styleUrls: ['./upload-declaration-create.component.scss']
})
export class UploadDeclarationCreateComponent {

  
  createComplaint:any;
  complaintId: any;
  id: any;
  mainId: any;
  allComplaint: any;
  reportingManager: any;
  employeId: any;
  getData: any;
  parm: any;
  firstLastName: any;
  propertyManager: any = [];
  personalIdData: any;
  nameAchieve: any;
  reportingManagerList: any = [];
  loginUser: any;
  createTaxslab: any;
  financeList: any;
  rowData:any;
  thumbnail_photo: string;
  file: any;
  entity_id: string | null;
  emp_id: string | null;
  Type: string;
  type: any;
  baseUrl: any;
  edit: any;
  documents: any  = [];
  documents_detail: any = [];
  createComplaintParent:any;
  document:any = null;
  isEditing:any= false;
  constructor(

    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private route: Router,
    private activeroute: ActivatedRoute,
    private location: Location,
    private financeService:FinaceService,
    private payrollService:PayrollService,
    private $miscellaneousService:MiscellaneousService,
    private $common: CommonService,
    private http: HttpClient
  ) {
    this.baseUrl = environment.serverUrl;
    this.createComplaint = this.fb.group({
      id: new FormControl(null),
     
      documents: new FormControl(null, Validators.required),
      document_name:new FormControl(null)
   
    });
    this.createComplaintParent = this.fb.group({
    
      financial_year: new FormControl(null, Validators.required),
      taxable_amount: new FormControl(0),
     
   
    });
  }
  
  ngOnInit(): void {

    this.entity_id = localStorage.getItem("selectedEntityId");

    this.emp_id = localStorage.getItem("EmpMainId");

    // console.log("ssssss",MyEmpIdLocalstorage);
    

    this.getFinancialYears();


    
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params['id'];  
      this.Type = params['mode'];
      this.edit = params['Type']

      if (this.id) {

        this.getUploaddeclarationbyid(this.id);
      }
    });
  }
  

  isReadonlyType() {
    
    return this.Type === 'view' ;

  }
  
  goBack() {
    this.location.back();
  }

  getFinancialYears() { 
    this.financeService.getFinancialYearCopy().subscribe((res: any) => {
      this.rowData = res.data;
      console.log("Finance Years List",this.rowData);
      },(err:any) => {
      this.rowData = []
    })
  }
 
  getUploaddeclarationbyid(id: any): void {
    this.payrollService.getUploaddeclarationbyid(id).subscribe((res:any) => {

 
      let val = res.data[0]; 
      // let declaration_form =val?.declaration_form;
      this.documents = res.data[0]?.declaration_form
        
      this.createComplaintParent.patchValue({
        financial_year: val?.financial_year_id,
        // taxable_amount: val.non_taxable_amount,
        // documents:res.data?.declaration_form,
        entity_id:this.entity_id,
        login_id:this.emp_id,
        taxable_amount:res.data[0].saving_amout

      });
      this.createComplaint.patchValue({

      })
      debugger;
    });
  }

  uploadDoc(evemt: any) {
    try {

      let isValidExtension = this.$common.checkForValidFile(evemt, false, true, false);
      if (!isValidExtension) return this.document = null;
      const formData = new FormData();
      if (evemt.target.files && evemt.target.files[0]) {
        formData.append('file', evemt.target.files[0]);
      }
      this.$miscellaneousService.documents(formData).subscribe((response: any) => {
        if (response) {
          this.document = `uploaded_files/${response?.url}`;
        }
      }, (err: any) => {
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
  
      
  docIndex: null;
  addDocument() {

    // this.documentForm.markAllAsTouched();
    // if (this.documentForm.invalid) {
    //   return this.toastr.error('Required fields should not be empty', 'Fields Error');
    // }
    // if (!this.documents) {
    //   return this.toastr.error('Document field is required', 'Fields Error');
    // }
    let value = this.createComplaint?.value;
    value.documents = this.document;
    if (this.docIndex != null) {
      this.documents[this.docIndex] = value;
      // this.documents[this.docIndex].documents = this.document;
      this.docIndex = null;
    }
    else {
    console.log(value);
    let index = this.documents.length + 1;
      let data={
        id:index, 
        document_name:value?.document_name,
        documents:value?.documents,
      }
      console.log("++++++",this.documents);
      this.documents.push(data);
    }
    this.docIndex = null;
    this.createComplaint = null;
    this.createComplaint = this.fb.group({
    
      documents: [''],
      document_name:['']
    });
    this.isEditing = false;
  }
  onSubmitForm() {
    let val = this.createComplaint.value;
    // [{id: "1",  document_name: "fixd depoit" , form_name : "fixed_defposti.pdf"}, 
    // {id: "2",  document_name: "fixd depoit" , form_name : "fixed_defposti.pdf"}]
    let valParent=this.createComplaintParent.value;
    console.log(val);
    
    const data = {
      financial_year_id:valParent.financial_year,
      saving_amout:valParent.taxable_amount,
      declaration_form: this.documents,
      entity_id:this.entity_id,
      login_id:this.emp_id,
      
      // documents: this.documents,
    
    };
console.log(data);

    // this.payrollService.createUploaddeclaration(data).subscribe(
    //   (res: any) => {
    //     this.toast.success(res.message);
    //     this.router.navigate(['/master/ess/upload-declaration']);
    //   },
    //   (err) => {
    //     if (err.status == 400) {
    //       this.toast.error('Something went wrong!');
    //     } else {
    //       this.toast.error('Error in submission!');
    //     }
    //   }
    // );
  
 
    if (this.id) {
      debugger;
      this.payrollService.updateUploaddeclaration(this.id, data).subscribe(
        (res: any) => {
          this.toast.success(res.message);
          this.router.navigate(['/master/ess/upload-declaration']);
        },
        (err) => {
          if (err.code == 400) {
            this.toast.error(err.message);
          } else {
            this.toast.error('Error in submission!');
          }
        }
      );
    } else {
      debugger;
      this.payrollService.createUploaddeclaration(data).subscribe(
        (res: any) => {
          this.toast.success(res.message);
          this.router.navigate(['/master/ess/upload-declaration']);
        },
        (err) => {
          console.log("+++++",err)
          if (err?.error?.code == 400) {
            this.toast.error(err.error.message);
          } else {
            this.toast.error('Error in submission!');
          }
        }
      );
    
    }
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
  
  editRecord(index: any, data: any) {
    this.isEditing = true;
    this.docIndex = index;
    this.createComplaint.patchValue({
      document_name: data?.document_name,
    })
    this.document = data?.documents;
    console.log(this.createComplaint);
  }

  deleteRecord(index: any) {
    this.documents?.splice(index, 1)
  }

  reLoad() {
    // window.location.reload();
    history.back();
  }


}
