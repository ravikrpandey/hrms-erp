import { filter } from 'rxjs';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { InventoryManagementService } from 'src/app/@modules/ware-house-management/inventory-management.service';
import { FGListService } from 'src/app/@shared/services/warehouse/fg-list.service';
import * as moment from 'moment';


@Component({
  selector: 'app-update-so-date',
  templateUrl: './update-so-date.component.html',
  styleUrls: ['./update-so-date.component.scss']
})
export class UpdateSoDateComponent {
 
  updateSalesOrderDate:FormGroup;
 
   constructor(
     private router: Router,
     private toast: ToastrService,
     private activeroute: ActivatedRoute,
     public dialog: MatDialogRef<UpdateSoDateComponent>,
     private fb: FormBuilder,
     private inventoryServices: InventoryManagementService,
     @Inject(MAT_DIALOG_DATA) public data: any,
     private fglistService: FGListService
   ) {
    
   }
 itemId:number;
   dataView: any;
   ngOnInit() {
    
     this.updateSalesOrderDate = this.fb.group({
      so_no:[this.data?.sales_order_no,[Validators.required]],
      sales_order_date:[this.data?.expected_delivery_date,[Validators.required]]
     })
   }
 
   onClose() {
     this.dialog.close();
   }
   updateSoDate(){
    let frmData = this.updateSalesOrderDate.value;
    frmData.do_id=this.data?.do_id;
    let date = moment(frmData.sales_order_date).format('YYYY-MM-DD');
    frmData.sales_order_date = date;
    this.inventoryServices.updateSoDate(frmData,this.data.do_id).subscribe({
      next:(res:any)=> {
        this.toast.success(res.message)
        this.dialog.close(res);
      },error:(err)=> {
        this.toast.success(err.error.message)
      },
    })
   }
 
}
