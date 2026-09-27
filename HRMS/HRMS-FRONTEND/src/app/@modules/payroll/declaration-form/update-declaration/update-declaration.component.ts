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
  selector: 'app-update-declaration',
  templateUrl: './update-declaration.component.html',
  styleUrls: ['./update-declaration.component.scss']
})
export class UpdateDeclarationComponent {
 
  createComplaint: FormGroup;
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
      
      financial_year: new FormControl(null, Validators.required),
      taxable_amount: new FormControl(null, Validators.required),
      documents: new FormControl(null, Validators.required),
      remarks:new FormControl(null)
   
    });
  
  }
  
  ngOnInit(): void {

    this.entity_id = localStorage.getItem("selectedEntityId");

    this.emp_id = localStorage.getItem("EmpMainId");

    // console.log("ssssss",MyEmpIdLocalstorage);
    

    this.getFinancialYears();


    
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params['id'];  
      this.Type = params['mode']

      if (this.id) {

        this.getUploaddeclarationbyid(this.id);
      }
    });
  }
  

  isReadonlyType() {
    
    return this.Type === 'view' ;

  }

  private getFilenameFromUrl(url: string): string {
    return url.substring(url.lastIndexOf('/') + 1);
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
  

  getFinancialYears() { 
    this.financeService.getFinancialYear().subscribe((res: any) => {
      this.rowData = res.data;
      console.log("Finance Years List",this.rowData);
      },(err:any) => {
      this.rowData = []
    })
  }
 
  getUploaddeclarationbyid(id: any): void {
    this.payrollService.getUploaddeclarationbyid(id).subscribe((res:any) => {
 
      let val = res.data[0]; 
      let declaration_form =val.declaration_form;
      this.documents = declaration_form
        
      this.createComplaint.patchValue({
        financial_year: val.financial_year_id,
        // taxable_amount: val.non_taxable_amount,
        // documents:declaration_form,
        entity_id:this.entity_id,
        login_id:this.emp_id,
        taxable_amount:res.data[0]?.saving_amout

      });
    });
  }

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
          this.documents = response?.url;
        }
      }, (err: any) => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }

  viewImg() {
    const baseUrl = this.baseUrl.endsWith('/') ? this.baseUrl : this.baseUrl + '/';
    const fileUrl = baseUrl + 'uploaded_files/' + this.documents;
    window.open(fileUrl, '_blank');
  }

  viewImage(url: any) {

    window.open(this.baseUrl + '/' + url, '_blank');
  }
  
      


  onSubmitForm(e: any) {
    let val = this.createComplaint.value;

    const data = {
      // financial_year_id: val.financial_year,
      // non_taxable_amount: val.taxable_amount,
      // declaration_form:this.documents,
      // entity_id:this.entity_id,
      // login_id:this.emp_id,
      documents: this.documents,
      approval_id :this.id,
      remark:val.remarks,
      status : "APPROVED",
      login_id:this.emp_id,
      saving_amout:val?.taxable_amount,

    };
console.log(data);
 if (this.id) {
  
      this.payrollService.updatedDeclaration(data).subscribe(
        (res: any) => {
          this.toast.success(res.message);
          this.router.navigate(['master/payroll/declaration-form/approved-list-declare']);
        },
        (err) => {
          if (err.status == 400) {
            this.toast.error('Something went wrong!');
          } else {
            this.toast.error('Error in submission!');
          }
        }
      );
    }
  }
  
  goBackReject() {
    let val = this.createComplaint.value;

    const data = {
      // financial_year_id: val.financial_year,
      // non_taxable_amount: val.taxable_amount,
      // declaration_form:this.documents,
      // entity_id:this.entity_id,
      // login_id:this.emp_id,
      // documents: this.documents,
      approval_id :this.id,
      remark:val.remarks,
      status : "REJECTED",
      login_id:this.emp_id,
      saving_amout:val?.taxable_amount

    };
console.log(data);
 if (this.id) {
  
      this.payrollService.updatedDeclaration(data).subscribe(
        (res: any) => {
          this.toast.success(res.message);
          this.router.navigate(['master/payroll/declaration-form/reject-list-declare']);
        },
        (err) => {
          if (err.status == 400) {
            this.toast.error('Something went wrong!');
          } else {
            this.toast.error('Error in submission!');
          }
        }
      );
    }
  }
  
  

  reLoad() {
    // window.location.reload();
    history.back();
  }
  goBack(){
    this.route.navigate(['master/payroll/declaration-form/pending-declare'])
  }

}
