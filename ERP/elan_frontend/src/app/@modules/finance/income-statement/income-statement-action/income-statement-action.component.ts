import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-income-statement-action',
  templateUrl: './income-statement-action.component.html',
  styleUrls: ['./income-statement-action.component.scss']
})
export class IncomeStatementActionComponent {
  assignAction: any;
  approvalMode : any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private toaster: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private entityService: EntityMasterService
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
    if ( params.data.approveMode ) {
      this.approvalMode = true;
    }else {
      this.approvalMode = false;
    }
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data.id;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
  // openDialog() {
  //   const dialogRef = this.dialog.open(ViewComponent, {
  //     width: '35%',
  //     // maxWidth: '100vw',
  //     // maxHeight: '100vh',
  //     // height: '100%',
  //     // panelClass: 'full-screen-modal',
  //     data: { id: this.cellValue },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {});
  // }

  edit(e: any) {
    e.stopPropagation();
    this.router.navigate(['master/finance/income-statement/generate-income-statement'], {
      queryParams: { id: this.cellValue,mode:'view',page:'approve' },
    });
  }
  view(e: any) {
    e.stopPropagation();
    this.router.navigate(['master/finance/income-statement/generate-income-statement'], {
      queryParams: { id: this.cellValue,mode:'view' },
    });
  }
  delete(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: 'Are you sure you want to Remove it?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.entityService.deleteEntity(this.cellValue).subscribe(
          (res) => { 
            this.toaster.success('Deleted successfully ');
            this.reloadCurrentRoute();
          },
          (err) => {
            this.toaster.error("Somthing went wrong Please try agin", "Error Message")
          }
        )
      }
    });
  } 
}
