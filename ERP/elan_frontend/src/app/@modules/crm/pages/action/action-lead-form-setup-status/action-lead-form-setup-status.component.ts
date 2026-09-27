import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { EmpListDialogComponent } from 'src/app/@shared/components/emp-list-dialog/emp-list-dialog.component';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { AddLeadFormSetupDialogComponent } from '../../dialogs/add-lead-form-setup-dialog/add-lead-form-setup-dialog.component';
@Component({
  selector: 'app-action-lead-form-setup-status',
  templateUrl: './action-lead-form-setup-status.component.html',
  styleUrls: ['./action-lead-form-setup-status.component.scss']
})
export class ActionLeadFormSetupStatusComponent implements OnInit {
  assignAction: any;
  singleData: any = {};
  isChecked = false;
  checkBox: any;
  params: any;

  constructor(private route: Router,
    public dialog: MatDialog,
    private employService: EmpRegistrationService,
    private toster: ToastrService,
    private $crm: CrmService,
    private _rbackService: RbacMasterService,
  ) {
  }

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
    this.singleData = params?.data;
    this.params = params;
  }
  getValueToDisplay(params: ICellRendererParams) {
    this.checkBox = params.data.status;
    if (this.checkBox === 1) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }


    return params.valueFormatted
      ? params.valueFormatted
      : params.data.customer_type_id;
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  edit(e: any) {
    console.log(this.singleData);
    const dialogRef = this.dialog.open(AddLeadFormSetupDialogComponent, {
      width: '600px',
      data: { id: this.singleData },
    });
    dialogRef.afterClosed().subscribe((result) => {

    });

  }

  delete(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: 'Are you sure to delete this Employee ?',
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          status: "INACTIVE"
        }
        this.employService.deleteSingleEmployee(this.cellValue, data).subscribe(
          (res: any) => {

            this.toster.success('Deleted Successfully')
            this.reloadCurrentRoute();
          }, (err) => {

            this.toster.success('Something went wrong please try again', 'Error Message')
          }
        )
      };
    });
  }
  openDialog() {
    const dialogRef
      = this.dialog.open(EmpListDialogComponent, {
        width: '100%',
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        panelClass: 'full-screen-modal',
        data: { id: this.cellValue }
      });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  // Form update start
  toggle(e: any, isChecked: boolean) {
    try {
      if (this.singleData?.field_name == 'Status') {
        return
      }
      console.log(this.singleData);
      e.stopPropagation();
      let status;
      if (isChecked) status = 1;
      else status = 0;

      let body = {
        ...this.singleData,
        status: status,
      }
      this.$crm.updateLeadFormSetup(body).subscribe((response: any) => {
        if (response) {
          this.toster.success('Lead form setup successfully updated..');
          this.params.onActionPerform({ name: 'Status successfully changed' });
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
