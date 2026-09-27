import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpListDialogComponent } from 'src/app/@modules/employee-self-service/employee/employee-list/emp-list-dialog/emp-list-dialog.component';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';

@Component({
  selector: 'app-work-flow-list-pop',
  templateUrl: './work-flow-list-pop.component.html',
  styleUrls: ['./work-flow-list-pop.component.scss']
})
export class WorkFlowListPopComponent implements OnInit {
  rowData: any;
  empId: any
  singleEmpData: any;
  reportingManager: any;
  title: any;
  lastName: any;
  roleData: any;
  from : any;
  constructor(private _empService: EmpRegistrationService,
    private config_service: ConfigurationalmasterService,
    public dialog: MatDialogRef<EmpListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.empId = this.data.id
    this.from = this.data.from

  }

  ngOnInit(): void {
    if(this.empId){
      this._empService.getSingleEmp(this.empId).subscribe((res: any) => {
        // this.singleEmpData = res.data;
        // console.log("-----",this.singleEmpData)
        // this.title = JSON.parse(res.data.reporting_manager);
        // this.title = JSON.parse(res.data.reporting_manager).title;
        // this.lastName =  JSON.parse(res.data.reporting_manager).first_name;
        // this.reportingManager = JSON.parse(res.data.reporting_manager).reporting_manager;
      })
    }else{  

    }
    
    this.getBYData()
  }

  getBYData() {
    this.config_service.getByWorkFlowJob(this.empId).subscribe((res: any) => {
      this.singleEmpData = res.data;
      this.roleData = res.data?.roleFiled;
    })
  }

}
