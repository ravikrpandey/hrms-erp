import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-statutory-reports',
  templateUrl: './statutory-reports.html',
  styleUrls: ['./statutory-reports.scss']
})
export class StatutoryReports {
selectedYear: any;
  selectedMonth: any;
  selectedEmployee: any[] = [];

  financialYearList: any[] = [];
  monthList: any[] = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  filterEmployee: any[] = [
    { employee_id: 1, first_name: 'Goldy', last_name: '' },
    { employee_id: 2, first_name: 'Smen', last_name: 'Gosh' },
    { employee_id: 3, first_name: 'Illiaz', last_name: '' },
    { employee_id: 4, first_name: 'Shoorvir', last_name: '' }
  ];

  constructor(
    private toaster: ToastrService,
    private $miscellaneous: MiscellaneousService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();
    this.getFinancialYear();
  }

  generateFun(): void {
  if (!this.selectedYear || !this.selectedMonth || this.selectedEmployee.length === 0) {
    this.toaster.error('Please select Fiscal Year, Pay Period, and at least one Employee.');
    return;
  }

  const fileUrl = 'assets/Payroll_Statutory_Report_Sample.xlsx'; // Your static file path
  this.http.get(fileUrl, { responseType: 'blob' }).subscribe((res: Blob) => {
    const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Employee_Statutory_Reports.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  });
}

  cancelFun(): void {
    this.toaster.info('Cancelled');
  }

  getFinancialYear(): void {
    this.$miscellaneous.getAllActivefinancial_year().subscribe(
      (res: any) => {
        this.financialYearList = res?.data || [];
        this.financialYearList.forEach((item: any) => {
          item.financial_year = item.financial_year;
        });
      },
      (err) => {
        console.error('Error fetching financial years', err);
        this.toaster.error('Failed to load financial years');
      }
    );
  }
}
