import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-transport-request-action',
  templateUrl: './transport-request-action.component.html',
  styleUrls: ['./transport-request-action.component.scss']
})
export class TransportRequestActionComponent implements OnInit {

singleId: any;
  assignAction: any;
  showAction: boolean = false;
  fullRowData:any;
  toaster: any;
  emp_id:any;
  getData: { status: string; approver: string; };
  constructor(
    private route: Router,
    public dialog: MatDialog,
    public toast : ToastrService,
    private _rbackService: RbacMasterService,
    private transport_service :TransportManagementService
  ) {
    const fullUrl = window.location.href;
    if (fullUrl.includes('pending-request-list')) {
    this.showAction = true;
    } else {
      this.showAction = false;
    }
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    this.emp_id = localStorage.getItem('EmpMainId')
  }
  public cellValue: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
    // 
    this.cellValue = this.getValueToDisplay(params);
    this.fullRowData = params.data.status_type;
    console.log("cell", this.fullRowData)

  }

  getValueToDisplay(params: ICellRendererParams) {


    return params.valueFormatted ? params.valueFormatted : params.data.id
  }

  refresh(params: ICellRendererParams): boolean {

    this.cellValue = this.getValueToDisplay(params);
  
    return true;
  }



  view(e:any) {
    this.route.navigate(['/master/transport-management/transport-request/add-new-request'], {
      queryParams: { id: this.cellValue, status: 'view' }
    });
  }
  editDesig: any;

  edit(e: any) {
    this.route.navigate(['/master/transport-management/transport-request/add-new-request'], {
      queryParams: { id: this.cellValue, status: 'update' }
    });
  }

delete(event: any) {
  event.stopPropagation();
  Swal.fire({
    title: 'Are you sure want to Remove?',
    icon: 'warning',
    showCancelButton: true,
    cancelButtonColor: "#f44336",
    confirmButtonColor: "#3f51b5",
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      this.transport_service.DeleteTransportRequestById(this.cellValue).subscribe(
        (res: any) => {
          if(res){
            this.reloadCurrentRoute();
          }

        },
        (err: any) => {
          this.toaster.error("Something went wrong. Please try again", "Error Message");
        }
      );
    }
  });
}



//   delete(event: any) {
//   event.stopPropagation();
//   Swal.fire({
//     title: 'Are you sure want to Remossve?',
//     icon: 'warning',
//     showCancelButton: true,
//     cancelButtonColor: "#f44336",
//     confirmButtonColor: "#3f51b5",
//     confirmButtonText: 'Yes',
//     cancelButtonText: 'No'
//   }).then((result: any) => {
//     console.log("-----------------test---------",result);
//     if (result.isConfirmed) {
//       return;

//       this.transport_service.DeleteTransportRequestById(this.cellValue).subscribe(
//         (res: any) => {
//           this.toaster.success('Deleted successfully');
//           this.reloadCurrentRoute();  // Reloads the current route properly
//         },
//         (err: any) => {
//           this.toaster.error("Something went wrong. Please try again", "Error Message");
//         }
//       )
//     }
//   });
// }

  // openDialog(e: any) {
  //     e.stopPropagation();

  //     Swal.fire({
  //       title: 'Do You Want to Approve This Transport Request?',
  //       icon: 'warning',
  //       showCancelButton: true,
  //       cancelButtonColor: "#f44336",
  //       confirmButtonColor: "#3f51b5",
  //       confirmButtonText: 'APPROVED',
  //       cancelButtonText: 'REJECT'
  //     }).then((result: { isConfirmed: any; }) => {
  //       if (result.isConfirmed) {
  //         // Mock approval logic
  //         const data = {
  //           status_type: "APPROVED"
  //         };

  //         this.transport_service.updateStatus(this.cellValue,data).subscribe((res:any)=>{
  //           console.log(res);
  //         this.toast.success('Approved Request Successfully');
  //         this.reloadCurrentRoute();

  //         })


  //         // Simulate successful response
  //         // this.getData = {
  //         //   status: "Approved",
  //         //   approver: "Mock Approver"
  //         // };

  //       }
  //     });
  //   }

  openDialog(e: any) {
  e.stopPropagation();

 Swal.fire({
  title: 'Do You Want to Approve This Transport Request?',
  input: 'textarea',
  inputLabel: 'Remarks',
  inputPlaceholder: 'Enter your remarks here...',
  inputAttributes: {
    'aria-label': 'Type your remarks here'
  },
  customClass: {
    input: 'swal-textarea-small'
  },
  icon: 'warning',
  showDenyButton: true,
  showCancelButton: false,
  confirmButtonText: 'APPROVED',
  denyButtonText: 'REJECT',
  confirmButtonColor: '#3f51b5',
  denyButtonColor: '#f44336'
}).then((result) => {
    if (result.isConfirmed || result.isDenied) {
      const data = {
        approval_status: result.isConfirmed ? 'APPROVED' : 'REJECTED',
        remarks: result.value || '',
        emp_id : this.emp_id
      };

      this.transport_service.updateStatus(this.cellValue, data).subscribe((res: any) => {
        console.log(res);
        const action = result.isConfirmed ? 'Approved' : 'Rejected';
        this.toast.success(`${action} Request Successfully`);
        this.reloadCurrentRoute();
      });
    }
  });
}


}
