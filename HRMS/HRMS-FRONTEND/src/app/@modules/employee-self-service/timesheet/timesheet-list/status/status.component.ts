import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';
import { MyCellParam } from '../timesheet-action/timesheet-action.component';
import { TimesheetDialogComponent } from '../timesheet-dialog/timesheet-dialog.component';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent {
  parm: any;
  employeId: any;
  result: any;
  approve_status!: Boolean;
  rejectt!: Boolean;
  id_emp: any;
  aprove_status: any;
  label: any;
  buttonText: any;
  buttonText1: any;
  timeId: any;
  assignAction:any;

  constructor(private router: Router,
    public dialog: MatDialog,
    private emp_master: EmpMasterService,
    private _rbackService: RbacMasterService,
    private route: ActivatedRoute,
    private toast: ToastrService,) {
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();

    this.emp_master.deleteGrievanceById(this.cellValue).subscribe(res => {
      this.result = res;
    })
    this.route.queryParams.subscribe(params => {
      this.parm = params;
      this.employeId = this.parm.employee_grievance_id;
      
    })
  }


  public cellValue: any;

  agInit(params: ICellRendererParams & MyCellParam): void {
    this.cellValue = this.getValueToDisplay(params);
    
    this.id_emp = params.data.employee_id;
    this.label = params.data.approve_status;
    console.log(params.value,'params.value......');
    
    // this.buttonText = params.buttonText ?? 'Approved';
    // this.buttonText1 = params.buttonText1 ?? 'Reject';
    if (params.value === true) {
      this.buttonText = params.buttonText ?? 'Approved';
    }
    else if (params.value === false) {
      this.buttonText1 = params.buttonText1 ?? 'Reject';
    }
    else {
      this.buttonText = params.buttonText ?? 'Approved';
      this.buttonText1 = params.buttonText1 ?? 'Reject';
    }

  }
  getValueToDisplay(params: ICellRendererParams) {
    
this.timeId= params.data.timesheet_id

// timesheet_id
    return params.valueFormatted ? params.valueFormatted : params.data.employee_id;
  }
  refresh(params: ICellRendererParams): boolean {
    // set value into cell again
    
    this.cellValue = this.getValueToDisplay(params);
    return false;
  }

  openDialog() {
    const dialogRef
      = this.dialog.open(TimesheetDialogComponent, {

        data: { id: this.cellValue }
      });
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  approve(e: any, appro: any) {
    e.stopPropagation();
    this.approve_status = appro
    
    
    let data: any = {
      approve_status: appro
    }
    this.approve_status = data;
    
    this.approvedOrNot(this.id_emp, data)
  }

  reject(e: any, appro: boolean) {
    e.stopPropagation();
    // Swal.fire({
    //   title: 'Are you sure want to Reject?',
    //   icon: 'warning',
    //   showCancelButton: true,

    //   cancelButtonColor: "#5d6c7c",
    //   confirmButtonColor: "#f44336",
    //   confirmButtonText: 'Reject',
    //   cancelButtonText: 'Skip'
    // }).then((result) => {
    //   if (result.value) {
    //   } else if (result.dismiss === Swal.DismissReason.cancel) {
    //   }
    // })
    let data: any = {
      approve_status: appro
    }
    // 
    this.rejectt = data;
    // if(this.rejectt){
    //   e.classList.add("rotate");
    // }
    
    this.approvedOrNot(this.id_emp, data)
  }

  approvedOrNot(id: any, data: any) {
    this.emp_master.timeSheetUpdateById(id, data).subscribe((res: any) => {
      
      this.toast.success("Status Updated !");
    })
  }

  delete(e:any){
    // e.stopPropagation();
    
// 





e.stopPropagation();
 Swal.fire({
    title: 'Are you sure you want to Remove it?',
    text: 'You will not be able to recover this file!',
    icon: 'warning',
    showCancelButton: true,
    cancelButtonColor: "#f44336",
    confirmButtonColor: "#3f51b5",
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it'
  }).then((result) => {
    if (result.value) {
      this.emp_master.deleteLeaveApply(this.timeId).subscribe((res: any) => {
        //       this.checkedAuther = res;
        window.location.reload();
      
      })
     
    } 
    // else if (result.dismiss === Swal.DismissReason.cancel) {
     
    // }
  })
  }
}
