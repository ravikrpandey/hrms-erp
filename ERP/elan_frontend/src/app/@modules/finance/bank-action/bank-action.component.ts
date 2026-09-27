import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { BankViewComponent } from '../bank-view/bank-view.component';

@Component({
  selector: 'app-bank-action',
  templateUrl: './bank-action.component.html',
  styleUrls: ['./bank-action.component.scss']
})
export class BankActionComponent {
  cellValue:any;
  constructor(private router:Router,public dialog: MatDialog,private financeService:FinaceService, private toasterService:ToastrService){}
  
  ngOnInit(): void {
    
  }
  
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
  }
  
  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data.id;
  }
  
  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
  
  editBank(event:any){
     event.stopPropagation();
      this.router.navigate(['master/finance/add-bank'], {
        queryParams: { id: this.cellValue },skipLocationChange:true
      });
  }
  
  deleteBank(event:any){
    
    
    
    
    Swal.fire({
      title: 'Are you sure want to Remove?',
      // text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#063178',
      confirmButtonColor: '#f44336',
      confirmButtonText: 'Delete!',
      cancelButtonText: 'Skip',
    }).then((result) => {
      if (result.value) {
        this.financeService.deleteBank(this.cellValue).subscribe((data:any)=>{
            if(data){
              this.toasterService.success('Bank deleted successfully');
              this.reloadCurrentRoute()
            }
      
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  
    // this.leadService.deleteMandays(e)
  }
  
  
  
  viewBank(event:any){
     event.stopPropagation();
      this.router.navigate(['master/finance/view-bank'], {
        queryParams: { id: this.cellValue },skipLocationChange:true
      });
  }
  
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  openDialog() {
    const dialogRef = this.dialog.open(BankViewComponent, {
      data: { id: this.cellValue },
  
      width: '500px',
    });
  
    dialogRef.afterClosed().subscribe((result:any) => {
      
    });
    
  }
}
