import { Component } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PurchaseItemFormInterface } from 'src/app/@shared/interface/purchase.interface';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { PrApprovalDialogComponent } from '../../dialog/pr-approval-dialog/pr-approval-dialog.component';

@Component({
  selector: 'app-create-purchase-request',
  templateUrl: './create-purchase-request.component.html',
  styleUrls: ['./create-purchase-request.component.scss'],
})
export class CreatePurchaseRequestComponent {
  constructor(
    private toast: ToastrService,
    private prService: PurchaseRequestService,
    public dialog: MatDialog,
    private route: Router,
  ) {}

  onSubmit(form: FormGroup) {
    try {
      const newArray: any = [];
      // this.fileArray?.map((doc: any) => {
      //   newArray.push(doc?.url);
      // });

      let val = form.value;
      if (form.invalid) {
        this.toast.error('Required fields should not be empty', 'Fields Error');
        return;
      }
      const modifyData: any = [];

      val?.item_detail.map((item: PurchaseItemFormInterface) => {
        if (item?.item_master_id == undefined) {
          throw new Error('Pls Select Item');
        }
        if (item?.vendor_ids == undefined) {
          throw new Error('Pls Select Vendor');
        }
        if (item?.quantity == undefined) {
          throw new Error('Pls Fill Item Quantity');
        }
        if (item?.priority == undefined) {
          throw new Error('Pls Select Priority');
        }
        modifyData.push({
          item_master_id: item?.item_master_id,
          item_categroy_id: item?.asset_category_id,
          vendor_ids: item?.vendor_ids,
          tax: item?.tax,
          priority: item?.priority,
          total_mvp: item?.total_mvp,
          quantity: item?.quantity,
          grand_total: item?.grand_total,
        });
      });

      const item_detail = form.get('item_detail') as FormArray;

      // if (form?.value.prCategory == 'Item') {
      if (item_detail.value.length == 0) {
        this.toast.warning('Pls Add Item PR');
        return;
      }
      // if (this.budgetId <= 0) {
      //   this.toast.warning("Pls Fill For Suitable Budget!");
      //   return
      // }
      // }

      // this.totalPRValue = this.calculateTotalValue(item_detail.value);

      // if (this.remainingAmount < this.totalPRValue) {
      //   this.openBudgetRemainder();
      //   return;
      // }
      let data = {
        entity_id: val.entity_id,
        cost_center_id: val.cost_center_id,
        department_id: val.department_id,
        pr_category: form?.value.prCategory,
        pr_emp_code: val?.employee_code,
        pr_date: val?.date,
        pr_number: val?.purchase_number,
        pr_type: val?.type,
        remark: val?.remark,
        warehouse_id: val?.warehouse_id,
        billing_branch_id: val?.billing_branch_id,
        // pr_state: val?.state,
        // city: val?.city,
        // pr_address: val?.delivery_address,
        item_detail: modifyData,
        financial_year_id: val.financial_year_id,
        employee_id: val.employee_id,
        uploade_image: newArray,
        total_purchase: val.totalPurchaseAmount,
        remainingAmount: val.remainingAmount,
      };
      this.prService.createPrNew(data).subscribe(
        (res: any) => {
          // this.resdata = res.data;
          this.toast.success(res.message);
          this.route.navigate(['master/purchase-management/purchase-request']);
        },
        (err: any) => {
          this.toast.error(`${err?.error?.message}`);
        },
      );
    } catch (e: any) {
      console.log(e);
      this.toast.error(e?.message);
    }
  }

  onUpdate(form: FormGroup) {
    try {
      const newArray: any = [];
      // this.fileArray?.map((doc: any) => {
      //   newArray.push(doc?.url)
      // })

      // this.fileView?.map((doc: any) => {
      //   newArray.push(doc?.uploade_image)
      // })
      let val = form.value;
      if (form.invalid) {
        throw new Error('Required fields should not be empty');
      }
      const item_detail = form.get('item_detail') as FormArray;
      let itemDetailsArr = item_detail?.value as PurchaseItemFormInterface[];
      const modifyData: any = [];

      itemDetailsArr.map((item: PurchaseItemFormInterface) => {
        if (item.item_master_id == undefined) {
          throw new Error('Pls Select Item');
        }
        if (item?.vendor_ids == undefined) {
          throw new Error('Pls Select Vendor');
        }
        if (item?.quantity == undefined) {
          throw new Error('Pls Fill Item Quantity');
        }
        if (item?.priority == undefined) {
          throw new Error('Pls Select Priority');
        }
        modifyData.push({
          item_master_id: item?.item_master_id,
          item_categroy_id: item?.asset_category_id,
          vendor_ids: item?.vendor_ids,
          tax: item?.tax,
          priority: item?.priority,
          total_mvp: item?.mvp,
          quantity: item?.quantity,
          grand_total: item?.grand_total,
          id: item?.id,
        });
      });
      // if (form?.value.prCategory == 'Item') {
      if (item_detail.value.length == 0) {
        throw new Error('Pls Add Item PR');
      }
      // }

      // this.totalPRValue = this.calculateTotalValue(item_detail.value);
      // if (this.remainingAmount < this.totalPRValue) {
      //   this.openBudgetRemainder();
      //   return;
      // }

      let data = {
        entity_id: val.entity_id,
        cost_center_id: val.cost_center_id,
        billing_branch_id: val?.billing_branch_id,
        department_id: val.department_id,
        pr_category: form?.value.prCategory,
        pr_emp_code: val?.employee_code,
        pr_date: val?.date,
        pr_number: val?.purchase_number,
        pr_type: val?.type,
        remark: val?.remark,
        warehouse_id: val?.warehouse_id,
        // pr_state: val?.state,
        // city: val?.city,
        // pr_address: val?.delivery_address,
        item_detail: modifyData,
        financial_year_id: val.financial_year_id,
        employee_id: val.employee_id,
        uploade_image: newArray,
        total_purchase: val.totalPurchaseAmount,
        remainingAmount: val.remainingAmount,
        // uploade_image:this.fileUpload,
      };
      this.prService.updatedPr(val.id, data).subscribe(
        (res: any) => {
          this.toast.success(res.message);
          this.route.navigate(['master/purchase-management/purchase-request']);
        },
        (err: any) => {
          this.toast.error(`${err?.error?.message}`);
        },
      );
    } catch (e: any) {
      console.log(e);
      this.toast.error(e?.message);
    }
  }

  onApproval(form: FormGroup) {
    try {
      let val = form.value;
      const dialogRef = this.dialog.open(PrApprovalDialogComponent, {
        width: '400px',
        data: val,
      });
      dialogRef.afterClosed().subscribe((result) => {});
    } catch (error) {}
  }
}
