import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent {
  public cellValue: any;
  approval: any;
  expense_approvel_status: any;
  status: string;
  cellValue1: any;

  constructor(
    private route: Router,
    private travelrequestservice: TravelRequestService,
    private toast: ToastrService,
  ) { }

  ngOnInit(): void {
  }


  agInit(params: ICellRendererParams): void {

    this.cellValue = this.getValueToDisplay(params);
    this.approval = params.data.expense_final_status
    this.expense_approvel_status = params.data.expense_approvel_status

  }
  getValueToDisplay(params: ICellRendererParams) {


    return params.valueFormatted
      ? params.valueFormatted
      : params.data.travel_id;
  }



  download() {
    this.route.navigate(['/master/ess/travel-request/create-travel-request'], {
      queryParams: { id: this.cellValue ,Type:"upload",Loca:"upld"},
    });
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
}
