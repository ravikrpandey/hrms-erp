import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
// import { EmpListDialogComponent } from '../emp-list-dialog/emp-list-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-assign-complain-action',
  templateUrl: './assign-complain-action.component.html',
  styleUrls: ['./assign-complain-action.component.scss']
})
export class AssignComplainActionComponent {
  assignAction: any;
  public cellValue: any;
  data: any;
  userRole: any;
  userRoleCheck: boolean =false;

  constructor(private route: Router,
    public dialog: MatDialog,
    private _configurationalMasterService: ConfigurationalmasterService,
    private toast: ToastrService,
    private _rbackService: RbacMasterService,
    private location: Location,
    private activeroute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    const empId = localStorage.getItem('signInUser');
    if (empId != null) {
      const signupUser = JSON.parse(empId);
      this.userRole= signupUser.role_id
      if(this.userRole === 28){
        this.userRoleCheck = true
      }
    }
    this.assignAction = this._rbackService.accessAssignAction();
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  agInit(params: ICellRendererParams): void {
    console.log(params.data);
    this.data = params.data
    this.cellValue = this.getValueToDisplay(params);

  }
  getValueToDisplay(params: ICellRendererParams) {

    return params.valueFormatted ? params.valueFormatted : params.data.id;
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
  openDialog(e: any) {
    e.stopPropagation();

    this.route.navigate(['master/crm-service/open-complaints/assign-center-add'], { queryParams: { id: this.cellValue, role: 'view' } });
  }

  detailslist(e: any) {
    e.stopPropagation();
    this.route.navigate(['master/crm-service/open-complaints/complain-details'], { queryParams: { id: this.cellValue, role: 'details' } });
  }
 
}
