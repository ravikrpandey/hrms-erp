import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
// import { EmpListDialogComponent } from '../emp-list-dialog/emp-list-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { GrievanceDialogComponent } from '../../grievance-dialog/grievance-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  parm:any;
  employeId:any;
  result:any
  constructor(private router: Router,
    public dialog: MatDialog,
    private emp_master : EmpMasterService,
    private route : ActivatedRoute,
    private toast: ToastrService,  ) {
  }

  ngOnInit(): void {

    this.emp_master.deleteGrievanceById(this.cellValue).subscribe(res=>{
      this.result = res;
     })
    

    this.route.queryParams.subscribe(params => {
      this.parm = params;
      this.employeId = this.parm.employee_grievance_id;
      
    })

  }
  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    
  }
  getValueToDisplay(params: ICellRendererParams) {
    
    
    return params.valueFormatted ? params.valueFormatted : params.data.employee_grievance_id;
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again
    
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  edit(e:any) {
    e.stopPropagation();
    // 
    this.router.navigate(['master/ess/grievance/grievance_create'], { queryParams: { employee_grievance_id: this.cellValue } })
    // edit(e: any) {
    //   e.stopPropagation();
    // }
  }

  delete(e:any){

    // e.stopPropagation();
    // if (confirm('Are you sure you want to Delete this thing into the database?')) {
    //   this.emp_master.deleteGrievanceById(this.cellValue).subscribe(res=>{
    //     this.toast.success("Grievancy Data is Deleted Successfully!");
    //     window.location.reload();
    //    })
    // } else {
    //   // Do nothing!
    //   
    // }

    // Swal.fire({
    //   title: 'Are you sure you want to Remove it?',
    //   text: 'You will not be able to recover this file!',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: 'Yes, delete it!',
    //   cancelButtonText: 'No, keep it'
    // }).then((result) => {
    //   if (result.value) {
    //     Swal.fire(
    //       'Deleted!',
    //       'Your imaginary file has been deleted.',
    //       'success'
    //     )
    //   } else if (result.dismiss === Swal.DismissReason.cancel) {
    //     Swal.fire(
    //       'Cancelled',
    //       'Your imaginary file is safe :)',
    //       'error'
    //     )
    //   }
    // })





  }
  openDialog() {
    const dialogRef
      = this.dialog.open(GrievanceDialogComponent, {
      
        data: { id: this.cellValue }
      });
    dialogRef.afterClosed().subscribe(result => {
      // 
    });
  }
  
}
