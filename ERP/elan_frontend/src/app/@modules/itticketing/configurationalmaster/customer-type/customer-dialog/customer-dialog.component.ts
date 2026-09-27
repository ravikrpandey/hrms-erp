import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';


@Component({
  selector: 'app-customer-dialog',
  templateUrl: './customer-dialog.component.html',
  styleUrls: ['./customer-dialog.component.scss']
})

export class CustomerDialogComponent {
  segment_id: any;
  singleSegmentData: any;
  constructor(
    private dialog: MatDialogRef<CustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,
  ) {
    this.segment_id = Number(data.id);
  }
  ngOnInit() {
    this.getByIdSegment()
  }

  getByIdSegment() {
    this._configurationalmasterService.getByIdSegment(this.segment_id).subscribe((res: any) => {
      this.singleSegmentData = res.data;
      
    })
  }
}
