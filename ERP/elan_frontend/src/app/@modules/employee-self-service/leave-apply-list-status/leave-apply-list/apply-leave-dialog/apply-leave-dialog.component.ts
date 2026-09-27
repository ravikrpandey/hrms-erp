import { Component } from '@angular/core';
import { Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
@Component({
  selector: 'app-apply-leave-dialog',
  templateUrl: './apply-leave-dialog.component.html',
  styleUrls: ['./apply-leave-dialog.component.scss']
})
export class ApplyLeaveDialogComponent implements OnInit {
  empId:any;
  singleEmpData:any;

  constructor(public dialog: MatDialogRef<ApplyLeaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private emp_master:EmpMasterService)
     {
      this.empId = this.data.leaveApplyViewId;
      
  }
  ngOnInit(): void {

    if(this.empId){
      this.emp_master.applyLeaveGetById(this.empId).subscribe((res: any) => {
        this.singleEmpData = res.data; 
      })
    }else{ 
      
    }
    
  }
}

