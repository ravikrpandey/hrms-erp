import { Component } from '@angular/core';
import { Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
@Component({
  selector: 'app-help-desk-dialog',
  templateUrl: './help-desk-dialog.component.html',
  styleUrls: ['./help-desk-dialog.component.scss']
})
export class HelpDeskDialogComponent implements OnInit {
  empId: any;
  singleEmpData:any;

  constructor(public dialog: MatDialogRef<HelpDeskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private emp_master: EmpMasterService) {
    this.empId = this.data.id
    
  }

  ngOnInit(): void {
    if (this.empId) {
      this.emp_master.helpDeskGetById(this.empId).subscribe((res: any) => {
        this.singleEmpData = res.data;
        
        // this.title = JSON.parse(res.data.reporting_manager);
        // this.title = JSON.parse(res.data.reporting_manager).title;
        // this.lastName =  JSON.parse(res.data.reporting_manager).first_name;
        // this.reportingManager = JSON.parse(res.data.reporting_manager).reporting_manager;
      })
    } else {
      
    }
  }
}
