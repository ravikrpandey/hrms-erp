import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { DesignationDialogComponent } from 'src/app/@modules/itticketing/configurationalmaster/designation/designation-dialog/designation-dialog.component';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { HelpdeskService } from 'src/app/@shared/services/HelpDeskService/helpdesk.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
})
export class ActionComponent {
  singleId: any;
  assignAction: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toaster: ToastrService,
    private $helpdestService: HelpdeskService
  ) {
    // this.data = localStorage.getItem("jobId");
    //
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

  singleData: any;
  id: any;
  agInit(params: ICellRendererParams): void {
    this.singleData = params.data;
    this.cellValue = this.getValueToDisplay(params);
    params.data = this.cellValue;
    this.id = params.data;
    console.log("????????????",this.id)
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.value;
  }

  refresh(params: ICellRendererParams): boolean {
    if (params) {
      const data: any = {
        designation_name: params.data.designation_name.trim(),
        status: params.data.status,
      };
      console.log(params.data, 'dswgasjhg');
    } else {
      this.toaster.error(
        'designation_name is All Ready Exits!',
        'Error Message'
      );
    }
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  createDepartment(data: any) {
    this._configurationalmasterService.createDesignation(data).subscribe(
      (res: any) => {
        this.toaster.success('Designation Created Successfully');
        this.reloadCurrentRoute();
      },
      (err: any) => {
        this.toaster.error(
          'designation_name is All Ready Exits!',
          'Error Message'
        );
      }
    );
  }

  openDialog() {
    this.route.navigate(['/master/ess/my-tickets/create-my-ticket'], {
      queryParams: { id: this.cellValue, actionType: 'view' },
    });
  }

  editDesig: any = 'Designation';
  edit(event: any) {
    this.route.navigate(['/master/ess/my-tickets/create-my-ticket'], {
      queryParams: { id: this.cellValue, actionType: 'edit' },
    });
  }

  delete() {
    // event.stopPropagation();
    Swal.fire({
      title: 'Are you sure you want to Remove it?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#f44336',
      confirmButtonColor: '#3f51b5',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.$helpdestService
          .deleteTheTicketCategory( this.id)
          .subscribe(
            (res) => {
              this.toaster.success('Deleted successfully ');
              this.reloadCurrentRoute();
            },
            (err) => {
              this.toaster.error(
                'Somthing went wrong Please try agin',
                'Error Message'
              );
            }
          );
      }
    });
  }
}
