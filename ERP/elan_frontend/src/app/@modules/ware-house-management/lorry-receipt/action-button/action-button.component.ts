import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { warehouseListService } from 'src/app/@shared/services/warehouse/warehouse-list.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LorryDetailsComponent } from '../lorry-details/lorry-details.component';
import { ItemMapDetailsComponent } from '../item-map-details/item-map-details.component';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent implements ICellRendererAngularComp {
  params: any;
  planningId: string = '';
  showButton: boolean = false;
  gateBypass: string = '';
  mapSerialNoStatus: boolean = false;
  constructor(private toaster: ToastrService, private apiUrl: warehouseListService,private route: Router,private matDialog : MatDialog) {}

  agInit(params: any): void {
    this.params = params;
    const data = params.data;
    this.planningId = data.id;
    this.gateBypass= data.gate_bypass_status;
    this.mapSerialNoStatus= data.mapSerialNoStatus;
    if (data.LR_status === 'Pending') {
      this.showButton = true;
    }
  }

  refresh(params: any): boolean {
    return false;
  }

  ViewAction(){
      this.route.navigate(['/master/warehouse-management/pick-list/invoice-view'], {
        queryParams: {
          id: this.params.data.vehicle_planing_id,
          action_type: 'view'
        },
      });
  }

  openDialog(){
    let dialogRef = this.matDialog.open(LorryDetailsComponent,{
      width:'700px',
      height:'349px',
      data:this.params.data,
      disableClose: true
    })
    dialogRef.afterClosed().subscribe({
      next:(res:any) =>{
        if(res?.status){
          // dialogRef.close();
          this.reloadCurrentRoute()
        }
      },error:(err)=>{
        console.log(err)
      }
    })
  }

  mapSerialBatch(){
    let dialogRef = this.matDialog.open(ItemMapDetailsComponent,{
      width: '100%',
      height: '90vh',
      data:this.params.data,
      disableClose: true
    })
    dialogRef.afterClosed().subscribe({
    next: (res: any) => {
      if (res?.status) {
        this.params.context.componentParent.refreshGrid();
      }
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