import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { CostCenterDilogComponent } from '../cost-center-dilog/cost-center-dilog.component';

@Component({
  selector: 'app-cost-center-action',
  templateUrl: './cost-center-action.component.html',
  styleUrls: ['./cost-center-action.component.scss']
})
export class CostCenterActionComponent {
  singleId:any;
  cellValue1:any;
  assignAction: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
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
    this.cellValue1 = params.data;
    
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data.cost_center_id
  }

  // openDialog() {

  //   const dialogRef
  //     = this.dialog.open(PrItemDilogComponent, {
  //       width: '30%',
  //       // maxWidth: '100vw',
  //       // maxHeight: '100vh',
  //       // height: '100%',
  //       // panelClass: 'full-screen-modal',
  //       data: { id: this.cellValue }

  //     });

  //   dialogRef.afterClosed().subscribe(result => {
  //     
  //   });
  //   

  // }

  edit(e:any) {
    e.stopPropagation();
    this.router.navigate(['master/finance/cost-center/create-cost'], { queryParams: { id: this.cellValue}})
  }

  extend(e:any) {
    e.stopPropagation();
    this.router.navigate(['master/finance/cost-center/extend'], { queryParams: { id: this.cellValue}})
  }
  openDialog() {
    const dialogRef = this.dialog.open(CostCenterDilogComponent, {
      data: { id: this.cellValue },
      width: '30%',
    })
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  view(e:any) {
    e.stopPropagation();
    this.router.navigate(['master/finance/cost-center/create-cost'], { queryParams: { id: this.cellValue , mode:"view"}})
  }

  delete(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: 'Do You Want to Remove?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.finance.deleteCostCenter(this.cellValue).subscribe(
          (res) => {
            
            this.toaster.success('Delete successfully ');
            this.reloadCurrentRoute();
          },
          (err) => {
            this.toaster.error("Somthing went wrong.. Please try agin", "Error Message")
            
          }
        )
      }
    });
  } 
}
