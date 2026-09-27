import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-my-request-dialog',
  templateUrl: './my-request-dialog.component.html',
  styleUrls: ['./my-request-dialog.component.scss']
})
export class MyRequestDialogComponent {
  allDataJob: any;
  rowData: any;
  empId:any
  reportingManager:any;
  title:any;
  lastName:any;
  private _empService: any;
  budgetStatus: any;
  budgeStatus: boolean = false;

  constructor(public dialog: MatDialogRef<MyRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){
console.log(data,'dataaaa');
this.allDataJob=data?.allData;
if(this.allDataJob?.budget_status == "YES"){
this.budgeStatus=true;
}else{
  this.budgeStatus=false;

}
this.budgetStatus=this.allDataJob?.budget_status
  }

  ngOnInit(): void {
    if(this.empId){
      this._empService.getSingleEmp(this.empId).subscribe((res: any) => {
        this.allDataJob = res.data;
        
        this.title = JSON.parse(res.data.reporting_manager);
        // this.title = JSON.parse(res.data.reporting_manager).title;
        // this.lastName =  JSON.parse(res.data.reporting_manager).first_name;
        // this.reportingManager = JSON.parse(res.data.reporting_manager).reporting_manager;
      })
    }else{ 
      
    }
  }
}
