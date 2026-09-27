import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-dilog',
  templateUrl: './product-dilog.component.html',
  styleUrls: ['./product-dilog.component.scss']
})
export class ProductDilogComponent {
  approved_level_id: number;
  cellData:any;
  date: string;
  constructor(
    private dialog: MatDialogRef<ProductDilogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) {

    this.cellData = data;
    
    this.date = moment(new Date(this.cellData.createdAt)).format('LL')
    
  }
  ngOnInit() {
  }

}
