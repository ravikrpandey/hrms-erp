import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { DownloadCsvService } from 'src/app/@shared/services/service/download-csv.service';

@Component({
  selector: 'app-download-csv-dialog',
  templateUrl: './download-csv-dialog.component.html',
  styleUrls: ['./download-csv-dialog.component.scss']
})
export class DownloadCsvDialogComponent implements OnInit {


  constructor(
    private toast: ToastrService,
    private _downloadCsvService: DownloadCsvService,
    private _commonService: CommonService,
    public dialog: MatDialogRef<DownloadCsvDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  employeeLabelList: any = [
    {
      label: 'Title',
      value: 'title',
      isChecked: false,
    },
    {
      label: 'Employee Number',
      value: 'employee_code',
      isChecked: false,
    },
    {
      label: 'First Name',
      value: 'first_name',
      isChecked: false,
    },
    {
      label: 'Middle Name',
      value: 'middle_name',
      isChecked: false,
    },
    {
      label: 'Last Name',
      value: 'last_name',
      isChecked: false,
    },
    {
      label: 'Gender',
      value: 'gender',
      isChecked: false,
    },
    {
      label: 'Date Of Birth',
      value: 'date_of_birth',
      isChecked: false,
    },
    {
      label: 'Personal Email Id',
      value: 'emp_personal_email',
      isChecked: false,
    },
    {
      label: 'Contact Number',
      value: 'contact_number',
      isChecked: false,
    },
    {
      label: 'Reporting Manager',
      value: 'reporting_manager_id',
      isChecked: false,
    },
    {
      label: 'Location',
      value: 'location_id',
      isChecked: false,
    },
    {
      label: 'Department',
      value: 'department_id',
      isChecked: false,
    },
    {
      label: 'Area',
      value: 'area_id',
      isChecked: false,
    },
    {
      label: 'Position',
      value: 'designation_id',
      isChecked: false,
    },
    {
      label: 'Employee Type',
      value: 'emplyoment_type_id',
      isChecked: false,
    },
    {
      label: 'Municipality',
      value: 'municipality_id',
      isChecked: false,
    },
    {
      label: 'Assign Role',
      value: 'role_master_id',
      isChecked: false,
    },
    {
      label: 'Official Email Id',
      value: 'employee_official_email',
      isChecked: false,
    },
    {
      label: 'Official Email Id',
      value: 'employee_official_email',
      isChecked: false,
    },
    {
      label: 'Present Address',
      value: 'present_address',
      isChecked: false,
    },
    {
      label: 'Parmeanent Address',
      value: 'parmanent_address',
      isChecked: false,
    },
    {
      label: 'Dire Number',
      value: 'DIRE_number',
      isChecked: false,
    },
    {
      label: 'Driving License Number',
      value: 'driving_license_number',
      isChecked: false,
    },
    {
      label: 'Blood Group',
      value: 'blood_group',
      isChecked: false,
    },
    {
      label: 'Id Number',
      value: 'id_number',
      isChecked: false,
    },
    {
      label: 'Issue Date',
      value: 'issued_date',
      isChecked: false,
    },
    {
      label: 'Exp Date',
      value: 'exp_date',
      isChecked: false,
    },
    {
      label: 'Tax Number',
      value: 'tax_number',
      isChecked: false,
    },
    {
      label: 'Passport Number',
      value: 'passport_number',
      isChecked: false,
    },
    {
      label: 'Merital Status',
      value: 'marital_status',
      isChecked: false,
    },
    {
      label: 'Spouse Name',
      value: 'spouse_name',
      isChecked: false,
    },

    // Salary details start
    {
      label: 'Basic Salary',
      value: 'basic_salary',
      isChecked: false,
    },
    {
      label: 'Salary Per Day',
      value: 'salary_per_day',
      isChecked: false,
    },
    {
      label: 'Salary Per Hr',
      value: 'salary_per_hr',
      isChecked: false,
    },
    {
      label: 'Salary Monthly Hr',
      value: 'total_monthly_hr',
      isChecked: false,
    },
    {
      label: 'Weekly Hour',
      value: 'weekly_hour',
      isChecked: false,
    },

    // Payment details start
    {
      label: 'Bank Name',
      value: 'employee_name_in_bank',
      isChecked: false,
    },
    {
      label: 'Bank Address',
      value: 'bank_address',
      isChecked: false,
    },
    {
      label: 'Account',
      value: 'account_number',
      isChecked: false,
    },
    {
      label: 'Unit Number',
      value: 'nuit_number',
      isChecked: false,
    },
    {
      label: 'INSS Number',
      value: 'inss_number',
      isChecked: false,
    },

    // Contract details start
    {
      label: 'Start working date',
      value: 'start_working_date',
      isChecked: false,
    },
    {
      label: 'Probation End date',
      value: 'end_date_probation',
      isChecked: false,
    },
    {
      label: 'Account',
      value: 'account_number',
      isChecked: false,
    },
    {
      label: 'Unit Number',
      value: 'nuit_number',
      isChecked: false,
    },
    {
      label: 'Bank District Name',
      value: 'bank_district_name',
      isChecked: false,
    },
    {
      label: 'INSS Number',
      value: 'inss_number',
      isChecked: false,
    },

    // Contract details start
    {
      label: 'Start working date',
      value: 'start_working_date',
      isChecked: false,
    },
    {
      label: 'Probation End date',
      value: 'end_date_probation',
      isChecked: false,
    },

  ]

  ngOnInit(): void {

  }

  getCheckedValue(index: any) {
    
    this.employeeLabelList[index].isChecked = !this.employeeLabelList[index]?.isChecked;
    console.log(this.employeeLabelList)
  }

  dataList: any = [];
  downloadEmployeeData() {
    let keyList = this.employeeLabelList?.filter((elem: any) => elem?.isChecked);
    if (!keyList?.length) {
      return this.toast.error('Check at least one checkbox');
    }
    this._downloadCsvService.downloadEmployeeData(keyList).subscribe((res: any) => {
      this.dataList = res.data;
      if (this.dataList) {
        this._commonService?.downloadCSV(this.dataList);
        this.dialog.close()
      }
    })
  }

  isAllChecked: boolean = false;
  selectAll() {
    
    console.log(this.isAllChecked)
    if (!this.isAllChecked) this.employeeLabelList?.map((item: any) => item.isChecked = true);
    else this.employeeLabelList?.map((item: any) => item.isChecked = false);
    this.isAllChecked = !this.isAllChecked;
  }

}
