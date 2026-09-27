import { Component } from '@angular/core';
import { Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';

@Component({
  selector: 'app-branch-setup-dialog',
  templateUrl: './branch-setup-dialog.component.html',
  styleUrls: ['./branch-setup-dialog.component.scss']
})
export class BranchSetupDialogComponent {
  branchSetupId: any;
  singleBranchSetupData:any;

  constructor(public dialog: MatDialogRef<BranchSetupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private emp_master: EmpMasterService,
    private _configurationalMasterService: ConfigurationalmasterService,) {
    this.branchSetupId = this.data.id
    
  }

  ngOnInit(): void {
    if (this.branchSetupId) {
      this._configurationalMasterService.branchSetupGetById(this.branchSetupId).subscribe((res: any) => {
        this.singleBranchSetupData = res.data;
        
        // this.title = JSON.parse(res.data.reporting_manager);
        // this.title = JSON.parse(res.data.reporting_manager).title;
        // this.lastName =  JSON.parse(res.data.reporting_manager).first_name;
        // this.reportingManager = JSON.parse(res.data.reporting_manager).reporting_manager;
      })
    } else {
      
    }
  }
}
