import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-vendor-dilog',
  templateUrl: './vendor-dilog.component.html',
  styleUrls: ['./vendor-dilog.component.scss']
})
export class VendorDilogComponent {
  segment_id: any;
  singleSegmentData: any;
  constructor(
    private dialog: MatDialogRef<VendorDilogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,
  ) {
    this.segment_id = Number(data.id);
    
    
  }
  ngOnInit() {
    this.getByIdSegment()
  }

  getByIdSegment() {
    this._configurationalmasterService.getVendor_ById(this.segment_id).subscribe((res: any) => {
      this.singleSegmentData = res.data;
      
    })
  }
}
