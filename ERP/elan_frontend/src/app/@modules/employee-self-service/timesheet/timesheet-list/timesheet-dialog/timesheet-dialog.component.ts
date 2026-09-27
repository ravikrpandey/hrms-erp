import { Component } from '@angular/core';
import { Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';


@Component({
  selector: 'app-timesheet-dialog',
  templateUrl: './timesheet-dialog.component.html',
  styleUrls: ['./timesheet-dialog.component.scss']
})
export class TimesheetDialogComponent implements OnInit {
  empId: any;
  singleEmpData: any;
  empData: any;
  fName: any;
  department: any;
  localTime:any;

  constructor(public dialog: MatDialogRef<TimesheetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private emp_master: EmpMasterService,
    private _empService: EmpRegistrationService) {
    this.empId = this.data.timeSheetViewId
    
  }
  ngOnInit(): void {

    if (this.empId) {
      this.emp_master.timeSheetGetById(this.empId).subscribe((res: any) => {
        this.singleEmpData = res.data;
        // 
        this.localTime = new Date(this.singleEmpData.time_off_request).toLocaleTimeString();
      })
    } else {
      
    }

  }
}
