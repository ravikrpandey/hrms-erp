import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent {
  public cellValue: any;
  approval: any;
  databaseKey: any = environment.servralUrl;
  trvno: any;
  cout_documents: any;
  assignAction: any;

  constructor(
   private route:Router,
   private travelrequestservice:TravelRequestService,
   private toast: ToastrService,
   private _rbackService : RbacMasterService
  ) { }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.approval = params?.data.approval_levels[0]?.status
    this.trvno = params?.data.travel_request_number
    this.cout_documents = params?.data.cout_documents

  }
  getValueToDisplay(params: ICellRendererParams) {


    return params.valueFormatted
      ? params.valueFormatted
      : params.data.id;
  }

  view() {
    this.route.navigate(['/master/ess/travel-request/create-travel-request'], {
      queryParams: { id: this.cellValue ,Type:"view"},
    });
  }

  edit() {
    this.route.navigate(['/master/ess/travel-request/create-travel-request'], {
      queryParams: { id: this.cellValue ,Type:"edit"},
    });
  }

  download() {
    const travelId = this.cellValue;
    const downloadUrl = `${this.databaseKey}/api/v1/download_uploaded_documents/${travelId}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.target = '_blank';
    link.download = `${this.trvno}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        this.travelrequestservice.delete_travel_request_by_id(this.cellValue).subscribe(
          (res) => {
            
            this.toast.success('Deleted successfully ');
            this.reloadCurrentRoute();
          },
          (err) => {
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
