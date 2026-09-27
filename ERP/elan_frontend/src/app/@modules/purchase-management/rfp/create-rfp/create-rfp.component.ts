import { Component } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PurchaseItemFormInterface } from 'src/app/@shared/interface/purchase.interface';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { PrApprovalDialogComponent } from '../../dialog/pr-approval-dialog/pr-approval-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-create-rfp',
  templateUrl: './create-rfp.component.html',
  styleUrls: ['./create-rfp.component.scss'],
})
export class CreateRfpComponent {
  constructor(
    private toast: ToastrService,
    private prService: PurchaseRequestService,
    public dialog: MatDialog,
    private route: Router,
  ) {}

  onSubmit(form: FormGroup) {
    try {
      let formValue = form.value;
      if (form.invalid) {
        this.toast.error('Required fields should not be empty', 'Fields Error');
        return;
      }
      const outDate = moment(formValue.end_date_pr).format('YYYY-MM-DD');
      const startDate = moment(formValue.start_date_pr).format('YYYY-MM-DD');

      if (formValue.prCategory == 'Item') {
        const selectedItems = formValue.item_detail.filter((item: any) => item.selected);
        if (!selectedItems || selectedItems.length === 0) {
          this.toast.error('Please select at least one item to initiate RFP!');
          return;
        }

        let dataSend = {
          item_detail: selectedItems,
          end_date: outDate,
          start_date: startDate,
          procurement_id: Number(formValue.id),
          site_url: `${window.location.origin}/send-rfp-link`,
          rfp_number: formValue.rfp_number,
          rfp_Initiated: formValue.rfpStatus,
          procurement_type: 'Item',
          entity_id: formValue.entity_id,
          financial_year_id: formValue.finacial_id,
          pr_code: formValue.prNumber,
          employee_id: formValue.employee_id,
        };
        console.log(dataSend);
        this.prService.sendRfpLink(dataSend).subscribe(
          (res: any) => {
            if (res.code == 200) {
              this.toast.success(
                'successfully emailed the RFP link to all vendors',
              );
              this.route.navigate(['master/purchase-management/rfp'], {
                queryParams: { tab: 'live-rfp' },
              });
            }
          },
          (err: any) => {
            this.toast.error('Something Went To Wrong..');
          },
        );
      } else if (formValue.prCategory == 'Service') {
        // formData.append('services_details', alld);
        // formData.append('procurement_type', "Service");
        // formData.append(`vendors_invited_count`, vendorCountNumber);

        let dataSerive = {
          end_date: outDate,
          start_date: startDate,
          // procurement_id: Number(this.pro_Id),
          // site_url: `${this.liveUrl + 'send-rfp-link'}`,
          // Rfp_Number: this.rfpNumber,
          // rfp_Initiated: this.rfpStatus,
          // vendors_invited_count: vendorCountNumber,
          // services_details: modifyData,
          // procurement_type: "Service",
          // entity_id: this.entity_id,
          // financial_year_id: this.finacial_id,
          // pr_code: this.details_pr?.pr_number
        };
        // ;
        //  return;
        this.prService.sendRfpService(dataSerive).subscribe(
          (res: any) => {
            // this.sendRfpData = res.data;
            if (res.code == 200) {
              this.toast.success(
                'successfully emailed the RFP link to all vendors',
              );
              this.route.navigate(['master/purchase-management/rfp'], {
                queryParams: { tab: 'live-rfp' },
              });
            }
          },
          (err: any) => {
            this.toast.error('Something Went To Wrong..');
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
      if (form?.value.prCategory == 'Item') {
        if (item_detail.value.length == 0) {
          throw new Error('Pls Add Item PR');
        }
      }

      // this.totalPRValue = this.calculateTotalValue(item_detail.value);
      // if (this.remainingAmount < this.totalPRValue) {
      //   this.openBudgetRemainder();
      //   return;
      // }

      if (form?.value.prCategory == 'Item') {
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
            this.route.navigate([
              'master/purchase-management/purchase-request',
            ]);
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
      const dialogRef = this.dialog.open(PrApprovalDialogComponent, {
        width: '400px',
        data: val,
      });
      dialogRef.afterClosed().subscribe((result) => {});
    } catch (error) {}
  }
}
