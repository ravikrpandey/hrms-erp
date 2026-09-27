import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';

@Component({
  selector: 'app-probation-dialog',
  templateUrl: './probation-dialog.component.html',
  styleUrls: ['./probation-dialog.component.scss']
})
export class ProbationDialogComponent implements OnInit {
  empId: any;
  singleEmpData: any;
  empData: any;
  reportingManager:any;

  constructor(public dialog: MatDialogRef<ProbationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private emp_master: EmpMasterService,
    private _empService: EmpRegistrationService) {
    this.empId = this.data.probationId;
    
  }
  ngOnInit(): void {

    if (this.empId) {
      this.emp_master.probationGetById(this.empId).subscribe((res: any) => {
        this.singleEmpData = res.data;
        
        // this.reportingManager = JSON.parse(res.data.reporting_manager);
      })
      // this._empService.getSingleEmp(this.empId).subscribe((res: any) => {
      //   this.singleEmpData = res.data;
      //   
      // })

    } else {
      
    }

  }
}
