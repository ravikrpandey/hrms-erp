import { Component } from '@angular/core';
import { Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';

@Component({
  selector: 'app-product-master-dialog',
  templateUrl: './product-master-dialog.component.html',
  styleUrls: ['./product-master-dialog.component.scss']
})
export class ProductMasterDialogComponent {

  productMasterId: any;
  singleProductMasterData:any;

  constructor(public dialog: MatDialogRef<ProductMasterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private emp_master: EmpMasterService,
    private _configurationalMasterService: ConfigurationalmasterService,) {
    this.productMasterId = this.data.productMasterViewId
    
  }

  ngOnInit(): void {
    if (this.productMasterId) {
      this._configurationalMasterService.getProductsMasterById(this.productMasterId).subscribe((res: any) => {
        this.singleProductMasterData = res.data;
        // this.title = JSON.parse(res.data.reporting_manager);
        // this.title = JSON.parse(res.data.reporting_manager).title;
        // this.lastName =  JSON.parse(res.data.reporting_manager).first_name;
        // this.reportingManager = JSON.parse(res.data.reporting_manager).reporting_manager;
      })
    } else {
      
    }
  }
}

