import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import Swal from 'sweetalert2';
import { DurationCreateComponent } from '../duration-create/duration-create.component';


@Component({
  selector: 'app-action-duration',
  templateUrl: './action-duration.component.html',
  styleUrls: ['./action-duration.component.scss']
})
export class ActionDurationComponent {
    assignAction: any;
    durationId:any;
    constructor(
      private route: Router,
      public dialog: MatDialog,
      private router: Router,
      private toaster: ToastrService,
      private payrollService:PayrollService,
     
    ) {}
  
    ngOnInit(): void {
      // this.assignAction = this._rbackService.accessAssignAction();
    }
    public cellValue: any;
    reloadCurrentRoute() {
      let currentUrl = this.route.url;
      this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.route.navigate([currentUrl]);
      });
    }
    agInit(params: ICellRendererParams): void {
      this.cellValue = this.getValueToDisplay(params);
      this.durationId=params.data;
      console.log(params,'params');
      
    }
  
    getValueToDisplay(params: ICellRendererParams) {
      // console.log("ssss",params.valueFormatted,params.data.id);
      return params.valueFormatted ? params.data.id : params.data.id;
    }
  
    refresh(params: ICellRendererParams): boolean {
      // this.cellValue = this.getValueToDisplay(params);
      return true;
    }
   
  
    edit(e:any) {
      // this.route.navigate(['master/payroll/tax-slab/create-template'], {
      //   queryParams: { id: this.cellValue, Type: "edit" },
      // });
      debugger
      console.log(this.durationId, 'Editing item');
      const dialogRef = this.dialog.open(DurationCreateComponent, {
        width: '700px',
        data: { status: 'Edit', item:this.durationId }
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log('Dialog closed with result:', result);
        
        }
      });
    }
    view(e: any) {
      console.log(e, 'Viewing item');
      const dialogRef = this.dialog.open(DurationCreateComponent, {
        width: '700px',
        data: { status: 'View', item: this.durationId } 
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log('Dialog closed with result:', result);
        
        }
      });
    }
    deleteData(e: any) {
      e.stopPropagation();
      Swal.fire({
        title: 'Are you sure you want to Remove it?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: "#f44336",
        confirmButtonColor: "#3f51b5",
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          this.payrollService.deleteAppraisalDuration(this.durationId?.id).subscribe(
            (res) => { 
              this.toaster.success('Deleted successfully ');
              this.reloadCurrentRoute();
            },
            (err) => {
              this.toaster.error("Somthing went wrong Please try agin", "Error Message")
            }
          )
        }
      });
    } 
  
  }
