import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { warehouseListService } from 'src/app/@shared/services/warehouse/warehouse-list.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent implements ICellRendererAngularComp {
  params: any;
  planningId: string = '';
  showButton: boolean = false;
  cellValue: any;
  mainId: any;

  constructor(private toaster: ToastrService, private apiUrl: warehouseListService,private route: Router) {}

  agInit(params: any): void {
    this.params = params;
    const data = params.data;
    this.planningId = data.vehicle_planing_id;
    this.mainId = data.id;
    this.cellValue = this.getValueToDisplay(params);
    
    if (data.pickList_status === 'Pending') {
      this.showButton = true;
    }
  }
  
  getValueToDisplay(params: ICellRendererParams) {
    return params.data;
  }

  refresh(params: any): boolean {
    return false;
  }

  ViewAction(e:any){
    e.stopPropagation();
      this.route.navigate(['/master/warehouse-management/pick-list/invoice-view'], {
        queryParams: {
          id: this.cellValue.vehicle_planing_id,
          action_type: 'view'
        },
      });
  }

  downloadInvoice(){
    console.log(this.mainId,"_______AAAAAAA")
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  
  revalidateItems() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to process this?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Process',
      cancelButtonText: 'Cancel',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        let obj = { id: this.mainId, vehicle_planing_id: this.planningId };

        return this.apiUrl.updatePickData(obj).toPromise()
          .then((res: any) => {
            this.toaster.success(res.message);
            Swal.close(); 
            this.reloadCurrentRoute();
          })
          .catch((error) => {
            this.toaster.error(error?.error?.message || 'Something went wrong');
            Swal.close();
          });
      }
    });
  }

}