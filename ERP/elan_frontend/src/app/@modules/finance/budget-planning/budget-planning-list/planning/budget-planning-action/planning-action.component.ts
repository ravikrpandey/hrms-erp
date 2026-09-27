import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-planning-action',
  templateUrl: './planning-action.component.html',
  styleUrls: ['./planning-action.component.scss']
})
export class PlanningActionComponent {
  singleId:any;
  cellValue1:any;
  assignAction: any;
  fYearId: any;
  type: any;
  page: any;
  remark: any;
  status:any;
  dept_id:any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toaster: ToastrService,
    private prService: PurchaseRequestService,
    private finance: FinaceService
  ) {}

  ngOnInit(): void { 
    this.assignAction = this._rbackService.accessAssignAction();
  }
  public cellValue: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.fYearId = params.data.fYearId;
    this.type = params.data.type;
    this.page = params.data.page;
    this.cellValue1 = params.data;
    this.remark = params.data.remarks;
    this.status = params.data.approval_status;
    this.dept_id = params.data.dept_id;
  }

  getValueToDisplay(params: ICellRendererParams) {
    // console.log(params.data)
    return params.valueFormatted ? params.valueFormatted : params.data.budgetPlanning_Id
  }


  edit(e:any) {
    e.stopPropagation();
    this.router.navigate(['master/finance/budget-planning/create-budget-planning'], { queryParams: { planning_id: this.cellValue, id: this.fYearId, type:this.type, page: this.page},skipLocationChange: true})
  }

  edit2(e:any) {
    e.stopPropagation();
    this.router.navigate(['master/finance/budget-planning/create-budget-planning'], { queryParams: { planning_id: this.cellValue, id: this.fYearId, type:this.type, page: this.page},skipLocationChange: true})
  }

  mapCC(e:any){
    this.router.navigate(['master/finance/budget-planning/create-budget-planning'], { queryParams: { planning_id: this.cellValue, id: this.fYearId, type:this.type, page: this.page, dept_id: this.dept_id},skipLocationChange: true})
  }

  openDialog() {
  }

  view(e:any) {
    e.stopPropagation();
    this.router.navigate(['master/finance/budget-planning/create-budget-planning'], { queryParams: { planning_id: this.cellValue , mode:"view" , id: this.fYearId, type:this.type, page: this.page},skipLocationChange: true})
  }

  viewApproved(e:any) {
    e.stopPropagation();
    this.router.navigate(['master/finance/budget-planning/create-budget-planning'], { queryParams: { planning_id: this.cellValue , mode:"view" , id: this.fYearId, type:this.type, page: this.page},skipLocationChange: true})
  }

  // delete(e: any) {
  //   e.stopPropagation();
  //   Swal.fire({
  //     title: 'Do You Want to Remove?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     cancelButtonColor: "#f44336",
  //     confirmButtonColor: "#3f51b5",
  //     confirmButtonText: 'Yes',
  //     cancelButtonText: 'No'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.finance.deleteCostCenter(this.cellValue).subscribe(
  //         (res) => {
            
  //           this.toaster.success('Delete successfully ');
  //           this.reloadCurrentRoute();
  //         },
  //         (err) => {
  //           this.toaster.error("Somthing went wrong.. Please try agin", "Error Message")
            
  //         }
  //       )
  //     }
  //   });
  // } 
}
