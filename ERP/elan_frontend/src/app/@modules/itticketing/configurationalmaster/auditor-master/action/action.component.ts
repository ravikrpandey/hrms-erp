import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
// import { EmpListDialogComponent } from '../emp-list-dialog/emp-list-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { LmsServiceService } from 'src/app/@shared/services/lms-service.service';
import {  ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent  implements ICellRendererAngularComp {
  isChecked:boolean;
  status:any
  dataForcheck: any;
  params: any;
  getStatus:any;
  checkBox:any
  

  constructor(private route: Router,
    public dialog: MatDialog,
   private _lmsService:LmsServiceService,
    private toast: ToastrService,
    private location: Location,
  ) {
  }

  ngOnInit(): void {
    

    
  }
  public cellValue: any;

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  btnClickedHandler(e:any) {
    this.params.clicked(this.params.value);
    
    
  }

  
  
cellParams:any
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.cellParams=params;
    
    

    
    // 
  }
  getValueToDisplay(params: ICellRendererParams) {
    // 

    
    this.checkBox = params.data.isChecked;
    
    if (this.checkBox === true) {
      this.isChecked = true;
    }else{
      this.isChecked = false;
    }
    
    return params.data.user_id;
    // return params.valueFormatted ? params.valueFormatted : params.data.user_id;
  }

  refresh(params: ICellRendererParams): boolean {
    // 
    this.cellValue = this.getValueToDisplay(params);
    return false;
  
  }

  edit(e: any) {
    e.stopPropagation();
    this.route.navigate(['master/hrms/employee-master/help-disk/help-disk-create'], { queryParams: { id: this.cellValue } })
  }

  toggle(e:any,) {
    e.stopPropagation();
    
    this.cellParams.clicked(this.cellParams.value);
  
    
    this.isChecked==this.isChecked;
    
    let data:any = {  
    };
    if(this.isChecked){
      data.status = "ACTIVE";
      data.isChecked=true;
  
    }else{
      data.status = "INACTIVE";
      data.isChecked=false;
 
    }
      
    // data.isChecked = this.isChecked

    if(this.checkBox==true){
      
      this._lmsService.DeleteByrId(this.cellValue, data).subscribe((res:any)=>{
        
       
        this.toast.success("User data sucessfully Inactivate");
        this.reloadCurrentRoute();
  
      })

    }
    else{
      
      this._lmsService.DeleteByrId(this.cellValue, data).subscribe((res:any)=>{
        
     
        this.toast.success("User data sucessfully activate");
        this. reloadCurrentRoute();

    })
  }

    //   if(this.checkBox==true){
        
    // Swal.fire({
    //   title: 'Are you sure you want to Remove it?',
    //   text: 'You will not be able to recover this file!',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   cancelButtonColor: "#858586",
    //   confirmButtonColor: "#f44336",
    //   confirmButtonText: 'Active!',
    //   cancelButtonText: 'Skip'
    // }).then((result) => {
    //   
    //   this._lmsService.DeleteByrId(this.cellValue, data).subscribe((res:any)=>{
    //     
    //   // window.location.reload();
    //   })
    // })
    // }
    // else{
    //   Swal.fire({
    //     title: 'Are?',
    //     text: 'You will not be able to recover this file!',
    //     icon: 'warning',
    //     showCancelButton: true,
    //     cancelButtonColor: "#858586",
    //     confirmButtonColor: "#f44336",
    //     confirmButtonText: 'Active!',
    //     cancelButtonText: 'Skip'
    //   }).then((result) => {
    //     
    //     this._lmsService.DeleteByrId(this.cellValue, data).subscribe((res:any)=>{
    //       
    //     // window.location.reload();
    //     })
    //   })
      

  }
  


    // Swal.fire({
    //   title: 'Are you sure you want to Remove it?',
    //   text: 'You will not be able to recover this file!',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   cancelButtonColor: "#858586",
    //   confirmButtonColor: "#f44336",
    //   confirmButtonText: 'Active!',
    //   cancelButtonText: 'Skip'
    // }).then((result) => {
    //   if (result.value) {
    //     
    //     this._lmsService.DeleteByrId(this.cellValue, data).subscribe((res:any)=>{
    //       
        // window.location.reload();
    
    //     })
        
    //     Swal.fire(
    //       'Deleted!',
    //       'Your imaginary file has been deleted.',
    //       'success'
    //     )
    //   }
    //    else if (result.dismiss === Swal.DismissReason.cancel) 
    //    {
    //     Swal.fire(
    //       'Cancelled',
    //       'Your imaginary file is safe :)',
    //       'error'
    //     )
    //   }
    // })
  


  



  openDialog() {
    // const dialogRef
    //   = this.dialog.open(UserManagementDialogComponent, {
    //     width: '100%',
    //     maxWidth: '100vw',
    //     maxHeight: '100vh',
    //     height: '100%',
    //     panelClass: 'full-screen-modal',
    //     data: { id: this.cellValue }
    //   });
    // dialogRef.afterClosed().subscribe(result => {
    //   
    // });
  }

}
