import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/app/environments/environment';
import { InventoryManagementService } from 'src/app/@modules/ware-house-management/inventory-management.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delivery-root-pod',
  templateUrl: './delivery-root-pod.component.html',
  styleUrls: ['./delivery-root-pod.component.scss']
})
export class DeliveryRootPodComponent {
  dataBind: any = [];
  mode: any;
  folderName:string='pod_documents';
  baseUrl: any;

  constructor(public dialog: MatDialogRef<DeliveryRootPodComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
     private inventoryServices: InventoryManagementService,
     private toast: ToastrService
    ) {
    
  }

  ngOnInit(): void {
    this.dataBind = this.data.data;
    this.mode = this.data.mode;
    this.dataBind.so_details.forEach((so: any) => {
      so.isEdit = false; // use for edit
      so.so_number_prefix = so.so_number+'/INV-';
    });

    this.baseUrl = environment.servralUrl+'/uploaded_files/'+this.folderName;
  }

  toggleEdit(so: any) {
    so.isEdit = !so.isEdit;
  }

  onFileSelect(event: any, so: any) {
    so.selectedFile = event.target.files[0];
  }

  isValidSO(so: any) {
    return so.invoice_no &&
          so.delivered_on_date &&
          so.pod_remark &&
          (so.selectedFile || so.file);
  }

  onUploadClick(so: any) {

    if (!this.isValidSO(so)) {
      so.showValidationMsg = true;

      setTimeout(() => {
        so.showValidationMsg = false;
      }, 5000);

      return;
    }

    this.savePOD(so);
  }

  savePOD(so: any) {
    //console.log(so,"__SO");
    const formData = new FormData();

    formData.append('so_id', so.so_id);
    formData.append('invoice_no', so.invoice_no);
    formData.append('delivered_on_date', so.delivered_on_date);
    formData.append('pod_remark', so.pod_remark);
    formData.append('file', so.selectedFile);
    formData.append('warehouse_id', this.dataBind.warehouse_id);
    formData.append('entity_id', this.dataBind.entity_id);
    formData.append('financial_id', this.dataBind.financial_year_id);

    const obj: any = {};
    formData.forEach((value, key) => obj[key] = value);
    // console.log(obj);

    this.inventoryServices.uploadPODDoc(formData,this.folderName,true).subscribe({
      next:(res:any)=> {
        this.toast.success(res.message);
        this.dialog.close({ success: true });
      },error:(err)=> {
        this.toast.error(err.error.message);
      },
    })
  }

  closePopup() {
    this.dialog.close();
  }

}