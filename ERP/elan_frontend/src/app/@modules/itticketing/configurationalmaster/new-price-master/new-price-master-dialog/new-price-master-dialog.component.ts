import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-new-price-master-dialog',
  templateUrl: './new-price-master-dialog.component.html',
  styleUrls: ['./new-price-master-dialog.component.scss']
})
export class NewPriceMasterDialogComponent {
  Currency_Convert_id: any;
  singleCurrecyData: any;
  constructor(
    private dialog: MatDialogRef<NewPriceMasterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,
  ) {
    this.Currency_Convert_id = Number(data.id);
  }
  ngOnInit() {
    this.getByIdCurrency()
  }

  getByIdCurrency() {
    this._configurationalmasterService.CurrencyById(this.Currency_Convert_id).subscribe((res: any) => {
      this.singleCurrecyData = res.data;
      
    })
  }
}
