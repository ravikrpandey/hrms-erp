import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DispatchListFormDialogComponent } from '../dispatch-list-form-dialog/dispatch-list-form-dialog.component';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
@Component({
  selector: 'dispatch-list-form-action',
  templateUrl: './dispatch-list-form-action.component.html',
  styleUrls: ['./dispatch-list-form-action.component.scss']
})
export class DispatchListFormActionComponent {
  assignAction: any;
  singleData: any = {};
  isChecked = false;
  checkBox: any;

  constructor(private route: Router,
    public dialog: MatDialog,
    private _configurationalMasterService: ConfigurationalmasterService,
    private toster: ToastrService,
    private $crm: CrmService,
    private _rbackService: RbacMasterService,
  ) {
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }
  public cellValue: any;


  // redirect(){
  //   // this.route.navigate(["master/warehouse-management/sales-order-form"]);
  // }


  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.singleData = params?.data;

  }
  getValueToDisplay(params: ICellRendererParams) {
    this.checkBox = params.data.status;
    if (this.checkBox === "ACTIVE") {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
    return params.valueFormatted
      ? params.valueFormatted
      : params.data.id;
  }

  openDialog(e: any) {

    const dialogRef = this.dialog.open(DispatchListFormDialogComponent, {
      data: { id: this.cellValue },

      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  // Form update start
  toggle(e: any, isChecked: boolean) {
    try {
      e.stopPropagation();
      let status;
      if (isChecked) status = "ACTIVE";
      else status = "INACTIVE";

      let body = {
        status: status,
      }
      this._configurationalMasterService.statuseProductMasterById(this.singleData.id, body).subscribe((response: any) => {
        if (response) {
          this.toster.success('Product Master Status updated..');
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
  // Form update end

}






