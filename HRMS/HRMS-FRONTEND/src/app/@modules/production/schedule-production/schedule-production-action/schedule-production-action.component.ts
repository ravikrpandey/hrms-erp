import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-schedule-production-action',
  templateUrl: './schedule-production-action.component.html',
  styleUrls: ['./schedule-production-action.component.scss']
})
export class ScheduleProductionActionComponent {
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router:Router,
    private toaster:ToastrService,
    private productService:ProductionService,
    private _configurationalMasterService:ConfigurationalmasterService
  ) {
  }
  ngOnInit(): void {
    this.getValueToDisplay
     
  }
  public cellValue: any;
  currentStatus:any
  agInit(params: ICellRendererParams): void {
    
    this.currentStatus=params;
    // console.warn(this.currentStatus,'this.currentStatus');
    
    this.cellValue = this.getValueToDisplay(params);
  }
  getValueToDisplay(params: ICellRendererParams) {
    
    return params.valueFormatted ? params.valueFormatted : params.data.id
  }
  refresh(params: ICellRendererParams) {
    // set value into cell again
    this.cellValue = this.getValueToDisplay(params);
  }
  

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
 
start(event:any){
  event.stopPropagation();
  let data={
    status_schedule:'START'
  }
  Swal.fire({
    title: 'Do you want to Start production',
    icon: 'warning',
    showCancelButton: true,
    cancelButtonColor: '#5d6c7c',
    confirmButtonColor: '#f44336',
    confirmButtonText: 'YES',
    cancelButtonText: 'NO',
  }).then((result) => {
    if (result.value) {
      this.productService.changeStatusScheduleById(this.cellValue,data).subscribe(
        (res:any) => {
          if(res){
            this.toaster.success(res.message)
            this.reloadCurrentRoute()
          }
          // else if(result.dismiss === Swal.DismissReason.cancel){

          // }
        },
        (err:any) => {
          this.toaster.error(err.error.message)
        })
    }
    //  else if (result.dismiss === Swal.DismissReason.cancel) {
    // }
  });
}
pause(event:any){
  let data={
    status_schedule:'HOLD'
  }
  event.stopPropagation();
  Swal.fire({
    title: 'Do you want to Pause production',
    icon: 'warning',
    showCancelButton: true,
    cancelButtonColor: '#5d6c7c',
    confirmButtonColor: '#f44336',
    confirmButtonText: 'YES',
    cancelButtonText: 'NO',
  }).then((result) => {
    if (result.value) {
      this.productService.changeStatusScheduleById(this.cellValue,data).subscribe(
        (res:any) => {
          if(res){
            this.toaster.success(res.message)
            this.reloadCurrentRoute()
          }
          // else if(result.dismiss === Swal.DismissReason.cancel){

          // }
        },
        (err:any) => {
          this.toaster.error(err.error.message)
        })
    } 
    // else if (result.dismiss === Swal.DismissReason.cancel) {
    // }
  });
}
  
stop(event:any){
  event.stopPropagation();
  let data={
    status_schedule:'STOP'
  }
  Swal.fire({
    title: 'Do you want to Stop production',
    icon: 'warning',
    showCancelButton: true,
    cancelButtonColor: '#5d6c7c',
    confirmButtonColor: '#f44336',
    confirmButtonText: 'YES',
    cancelButtonText: 'NO',
  }).then((result) => {
    if (result.value) {
      this.productService.changeStatusScheduleById(this.cellValue,data).subscribe(
        (res:any) => {
          if(res){
            this.toaster.success(res.message)
            this.reloadCurrentRoute()
          }
          else if(result.dismiss === Swal.DismissReason.cancel as any){

          }
        },
        (err:any) => {
          this.toaster.error(err.error.message)
        })
    } else if (result.dismiss === Swal.DismissReason.cancel as any) {
    }
  });
}

viewScheduledProduction(){
  this.router.navigate(['/master/production/view-scheduled-production'],{queryParams:{'id':this.cellValue}})
}

}
