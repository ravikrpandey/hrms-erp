import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { DataUpdateService } from 'src/app/@shared/services/data-update.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';

@Component({
  selector: 'app-extend-rfp-date-dialog',
  templateUrl: './extend-rfp-date-dialog.component.html',
  styleUrls: ['./extend-rfp-date-dialog.component.scss']
})
export class ExtendRfpDateDialogComponent implements OnInit {

  extendDateForm: any;
  procurement_product_id: any;
  currentDate: Date = new Date()
  status: any;
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  date = this.now.getDate();
  maxDate = moment({ year: this.year + 100, month: this.month, date: this.date }).format('YYYY-MM-DD');
  minDate = moment({ year: this.year - 0, month: this.month, date: this.date }).format('YYYY-MM-DD');
  pr_id: any;
  startDate: Date;
  minEndDate: any;
  dateNewStart: any;
  requiredCondition: boolean = false;
  entity_id: any;
  finacial_id: any;
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private toast: ToastrService,
    private prService: PurchaseRequestService,
    private updateTableData: DataUpdateService,
    private _commonService: CommonService,
    public dialog: MatDialogRef<ExtendRfpDateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.startDate = data?.cellData?.data?.start_date;
    console.log(this.startDate, 'this.startDate');

    this.status = data.status;
    this.pr_id = data.prId;
    this.extendDateForm = this.fb.group({
      startDate: new FormControl(null),
      end_date: new FormControl(null, Validators.required),
      update_stop_date: new FormControl(null),
      remarks_stop: new FormControl(null)
    });
    // this.startDate ="2024-04-26"
    // let dateNewStart=new Date("2024-04-26");
    // this.dateNewStart=moment(dateNewStart)
    // console.log(this.dateNewStart,'this.dateNewStart');

    this.extendDateForm.get('startDate').valueChanges.subscribe((value: any) => {
      if (value) {

        this.dateNewStart = value
        const endDate = this.extendDateForm.get('end_date').value;

        if (endDate < this.dateNewStart) {
          this.extendDateForm.get('end_date')?.setValue(null);
        }
      }

    });

  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    let finacial_id = localStorage.getItem('financial_id');
    this.finacial_id = Number(finacial_id)
    this.extendDateForm.patchValue({
      update_stop_date: this.currentDate,
      startDate: moment(this.startDate)
    })

  }

  updateDate() {
    if (this.extendDateForm.invalid) {
      this.requiredCondition = true;
      this.toast.error('Required fields should not be empty', 'Date Not Updated');
      return;
    }
    let val = this.extendDateForm.value
    const selectedDate = moment(val.end_date);
    const currentDate = moment(this.currentDate);

    // if(selectedDate.isAfter(currentDate)){
    //   console.log('Selected date is grater');
    // }else 
    if (selectedDate.isBefore(currentDate)) {
      this.toast.error('Selected Date should not be smaller than current date', 'Valid Date Error');
      return;
    }
    var outDate = moment(val.end_date).format("YYYY-MM-DD");

    let dateData = {
      end_date: outDate,
      rfp_number: this.data?.cellData?.rfp_number
    }
    this.prService.procurementProductId.subscribe((res: any) => {
      this.procurement_product_id = res;
    });



    if (this.procurement_product_id != null || this.procurement_product_id != undefined) {
      this._commonService?.showLoader()
      this.prService.updateExtendDate(this.procurement_product_id, dateData).subscribe((res: any) => {
        this._commonService?.hideLoader()
        if (res && res.code == 200) {
          this.toast.success('Date Updated successfully.');
          this.requiredCondition = false;

          this.getAllLiveRfpData();
        }
      }, err => {
        this._commonService?.hideLoader()
        this.toast.error('Something went To wrong')
      })
    }
  }

  getAllLiveRfpData() {
    let data = {
      entity_id: this.entity_id,
      financial_year_id: this.finacial_id
    }
    this._commonService?.showLoader()
    this.prService.getAllLiveRfp(data).subscribe((res: any) => {
      this._commonService?.hideLoader()
      const rowData = res;
      this.updateTableData.setTableData(rowData)
    }, (err: any) => {
      this._commonService?.hideLoader()
    })
  }


}
