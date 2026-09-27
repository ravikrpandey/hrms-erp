import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-view-work-flow-rfp',
  templateUrl: './view-work-flow-rfp.component.html',
  styleUrls: ['./view-work-flow-rfp.component.scss']
})
export class ViewWorkFlowRfpComponent implements OnInit {

  constructor(
    private dialog: MatDialogRef<ViewWorkFlowRfpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,
  ) { }
  getRecordById: any
  getAllEmployeeDetails: any = []
  ngOnInit(): void {
    console.log(this.data.id, 'id');
    this._configurationalmasterService.getWorkflowRfpById(this.data.id).subscribe((response: any) => {
      console.log(response, 'response');
      this.getRecordById = response.data;
      this.getAllEmployeeDetails = response.data.employeedetails;
    })
  }
}