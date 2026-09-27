import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
@Component({
  selector: 'app-ism-dialog',
  templateUrl: './ism-dialog.component.html',
  styleUrls: ['./ism-dialog.component.scss']
})
export class IsmDialogComponent {
  listIndustry: any;
  singleIndustry: any;
  id:any;
  constructor(
    private dialog: MatDialogRef<IsmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService
  ) {
    
    this.id = data.id
  }
  ngOnInit() {
    this.getByIdRole(this.id);
  }

  getByIdRole(id:any) {
    this._configurationalmasterService
      .getByIdIndustry(id)
      .subscribe((res: any) => {
        this.singleIndustry = res.data;
        
      });
  }
}
