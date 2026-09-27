import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-countrymasterdialog',
  templateUrl: './countrymasterdialog.component.html',
  styleUrls: ['./countrymasterdialog.component.scss']
})
export class CountrymasterdialogComponent {
  country_id: any;
  singleCountryData: any;
  constructor(
    private dialog: MatDialogRef<CountrymasterdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,
  ) {
    this.country_id = Number(data.id);
  }

  ngOnInit() {
    this.getByIdCountry()
  }

  getByIdCountry() {
    this._configurationalmasterService.getByIdCountry(this.country_id).subscribe((res: any) => {
      this.singleCountryData = res.data;
    })
  }
}
