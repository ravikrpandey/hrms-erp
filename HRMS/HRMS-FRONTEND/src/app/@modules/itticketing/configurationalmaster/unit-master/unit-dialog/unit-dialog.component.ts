import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-unit-dialog',
  templateUrl: './unit-dialog.component.html',
  styleUrls: ['./unit-dialog.component.scss']
})
export class UnitDialogComponent {
  country_id: any;
  listBranch: any;
  singleBranch: any;
  constructor(
    private dialog: MatDialogRef<UnitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService
  ) {
    this.listBranch = data.id;
    
  }
  ngOnInit() {
    this.getByIdRole();
  }

  getByIdRole() {
    this._configurationalmasterService
      .getByIdUnit(this.listBranch)
      .subscribe((res: any) => {
        this.singleBranch = res.data;
        
      });
  }
}
