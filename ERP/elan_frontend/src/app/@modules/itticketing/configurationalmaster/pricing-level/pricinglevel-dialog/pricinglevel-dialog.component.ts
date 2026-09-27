import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';


@Component({
  selector: 'app-pricinglevel-dialog',
  templateUrl: './pricinglevel-dialog.component.html',
  styleUrls: ['./pricinglevel-dialog.component.scss']
})

export class PricinglevelDialogComponent {
  pricing_level_id: any;
  singlePriceMapData: any;
  constructor( private toaster: ToastrService,
    private dialog: MatDialogRef<PricinglevelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,
  ) {
    this.pricing_level_id = Number(data.id);
    }
  ngOnInit() {
  this.getByIdPriceLevel();  
  }

  getByIdPriceLevel() {
    this._configurationalmasterService.getByIdPriceLevel(this.pricing_level_id).subscribe((res: any) => {
      this.singlePriceMapData = res.data[0];
      
    },
    (err: any) => {
      this.toaster.warning('Please Activate Status of this Record ',
      'Error Message'       
      );
      
    }
  );
  }

}
