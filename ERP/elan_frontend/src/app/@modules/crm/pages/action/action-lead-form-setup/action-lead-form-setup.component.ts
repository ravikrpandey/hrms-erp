import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { EmpListDialogComponent } from 'src/app/@shared/components/emp-list-dialog/emp-list-dialog.component';
import { AddLeadFormSetupDialogComponent } from '../../dialogs/add-lead-form-setup-dialog/add-lead-form-setup-dialog.component';
// import { DataService } from 'src/app/@shared/services/query-params/data.service';
@Component({
  selector: 'app-action-lead-form-setup',
  templateUrl: './action-lead-form-setup.component.html',
  styleUrls: ['./action-lead-form-setup.component.scss'],

})
export class ActionLeadFormSetupComponent implements OnInit {
  private onActionCallback: Function | undefined;
  assignAction: any;
  singleData: any = {};
  constructor(private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private employService: EmpRegistrationService,
    private toster: ToastrService,
    private _rbackService: RbacMasterService,
    // private dataService: DataService
  ) {
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService?.accessAssignAction();
  }
  public cellValue: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  params: any;
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.singleData = params.data;
    this.params = params;
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data.employee_id;
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  edit(e: any) {
    this.params.onActionPerform({ name: 'Relevant data from the action component' });
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
    const dialogRef = this.dialog.open(EmpListDialogComponent, {
      width: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      panelClass: 'full-screen-modal',
      data: { id: this.cellValue }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  addFieldValue() {
    this.router.navigate(["master/crm/create-field-value"], { queryParams: { id: this.singleData?.id } })

    // Access resolved data from the service
    // this.dataService.setResolvedData(this.singleData?.id);
    // const resolvedData = this.dataService.getResolvedData();
    // this.router.navigate(["master/crm/create-field-value"], { queryParams: { id: resolvedData } });
  }


}
