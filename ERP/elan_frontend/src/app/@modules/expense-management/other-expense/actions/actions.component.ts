import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent {
  public cellValue: any;
  approval: any;
  expense_approvel_status: any;
  status: string;
  cellValue1: any;
  assignAction: any;

  constructor(
    private route: Router,
    private travelrequestservice: TravelRequestService,
    private toast: ToastrService,
    private _rbackService: RbacMasterService,
    private _commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    this.tabnumber()
  }

  tabnumber() {
    this.travelrequestservice.currentStatus.subscribe(status => {
      if (status) {
        this.status = status;
      }
    });
  }

  agInit(params: ICellRendererParams): void {

    this.cellValue = this.getValueToDisplay(params);
    this.cellValue1 = params.data?.expense_request_id;
    this.approval = params.data.expense_final_status
    this.expense_approvel_status = params.data.expense_approvel_status

  }
  getValueToDisplay(params: ICellRendererParams) {


    return params.valueFormatted
      ? params.valueFormatted
      : params.data.id;
  }

  view() {
    if (this.status == "0") {
      this.route.navigate(['master/expense-management/other-expense/add-other-expense'], {
        queryParams: { id: this.cellValue, Type: "view" },
      })
    }
    else if (this.status == "1" || this.status == "2" || this.status == "3") {
      this.route.navigate(['/master/expense-management/other-expense/add-other-expense'], {
        queryParams: { id: this.cellValue1, Type: "view" },
      })
    }
  }

  edit() {
    this.route.navigate(['master/expense-management/other-expense/add-other-expense'], {
      queryParams: { id: this.cellValue, Type: "edit" },
    });
  }

  proceed_To_Approve() {
    this.route.navigate(['/master/expense-management/other-expense/add-other-expense'], {
      queryParams: { id: this.cellValue1, Type: "process-approval" },
    });
  }



  delete(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: 'Are you sure you want to remove it?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this._commonService?.showLoader()
        this.travelrequestservice.delete_expense_request(this.cellValue).subscribe(
          (res) => {
            this._commonService?.hideLoader()
            this.toast.success('Deleted successfully ');
            this.reloadCurrentRoute();
          },
          (err) => {
            this._commonService?.hideLoader()
            this.toast.error("Somthing went wrong Please try agin", "Error Message")

          }
        )
      }
    });
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
}
