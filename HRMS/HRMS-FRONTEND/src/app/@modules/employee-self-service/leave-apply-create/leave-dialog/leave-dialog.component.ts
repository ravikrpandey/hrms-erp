import { Component } from '@angular/core';
import { Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';

@Component({
  selector: 'app-leave-dialog',
  templateUrl: './leave-dialog.component.html',
  styleUrls: ['./leave-dialog.component.scss']
})
export class LeaveDialogComponent implements OnInit {
  empId: any;
  singleEmpData: any;
  localTime:any;
  status:any;
  constructor(public dialog: MatDialogRef<LeaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private emp_master: EmpMasterService, private toster: ToastrService) {
    this.empId = this.data.leaveApplyViewId;
    
  }
  ngOnInit(): void {

    if (this.empId) {
      this.emp_master.applyLeaveGetById(this.empId).subscribe((res: any) => {
        this.singleEmpData = res.data;
        
        // this.title = JSON.parse(res.data.reporting_manager);
        // this.title = JSON.parse(res.data.reporting_manager).title;
        // this.lastName =  JSON.parse(res.data.reporting_manager).first_name;
        // this.reportingManager = JSON.parse(res.data.reporting_manager).reporting_manager;
        // 
        this.localTime = new Date(this.singleEmpData.fromDate).toLocaleTimeString();
      })
    } else {
      
    }

  }
  getStatus(e:any){
       
       this.status=e.value;
       
 }
  statusGet(){
let val={
  status:this.status
}



this.emp_master.statusupdate(this.empId,val).subscribe((res:any)=>{
  
  // this.dialog.close();
  this.toster.success("Lead Status Updated ")
this.reload();

},
(error:any)=>{
  this.toster.error("Something Went To Wrong")
}
);

  }

  reload(){
    setTimeout(() => {
      window.location.reload();
    }, 500); // Activate after 5 minutes.
  }
}

