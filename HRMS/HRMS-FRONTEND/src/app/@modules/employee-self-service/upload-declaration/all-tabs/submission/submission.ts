import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { environment } from 'src/app/environments/environment';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface DeclarationTotal {
  declaration_type: string;
  total_amount: string | number;
  document: string;
}

@Component({
  selector: 'app-submission',
  templateUrl: './submission.html',
  styleUrls: ['./submission.scss']
})
export class Submission implements OnInit {
  emp_id: string | null = null;
  rowData: any[] = [];
  declParentForm!: FormGroup;

  displayedColumns: string[] = ['sno', 'declaration_type', 'total_amount', 'document'];
  dataSource: DeclarationTotal[] = [];
  isLoading = true;
  errorMessage = '';
  totalAmount = 0;
  baseUrl: string;
  entity_id: any;
  id: any;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private activeroute: ActivatedRoute,
    private financeService: FinaceService,
    private payrollService: PayrollService,
    private $miscellaneousService: MiscellaneousService,
    private $common: CommonService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
     this.baseUrl = environment.serverUrl;
    this.declParentForm = this.fb.group({
      financial_year: ['', Validators.required]
    });

     this.entity_id = localStorage.getItem("selectedEntityId");
    this.emp_id = localStorage.getItem('EmpMainId');
    this.getFinancialYears();
    this.loadDeclarationTotals();
  }

  get financialYearControl() {
    return this.declParentForm.get('financial_year');
  }

  getFinancialYears(): void {
    this.financeService.getFinancialYearCopy().subscribe({
      next: (res: any) => {
        const response = res as ApiResponse<any[]>;
        this.rowData = response.data || [];
      },
      error: (err) => {
        this.rowData = [];
        console.error('Finance year fetch failed', err);
      }
    });
  }

  loadDeclarationTotals(): void {
    if (!this.emp_id) {
      this.errorMessage = 'Employee ID not found in localStorage.';
      return;
    }

    this.isLoading = true;

    this.payrollService.getAllSectionTotal(this.emp_id).subscribe({
      next: (res: any) => {
        const response = res as ApiResponse<DeclarationTotal[]>;
        if (response.code === 200) {
          this.dataSource = response.data || [];
          this.calculateTotalAmount();
        } else {
          this.errorMessage = response.message || 'Failed to load data.';
          this.dataSource = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error fetching data.';
        this.isLoading = false;
        console.error('API Error:', err);
      }
    });
  }

  calculateTotalAmount(): void {
    this.totalAmount = this.dataSource.reduce(
      (sum, item) => sum + Number(item.total_amount || 0),
      0
    );
  }

  viewDocument(url: string) {
    if (!url) return;
    window.open(this.baseUrl + '/' + url, '_blank');
  }
  viewImage(url: any) {

    window.open(this.baseUrl + '/' + url, '_blank');
  }
  getSNo(index: number): number {
    return index + 1;
  }

  formatDeclarationType(type: string): string {
    if (type.startsWith('HOUSE_ON_RENT')) {
      return type.replace('HOUSE_ON_RENT', 'House Rent');
    }
    return type;
  }

  isGrandTotal(element: DeclarationTotal): boolean {
    return element.declaration_type === 'GRAND_TOTAL';
  }

onSubmit() {
  const valParent = this.declParentForm.value;

 
  if (!valParent.financial_year) {
    this.toast.warning('Please select a Financial Year!');
    return;
  }

  
  if (!this.dataSource || this.dataSource.length === 0) {
    this.toast.warning('Please add at least one declaration!');
    return;
  }

 
  const declarationForm = this.dataSource
    .filter(d => d.declaration_type !== 'GRAND_TOTAL')
    .map(d => ({
      declaration_type: d.declaration_type,
      total_amount: d.total_amount,
      document: d.document || null
    }));

 
  const savingAmout = declarationForm.reduce((acc, curr) => acc + Number(curr.total_amount), 0);

 
  const payload = {
    entity_id: this.entity_id,
    login_id: this.emp_id,
    saving_amout: savingAmout,
    declaration_form: declarationForm,
    financial_year_id: valParent.financial_year
  };

  
  console.log('Payload to submit:', payload);
  
  if (this.id) {
    this.payrollService.updateUploaddeclaration(this.id, payload).subscribe(
      (res: any) => {
        this.toast.success(res.message || 'Updated successfully!');
        this.router.navigate(['/master/ess/upload-declaration']);
      },
      (err: any) => {
        const message = err?.error?.message || err?.message || 'Error in submission!';
        this.toast.error(message);
      }
    );
  } else {
    this.payrollService.createUploaddeclaration(payload).subscribe(
      (res: any) => {
        this.toast.success(res.message || 'Submitted successfully!');
        this.router.navigate(['/master/ess/upload-declaration']);
      },
      (err: any) => {
        const message = err?.error?.message || err?.message || 'Error in submission!';
        this.toast.error(message);
      }
    );
  }
}




}




  //  declChildForm: any;
  //   complaintId: any;
  //   id: any;
  //   mainId: any;
  //   allComplaint: any;
  //   reportingManager: any;
  //   employeId: any;
  //   getData: any;
  //   parm: any;
  //   firstLastName: any;
  //   propertyManager: any = [];
  //   personalIdData: any;
  //   nameAchieve: any;
  //   reportingManagerList: any = [];
  //   loginUser: any;
  //   createTaxslab: any;
  //   financeList: any;
  //   rowData: any;
  //   thumbnail_photo: string;
  //   file: any;
  //   entity_id: string | null;
  //   emp_id: string | null;
  //   Type: string;
  //   type: any;
  //   baseUrl: any;
  //   edit: any;
  //   documents: any = [];
  //   documents_detail: any = [];
  //   declParentForm: any;
  //   document: any = null;
  //   isEditing: any = false;
  //   declarationTypes: any;
   
      // {
  //     this.baseUrl = environment.serverUrl;
  //     this.declParentForm = this.fb.group({
  //       financial_year: new FormControl(null, Validators.required),
  //       taxable_amount: new FormControl(0)
  //     });
  //     this.declChildForm = this.fb.group({
  //       id: new FormControl(null),
  //       declaration_type: new FormControl(null),
  //       child_tax_amt: new FormControl(null),
  //       documents: new FormControl(null, Validators.required)
  //     });
  
  //   }
  
  //   ngOnInit(): void {
  
  //    
  
  //     this.emp_id = localStorage.getItem("EmpMainId");
  
  //     // console.log("ssssss",MyEmpIdLocalstorage);
  
  
      
  //     this.getAllDeclarationType();
  
  
  //     this.activeroute.queryParams.subscribe((params: any) => {
  //       this.id = params['id'];
  //       this.Type = params['mode'];
  //       this.edit = params['Type']
  
  //       if (this.id) {
  
  //         this.getUploaddeclarationbyid(this.id);
  //       }
  //     });
  //   }
  
  
  //   isReadonlyType() {
  
  //     return this.Type === 'view';
  
  //   }
  
  //   // goBack() {
  //   //   this.location.back();
  //   // }
  
  //  
  //   getUploaddeclarationbyid(id: any): void {
  //     this.payrollService.getUploaddeclarationbyid(id).subscribe((res: any) => {
  
  
  //       let val = res.data[0];
  
  //       this.documents = res.data[0]?.declaration_form
  
  //       this.declParentForm.patchValue({
  //         financial_year: val?.financial_year_id,
  //         entity_id: this.entity_id,
  //         login_id: this.emp_id,
  //         taxable_amount: res.data[0].saving_amout
  
  //       });
  //       this.declChildForm.patchValue({
  
  //       })
  //     });
  //   }
  
  //   uploadDoc(evemt: any) {
  //     try {
  
  //       let isValidExtension = this.$common.checkForValidFile(evemt, false, true, false);
  //       if (!isValidExtension) return this.document = null;
  //       const formData = new FormData();
  //       if (evemt.target.files && evemt.target.files[0]) {
  //         formData.append('file', evemt.target.files[0]);
  //       }
  //       this.$miscellaneousService.documents(formData).subscribe((response: any) => {
  //         if (response) {
  //           this.document = `uploaded_files/${response?.url}`;
  //         }
  //       }, (err: any) => {
  //         console.log(err);
  //       })
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  
  //   viewImg() {
  
  //     window.open(this.baseUrl + '/' + this.documents, '_blank');
  //   }
  
  //   viewImage(url: any) {
  
  //     window.open(this.baseUrl + '/' + url, '_blank');
  //   }
  
  //   isTypeSelected(typeId: any): boolean {
  //     return this.documents.some((doc: { declaration_type: any; }) => doc.declaration_type === typeId);
  //   }
  
  //   docIndex: null;
  
  //   addData() {
  //     let value = this.declChildForm?.value;
  //     if (!value.declaration_type || !value.child_tax_amt || !this.document || this.document.length === 0) {
  //       this.toast.warning('All fields are required!');
  //       return;
  //     }
  
  //     const isDuplicate = this.documents.some(
  //       (doc: any, idx: number) => doc.declaration_type === value.declaration_type && idx !== this.docIndex
  //     );
  //     if (isDuplicate) {
  //       this.toast.warning('This declaration type has already been added!');
  //       return;
  //     }
  
  
  
  //     value.documents = this.document;
  //     if (this.docIndex != null) {
  //       this.documents[this.docIndex] = value;
  //       this.docIndex = null;
  //     }
  //     else {
  //       let index = this.documents.length + 1;
  //       let data = {
  //         id: index,
  //         declaration_type: value?.declaration_type,
  //         documents: value?.documents,
  //         child_tax_amt: value?.child_tax_amt
  //       }
  //       this.documents.push(data);
  //     }
  //     this.docIndex = null;
  //     this.document = '';
  //     this.declChildForm = null;
  //     this.declChildForm = this.fb.group({
  //       documents: [''],
  //       declaration_type: [''],
  //       child_tax_amt: ['']
  //     });
  //     this.isEditing = false;
  //     this.updateTaxableAmount();
  
  //   }
  //   onSubmitForm() {
  //     const valParent = this.declParentForm.value;
  
  //     if (!valParent.financial_year) {
  //       this.toast.warning('Please select a Financial Year!');
  //       return;
  //     }
  
  //     if (!this.documents || this.documents.length === 0) {
  //       this.toast.warning('Please add at least one List of Declarations!');
  //       return;
  //     }
  
  //     const data = {
  //       financial_year_id: valParent.financial_year,
  //       saving_amout: valParent.taxable_amount,
  //       declaration_form: this.documents,
  //       entity_id: this.entity_id,
  //       login_id: this.emp_id,
  //       approval_status:"PENDING",
  //       remark: "Pending Verification"
  //     };
  
  //     if (this.id) {
  //       this.payrollService.updateUploaddeclaration(this.id, data).subscribe(
  //         (res: any) => {
  //           this.toast.success(res.message);
  //           this.router.navigate(['/master/ess/upload-declaration']);
  //         },
  //         (err) => {
  //           if (err.code == 400) {
  //             this.toast.error(err.message);
  //           } else {
  //             this.toast.error('Error in submission!');
  //           }
  //         }
  //       );
  //     } else {
  //       this.payrollService.createUploaddeclaration(data).subscribe(
  //         (res: any) => {
  //           this.toast.success(res.message);
  //           this.router.navigate(['/master/ess/upload-declaration']);
  //         },
  //         (err) => {
  //           if (err?.error?.code == 400) {
  //             this.toast.error(err.error.message);
  //           } else {
  //             this.toast.error('Error in submission!');
  //           }
  //         }
  //       );
  //     }
  //   }
  
  //   downloadFile(url: string) {
  //     this.http.get(url, { responseType: 'blob' });
  //     this.http.get(url, { responseType: 'blob' }).subscribe(
  //       (blob: Blob) => {
  //         const link = document.createElement('a');
  //         link.href = window.URL.createObjectURL(blob);
  //         const filename = this.getFilenameFromUrl(url);
  //         link.download = filename;
  //         link.click();
  //       },
  //       (error: HttpErrorResponse) => {
  //         console.error('Error downloading file:', error);
  //       }
  //     );
  //   }
  
  //   private getFilenameFromUrl(url: string): string {
  //     return url.substring(url.lastIndexOf('/') + 1);
  //   }
  
  //   editRecord(index: any, data: any) {
  //     this.isEditing = true;
  //     this.docIndex = index;
  //     this.declChildForm.patchValue({
  //       declaration_type: data?.declaration_type,
  //       child_tax_amt: data?.child_tax_amt
  //     })
  //     this.document = data?.documents;
  
  //   }
  
  //   deleteRecord(index: any) {
  //     this.documents?.splice(index, 1)
  //     this.updateTaxableAmount();
  //   }
  
  //   reLoad() {
  //     history.back();
  //   }
  
  
  //   getAllDeclarationType() {
  //     this.payrollService.DeclrationType().subscribe(
  //       (res: any) => {
  //         this.declarationTypes = res.data;
  //       },
  //       (err: any) => {
  //         this.declarationTypes = [];
  //       }
  //     );
  //   }
  
  //   updateTaxableAmount() {
  //     if (this.documents && this.documents.length > 0) {
  //       const total = this.documents.reduce((acc: number, item: any) => {
  //         const amt = parseFloat(item.child_tax_amt) || 0;
  //         return acc + amt;
  //       }, 0);
  //       this.declParentForm.patchValue({
  //         taxable_amount: total
  //       });
  //     } else {
  //       this.declParentForm.patchValue({
  //         taxable_amount: 0
  //       });
  //     }
  //   }


// }
