import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';
import { CostCenterDilogComponent } from '../../cost-center/cost-center-dilog/cost-center-dilog.component';

@Component({
  selector: 'app-profit-center-action',
  templateUrl: './profit-center-action.component.html',
  styleUrls: ['./profit-center-action.component.scss']
})
export class ProfitCenterActionComponent {
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
    return params.valueFormatted ? params.valueFormatted : params.data.id
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
    this.router.navigate(['master/finance/profit-center/add-profit-center'], { queryParams: { id: this.cellValue}})
  }



  view(e:any) {
    e.stopPropagation();
    this.router.navigate(['master/finance/profit-center/add-profit-center'], { queryParams: { id: this.cellValue , mode:"view"}})
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
        this.finance.deleteProfitCenter(this.cellValue).subscribe(
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
