import { Component, OnInit } from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ActivatedRoute, Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
// import { EmpListDialogComponent } from '../emp-list-dialog/emp-list-dialog.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ProbationDialogComponent } from '../probation-dialog/probation-dialog.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-probation-action',
  templateUrl: './probation-action.component.html',
  styleUrls: ['./probation-action.component.scss']
})
export class ProbationActionComponent implements OnInit {
  parm: any;
  employeId: any;
  result: any;
  assignAction:any;
  
  constructor(private router: Router,
    public dialog: MatDialog,
    private emp_master: EmpMasterService,
    private route: ActivatedRoute,
    private _rbackService:RbacMasterService,
    private toast: ToastrService,) {
  }

  ngOnInit(): void {

    // this.emp_master.deleteGrievanceById(this.cellValue).subscribe(res => {
    //   this.result = res;
    // })
    this.assignAction = this._rbackService.accessAssignAction();
    this.route.queryParams.subscribe(params => {
      this.parm = params;
      this.employeId = this.parm.employee_id;
      
    })

  }
  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    
  }
  getValueToDisplay(params: ICellRendererParams) {
    
    return params.data.employee_id;
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again
    
    this.cellValue = this.getValueToDisplay(params);
    
    
    return true;
  }

  edit(e:any) {
    e.stopPropagation();
    // 
    this.router.navigate(['master/ess/employee-probation/probation_edit'], { queryParams: { probation_id: this.cellValue }})
    // edit(e: any) {
    //   e.stopPropagation();
    // }
  }

  openDialog() {
    const dialogRef
      = this.dialog.open(ProbationDialogComponent, {

        data: { id: this.cellValue }
      });
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
}
