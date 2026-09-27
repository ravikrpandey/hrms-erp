import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';

@Component({
  selector: 'app-emp-list-dialog',
  templateUrl: './emp-list-dialog.component.html',
  styleUrls: ['./emp-list-dialog.component.scss']
})
export class EmpListDialogComponent implements OnInit {
  rowData: any;
  empId:any
  singleEmpData:any;
  reportingManager:any;
  title:any;
  lastName:any;

  constructor(private _empService: EmpRegistrationService,
    public dialog: MatDialogRef<EmpListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any)
     {
      this.empId = this.data.id
      
      
  }

  ngOnInit(): void {
    if(this.empId){
      this._empService.getSingleEmp(this.empId).subscribe((res: any) => {
        this.singleEmpData = res.data;
        
        this.title = JSON.parse(res.data.reporting_manager);
        // this.title = JSON.parse(res.data.reporting_manager).title;
        // this.lastName =  JSON.parse(res.data.reporting_manager).first_name;
        // this.reportingManager = JSON.parse(res.data.reporting_manager).reporting_manager;
      })
    }else{ 
      
    }
  }
}
