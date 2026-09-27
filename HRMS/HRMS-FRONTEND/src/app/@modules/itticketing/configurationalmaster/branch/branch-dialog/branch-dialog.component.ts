import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-branch-dialog',
  templateUrl: './branch-dialog.component.html',
  styleUrls: ['./branch-dialog.component.scss']
})
export class BranchDialogComponent {
  country_id: any;
  listBranch: any;
  singleBranch: any;
  
  constructor(
    private dialog: MatDialogRef<BranchDialogComponent>,
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
      .getByIdBranch(this.listBranch)
      .subscribe((res: any) => {
        this.singleBranch = res.data;
        
      });
  }
}
