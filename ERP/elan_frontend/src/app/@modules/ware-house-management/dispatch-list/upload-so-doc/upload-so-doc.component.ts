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
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { environment } from 'src/app/environments/environment';


@Component({
  selector: 'app-upload-so-doc',
  templateUrl: './upload-so-doc.component.html',
  styleUrls: ['./upload-so-doc.component.scss']
})
export class UploadSoDocComponent {

  updateSalesOrderDate:FormGroup;
 
   constructor(
     private router: Router,
     private toast: ToastrService,
     private activeroute: ActivatedRoute,
     public dialog: MatDialogRef<UploadSoDocComponent>,
     private fb: FormBuilder,
     private inventoryServices: InventoryManagementService,
     @Inject(MAT_DIALOG_DATA) public data: any,
     private fglistService: FGListService,
       private $miscellaneousService: MiscellaneousService,
       public $common: CommonService,
   ) {
    
   }

 itemId:number;
   dataView: any;
   folderName:string='pod_documents';
   baseUrl:any;
entityId:any;
financial_year_id:any;
loginEmp:any;
   ngOnInit() {
     this.baseUrl = environment.servralUrl+'/uploaded_files/'+this.folderName;  
      this.entityId = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.loginEmp = localStorage.getItem('EmpMainId');
     this.updateSalesOrderDate = this.fb.group({
      so_no:[this.data?.sales_order_no,[Validators.required]],
      planning_code:[this.data?.planning_code,[Validators.required]],
      delivered_on_date:[this.data?.delivered_on_date,[Validators.required]],
      file:['',[Validators.required]],
      invoice_no:[this.data?.sales_invoice_no,[Validators.required]],
      pod_remark:[this.data?.pod_remark,[Validators.required]],
      dispatch_status:[this.data?.dispatch_status]
     })
   }
 
   onClose() {
     this.dialog.close();
   }

   updateSoDate(){

      let frmData = this.updateSalesOrderDate.value;
      const formData = new FormData();

      formData.append('so_id', this.data.salesOrderId);
      formData.append('invoice_no', frmData.invoice_no);
      formData.append('delivered_on_date', frmData.delivered_on_date);
      formData.append('pod_remark', frmData.pod_remark);
      formData.append('dispatch_status', frmData.dispatch_status);
      formData.append('file', this.file);
      formData.append('warehouse_id', this.data?.warehouse_id);
      formData.append('financial_id', this.financial_year_id);
      formData.append('entity_id', this.entityId);
      formData.append('loginEmployee', this.loginEmp);

      this.inventoryServices.uploadPODDoc(formData,this.folderName,true).subscribe({
        next:(res:any)=> {
          this.toast.success(res.message);
          this.dialog.close(res);
        },error:(err)=> {
          this.toast.error(err.error.message);
        },
      })

      // let frmData = this.updateSalesOrderDate.value;
      // let date = moment(frmData.delivered_on_date).format('YYYY-MM-DD');
      // frmData.delivered_on_date=date;
      // frmData.file=this.file;
      
      // this.inventoryServices.uploadSoDoc(frmData,this.data.salesOrderId).subscribe({
      //   next:(res:any)=> {
      //     this.toast.success(res.message);
      //     this.dialog.close(res);
      //   },error:(err)=> {
      //     this.toast.error(err.error.message);
          
      //   },
      // })
   }

   file: any;
   uploadDoc(event: any) {
    this.file = event.target.files[0];
    //  try {
    //    let isValidExtension = this.$common.checkForValidFile(event);
    //    if (!isValidExtension) {
    //      this.updateSalesOrderDate.patchValue({ file: null });
    //      return this.file = ""
    //    }
    //    const formData = new FormData();
    //    if (event.target.files && event.target.files[0]) {
    //      formData.append('file', event.target.files[0]);
    //    }
       
    //    this.$miscellaneousService.documents(formData).subscribe((response: any) => {
    //      if (response) {
    //        this.file = `uploaded_files/${response?.url}`;
    //      }
    //    }, err => {
    //      console.log(err);
    //    })
    //  } catch (error) {
    //    console.log(error);
    //  }
   }
 
   viewImg() {
 
     window.open(this.baseUrl + '/' + this.file, '_blank');
   }
}
