import { Component } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PurchaseItemFormInterface } from 'src/app/@shared/interface/purchase.interface';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { PoApprovalDialogComponent } from '../../dialog/po-approval-dialog/po-approval-dialog.component';

@Component({
  selector: 'app-create-po-form',
  templateUrl: './create-po-form.component.html',
  styleUrls: ['./create-po-form.component.scss'],
})
export class CreatePoFormComponent {
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
      //   newArray.push(doc?.url)
      // });

      let val = form.value;
      if (form.invalid) {
        this.toast.error('Required fields should not be empty', 'Fields Error');
        return;
      }
      // const modifyData: any = []

      val?.item_detail.map((item: PurchaseItemFormInterface) => {
        if (item?.item_master_id == undefined) {
          throw new Error('Pls Select Item');
        }
        if (item?.quantity == undefined) {
          throw new Error('Pls Fill Item Quantity');
        }
        // modifyData.push({
        //   item_master_id: item?.item_master_id,
        //   item_categroy_id: item?.asset_category_id,
        //   tax: item?.tax,
        //   discount: item?.discount,
        //   unit_price: item?.unit_price,
        //   total_mvp: item?.total_mvp,
        //   quantity: item?.quantity,
        //   grand_total: item?.grand_total,
        // })
      });

      const item_detail = form.get('item_detail') as FormArray;
      if (
        form?.value.prCategory == 'Item' ||
        form?.value.prCategory == 'Service'
      ) {
        if (item_detail.value.length == 0) {
          this.toast.warning('Pls Add Item PO');
          return;
        }

        // if (this.budgetId <= 0) {
        //   this.toast.warning("Pls Fill For Suitable Budget!");
        //   return;
        // }

        // this.totalPRValue = this.calculateTotalValue(item_detail.value);
        // if (this.remainingAmount < this.totalPRValue) {
        //   this.openBudgetRemainder();
        //   return;
        // }
      }

      // this.totalPRValue = this.calculateTotalValue(item_detail.value);

      // if (this.remainingAmount < this.totalPRValue) {
      //   this.openBudgetRemainder();
      //   return;
      // }

      if (
        form?.value.prCategory == 'Item' ||
        form?.value.prCategory == 'Service'
      ) {
        let data = {
          billing_address_id: val.billing_branch_id,
          entity_id: val.entity_id,
          cost_center_id: val.cost_center_id,
          profit_center_id: val.profit_center_id,
          department_id: val.department_id,
          po_category: form?.value.prCategory,
          po_date: val.date,
          po_number: val?.po_number,
          po_type: val?.type,
          po_remark: val?.remark,
          warehouse_id: val?.warehouse_id,
          item_detail: item_detail.value,
          financial_year_id: val.financial_year_id,
          employee_id: val.employee_id,
          uploade_image: newArray,
          total_purchase: val.totalPurchaseAmount,
          remainingAmount: val.remainingAmount,
          vendor_id: val.vendor_id,
          delivery_term: val?.delivery_term,
          delivery_term_remark: val?.delivery_term_remark,
          payment_term_id: val?.payment_term_id,
          payment_term_remark: val?.payment_term_remark,
          purchase_request_id: val?.purchase_request_id,
          quotation_id: val?.quotation_id,
          port_id: val?.port_id,
          incoterm_id: val?.incoterm_id,
          advance_utilization_percent: val?.advance_utilization_percent,
          currency_id: val?.currency_id,
          currency_rate: val?.currency_rate,
        };
        console.log(data);
        this.prService.createPoNew(data).subscribe(
          (res: any) => {
            this.toast.success(res.message);
            this.route.navigate(['master/purchase-management/purchase-order'], {
              queryParams: { tab: 'raise-po' },
            });
          },
          (err: any) => {
            this.toast.error(`${err?.error?.message}`);
          },
        );
      }
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
        if (item?.quantity == undefined) {
          throw new Error('Pls Fill Item Quantity');
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
      if (form?.value.prCategory == 'Item') {
        if (item_detail.value.length == 0) {
          throw new Error('Pls Add Item PO');
        }
      }

      // this.totalPRValue = this.calculateTotalValue(item_detail.value);
      // if (this.remainingAmount < this.totalPRValue) {
      //   this.openBudgetRemainder();
      //   return;
      // }

      if (form?.value.prCategory == 'Item') {
        let data = {
          billing_address_id: val.billing_branch_id,
          entity_id: val.entity_id,
          cost_center_id: val.cost_center_id,
          profit_center_id: val.profit_center_id,
          department_id: val.department_id,
          po_category: form?.value.prCategory,
          po_date: val.date,
          po_number: val?.po_number,
          po_type: val?.type,
          po_remark: val?.remark,
          warehouse_id: val?.warehouse_id,
          item_detail: itemDetailsArr,
          financial_year_id: val.financial_year_id,
          employee_id: val.employee_id,
          uploade_image: newArray,
          total_purchase: val.totalPurchaseAmount,
          remainingAmount: val.remainingAmount,
          vendor_id: val.vendor_id,
          delivery_term: val?.delivery_term,
          delivery_term_remark: val?.delivery_term_remark,
          payment_term_id: val?.payment_term_id,
          payment_term_remark: val?.payment_term_remark,
          port_id: val?.port_id,
          incoterm_id: val?.incoterm_id,
          advance_utilization_percent: val?.advance_utilization_percent,
          currency_id: val?.currency_id,
          currency_rate: val?.currency_rate,
        };
        console.log(data);
        this.prService.updatePoNew(val.id, data).subscribe(
          (res: any) => {
            this.toast.success(res.message);
            this.route.navigate(['master/purchase-management/purchase-order']);
          },
          (err: any) => {
            this.toast.error(`${err?.error?.message}`);
          },
        );
      }
    } catch (e: any) {
      console.log(e);
      this.toast.error(e?.message);
    }
  }

  onApproval(form: FormGroup) {
    try {
      let val = form.value;
      // const dialogRef = this.dialog.open(PoApprovedDialogComponent, {
      //   width: '400px',
      //   data: { cellData: this.getByData, updateData: val, updateDataService: val2 },
      // });
      // dialogRef.afterClosed().subscribe((result) => {

      //   this.remarkData = result;
      // });
      const dialogRef = this.dialog.open(PoApprovalDialogComponent, {
        width: '400px',
        data: val,
      });
      dialogRef.afterClosed().subscribe((result) => {});
    } catch (error) {}
  }
}
