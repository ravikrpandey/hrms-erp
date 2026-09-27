import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpListDialogComponent } from 'src/app/@modules/employee-self-service/employee/employee-list/emp-list-dialog/emp-list-dialog.component';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';

@Component({
  selector: 'app-work-flow-list-popup',
  templateUrl: './work-flow-list-popup.component.html',
  styleUrls: ['./work-flow-list-popup.component.scss']
})

export class WorkFlowListPopupComponent implements OnInit {
  remarks:any;
  constructor(private _empService: EmpRegistrationService,
    private config_service: ConfigurationalmasterService,
    public dialog: MatDialogRef<EmpListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
  }

  view = (e:any) => {
    this.remarks = e.remarks ? e.remarks : "remark not available"
  }
}
