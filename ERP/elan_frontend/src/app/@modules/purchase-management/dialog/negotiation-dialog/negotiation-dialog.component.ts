import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DataUpdateService } from 'src/app/@shared/services/data-update.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';

@Component({
  selector: 'app-negotiation-dialog',
  templateUrl: './negotiation-dialog.component.html',
  styleUrls: ['./negotiation-dialog.component.scss']
})
export class NegotiationDialogComponent {
  extendDateForm: any;
  currentDate: Date = new Date();
  status: any;
  pr_id: any;
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  date = this.now.getDate();
  maxDate = moment({ year: this.year + 100, month: this.month, date: this.date }).format('YYYY-MM-DD');
  minDate = moment({ year: this.year - 0, month: this.month, date: this.date }).format('YYYY-MM-DD');
  procurement_product_id: any;
  startDate: any;
  entity_id: any;
  finacial_id: any;
  rowData: never[];

  constructor(private fb: FormBuilder,
    private route: Router,
    private prService: PurchaseRequestService,
    private toast: ToastrService,
    public dialog: MatDialogRef<NegotiationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.startDate = data?.cellData?.data?.start_date_nego;
    this.status = data.status;
    this.pr_id = data.prId;
    this.extendDateForm = this.fb.group({
      end_date: new FormControl(null),
      update_stop_date: new FormControl(null),
      remarks_stop: new FormControl(null)
    })
  }


  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    let finacial_id = localStorage.getItem('financial_id');
    this.finacial_id = Number(finacial_id)
    this.extendDateForm.patchValue({
      update_stop_date: this.currentDate
    })
  }

  updateDate() {
    let val = this.extendDateForm.value;
    const selectedDate = moment(val.end_date);
    const currentDate = moment(this.currentDate);
    if (selectedDate.isBefore()) {
      this.toast.error('Selected Date should not be smaller than current date', 'Valid Date Error');
      return
    }
    var outDate = moment(val.end_date).format("YYYY-MM-DD");

    let dateData = {
      end_date_nego: outDate
    }
    this.prService.procurementProductId.subscribe((res: any) => {
      this.procurement_product_id = res;
    });



    if (this.procurement_product_id != null || this.procurement_product_id != undefined) {
      this.prService.updateExtendDateNegotiate(this.procurement_product_id, dateData).subscribe((res: any) => {
        if (res && res.code == 200) {
          this.toast.success('Date Updated successfully.');
          this.dialog.close();
        }
      }, err => {
        this.toast.error('Something went To wrong')
      })
    }
  }

  updateNego() {
    let val = this.extendDateForm.value;
    var stopDate = moment(val.update_stop_date).format("DD-MM-YYYY");
    const data = {
      //  procurement_id :this.pr_id,
      nego_status: "CLOSE Nego",
      stop_nego_date: stopDate
    }
    this.prService.updateStopDateNegotiate(this.pr_id, data).subscribe((res: any) => {
      this.toast.success("Update Successfully..")
      this.route.navigate([
        'master/purchase-management/negotiation',
      ], {
        queryParams: {
          tab: 'close-negotiation'
        }
      });
      this.dialog.close();
    },
      ((err: any) => {
        this.toast.error("Something Went To Wrong")
      })
    )
  }
}
