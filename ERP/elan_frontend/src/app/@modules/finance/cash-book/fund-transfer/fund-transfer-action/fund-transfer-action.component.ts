
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import Swal from 'sweetalert2';
import { SalesManagementService } from 'src/app/@modules/sales-management/sales-management-service/sales-management.service';

@Component({
  selector: 'app-fund-transfer-action',
  templateUrl: './fund-transfer-action.component.html',
  styleUrls: ['./fund-transfer-action.component.scss']
})
export class FundTransferActionComponent {
  quotation_doc_id: any;
  assignAction: any;

  status: any;
  data:any
  approval_status:string='';
  finalApproveStatus:any;
  employee_id:any;
  level:number=0;
  pushBackStatus:any;
  latest_approval_status:any;
  getUserRole:any;
  loginEmpId:any;
  role:any;
  quotation_id:any;

  constructor(
    private salesManagementService: SalesManagementService,
    private route: Router,
    private _rbackService: RbacMasterService,
    private recruitService: RecruitService,
    private toast: ToastrService,
    private _empMasterService: EmpMasterService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.loginEmpId = localStorage.getItem("EmpMainId");
    let user:any = localStorage.getItem('signInUser');
    this.role = JSON.parse(user);

 const signInUserData = localStorage.getItem('signInUser');
 if (signInUserData) {
   const signInUserObject = JSON.parse(signInUserData);
   this.getUserRole = signInUserObject.role;
 } else {
   console.log('Value for signInUser not found in localStorage');
 }
  }
  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    
        this.finalApproveStatus = params.data?.status;
    this.status = params?.data?.latest_approval_status;
    this.latest_approval_status = params?.data?.latest_approval_status;
    this.pushBackStatus = params?.data?.push_back_status;
    this.level=parseInt(params?.data?.level);
    this.employee_id = params?.data?.employee_id;
    this.approval_status =  params?.data?.approval_status? params.data.approval_status:'';
this.data= params?.data?.id
// this.quotation_id = params.data?.quotation_id;
    this.cellValue = this.getValueToDisplay(params);
  }


//   agInit(params: ICellRendererParams): void {
    
//     this.finalApproveStatus = params.data?.status;
//     this.status = params?.data?.latest_approval_status;
//     this.latest_approval_status = params?.data?.latest_approval_status;
//     this.level=parseInt(params?.data?.level);
//     this.employee_id = params?.data?.sales_rep_id;
//     this.approval_status =  params?.data?.approval_status? params.data.approval_status:'';
// this.data= params?.data?.id
//     this.cellValue = this.getValueToDisplay(params);
//   }






  getValueToDisplay(params: ICellRendererParams) {
    // Quotation

    if (params.data.id) {
      // this.quotation_doc_id = params.data.quotation_doc_code;
      this.assignAction = this._rbackService.accessAssignAction();
      return params.data.id;
    }
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }


  view(e: any) {
    e.stopPropagation();
    this.route.navigate(['/master/finance/cash-books/fund_transfer/create-fr'], {
      queryParams: { id: this.cellValue ,view:'view'},
    });
  }

  proceed(e:any){
    e.stopPropagation();
    this.route.navigate(['/master/finance/cash-books/fund_transfer/create-fr'], {
      queryParams: { id: this.cellValue ,view:'proceed'},
    });
  }

  edit(e: any) {
    e.stopPropagation();
    this.route.navigate(['/master/sales-management/proforma/create-proformas'], {
      queryParams: { id: this.cellValue ,edit:'edit'},
    });
  }

  deleteQuotation() {
    console.log(this.cellValue, ' this.cellValue this.cellValue');
    Swal.fire({
      title: 'Are you sure want to remove it?',

      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#5d6c7c',
      confirmButtonColor: '#f44336',
      confirmButtonText: 'Delete!',
      cancelButtonText: 'Skip',
    }).then((result) => {
      if (result.value) {
        this.salesManagementService
          .deleteQuotation(this.cellValue)
          .subscribe((res) => {
            window.location.reload();
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }


  reloadCurrentRoute() {

    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });


  }
  navigateToCreateSalesInvoice(){
    this.route.navigate(['master/sales-management/sales/create-sales-invoice'], {
      queryParams: { proforma_id: this.data },
    });
  }

}
