import { Component } from '@angular/core';
import { Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';


@Component({
  selector: 'app-grievance-dialog',
  templateUrl: './grievance-dialog.component.html',
  styleUrls: ['./grievance-dialog.component.scss']
})
export class GrievanceDialogComponent implements OnInit {
  empId:any;
  singleEmpData:any
  reportingManager:any;

  constructor(public dialog: MatDialogRef<GrievanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private emp_master:EmpMasterService,
    private _empService: EmpRegistrationService)
     {
      this.empId = this.data.id
      
  }
  ngOnInit(): void {

    
 
  }
}
