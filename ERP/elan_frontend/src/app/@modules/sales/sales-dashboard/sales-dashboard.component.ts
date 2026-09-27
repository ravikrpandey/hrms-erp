import { Component } from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';

import { Router } from '@angular/router';
import { TimesheetService } from '../../employee-self-service/timesheet/timesheet.service';
import { SalesService } from '../service/sales.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sales-dashboard',
  templateUrl: './sales-dashboard.component.html',
  styleUrls: ['./sales-dashboard.component.scss']
})
export class SalesDashboardComponent {
  mainEmpId: any;
  entityId:any;
  rowClass: any;
  public rowData:any;
  metrics: any = [];
  months: any[]=[];
  fromMonth: number = 1;
  toMonth: number = 12;
  totalSpend: any;
  financialYear_id: string | null;
conversionRate=5;
  salesTrendsData: any;
  constructor(
    private dashboardService : SalesService,
    private toaster :ToastrService,
    private _timesheetService : TimesheetService,
    private router: Router
  ){}

  ngOnInit():void{
    this.mainEmpId = localStorage.getItem('EmpMainId');
    this.entityId = localStorage.getItem('selectedEntityId');
    this.financialYear_id = localStorage.getItem('financial_id');
    this.getSalesDashboard();
    this.getMonthList();
    this.getSalesTrends();
  }
  getMonthList(){
    // this._timesheetService.getMonthList().subscribe((res:any)=>{
    //   this.months = res.data;
    // })
  }
  onToMonthChange(newValue: number): void {
    this.toMonth = newValue;
    this.applyFilters();
  }
  applyFilters() {
    this.getSalesDashboard();
  }
  getMetricClass(title: string): string {
    switch (title) {
      case 'Total Orders':
        return 'total-orders';
      case 'Total Sale':
        return 'total-sale';
      case 'Avg Deal Size':
        return 'avg-deal-size';
      default:
        return '';
    }
  }
  
  getMetricLink(title: string): string {
    switch (title) {
      case 'Total Orders':
        return '/master/sales/closed-deals';
      case 'Total Sale':
        return '/master/sales/closed-deals';
      case 'Avg Deal Size':
        return '/master/sales/closed-deals';
      default:
        return '/master/sales/dashboard';
    }
  }
  navigateToMetric(metric: any): void {
      const route = this.getMetricLink(metric.title);
      this.router.navigate([route]);
  }
  getSalesTrends(){
    // this.dashboardService.getSalesTrends(this.entityId).subscribe((res:any)=>{
    //   this.salesTrendsData = res.data[0];
    // })
  }
  getSalesDashboard() {
    if (this.fromMonth > this.toMonth) {
      this.toaster.error('Invalid month range. From Month cannot be greater than To Month.');
      return;
    }else {
    const data = {
      fromMonth: this.fromMonth,
      toMonth: this.toMonth,
      financial_id: this.financialYear_id
    };
  
    // this.dashboardService.salesDashboard(this.entityId, data).pipe(
    //   catchError((error:any) => {
    //     if (error.status === 404) {
    //       this.toaster.error('No Data Found on Specific Month Range','Error');
    //       this.metrics = [
    //         { title: 'Total Orders', value: 0, link: '/master/sales/closed-deals' },
    //         { title: 'Total Sale', value: 0, link: '/master/crm/lead-summary' },
    //         { title: 'Avg Deal Size', value: 0, link: '/master/crm/lead-summary' },
    //       ];
    //     } else {
    //       console.error('An error occurred:', error.message);
    //     }
    //     return of(null); 
    //   })
    // ).subscribe((res: any) => {
    //   if (res && res.data) {
    //     const data = res.data;
    //     this.metrics = [
    //       { title: 'Total Orders', value: data.totalOrders || 0, link: '/master/sales/closed-deals' },
    //       { title: 'Total Sale', value: data.totalGrant || 0, link: '/master/sales/closed-deals' },
    //       { title: 'Avg Deal Size', value: data.averageDealSize || 0, link: '/master/sales/closed-deals' },
    //       // { title: 'Conversion Rate', value: `${data.conversionRate || 0}%`, link: '/master/sales/closed-deals' },
    //     ];
    //   }
    // });
  }
  }
}
