import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { TimesheetService } from '../../employee-self-service/timesheet/timesheet.service';
import { PurchaseDashboardService } from '../services/purchase-dashboard.service';

@Component({
  selector: 'app-purchase-dashboard',
  templateUrl: './purchase-dashboard.component.html',
  styleUrls: ['./purchase-dashboard.component.scss']
})
export class PurchaseDashboardComponent implements OnInit {
  metrics: any = [];
  months: any[] = [];
  fromMonth: number = 1;
  toMonth: number = 12;
  totalSpend: any;
  quantityLedger: any[] = [];
  filteredLedger: any[] = [];
  searchTerm: string = '';

  constructor(
    private dashboardService: PurchaseDashboardService,
    private toaster: ToastrService,
    private _timesheetService: TimesheetService,
    private accessCtl: AccessControlService
  ) { }

  ngOnInit(): void {
    this.getTotalSpend();
    this.getPurchaseDataCount();
    this.getMonthList();
    this.getQuantityLedger();
  }

  getMonthList() {
    this._timesheetService.getMonthList().subscribe((res: any) => {
      this.months = res.data;
    })
  }

  getMetricClass(title: string): string {
    switch (title) {
      case 'Total Spend':
        return 'total-spend';
      case 'Supplier':
        return 'supplier';
      case 'GRN Count':
        return 'grn-count';
      case 'PO Count':
        return 'po-count';
      case 'PR Count':
        return 'pr-count';
      case 'Invoice Count':
        return 'invoice-count';
      case 'Open PO Count':
        return 'open-po-count';
      case 'Open PO Amount':
        return 'open-po-amount';
      default:
        return '';
    }
  }

  getTotalSpend() {
    const reqData = {
      fromMonth: this.fromMonth,
      toMonth: this.toMonth
    };

    this.dashboardService.getTotalSpend(this.accessCtl.getEntityId(), reqData).subscribe((res: any) => {
      const data = res.data;
      this.totalSpend = data.total_amount_paid ? `${parseFloat(data.total_amount_paid).toLocaleString()}` : 0;
    });
  }

  getPurchaseDataCount() {
    if (this.fromMonth > this.toMonth) {
      this.toaster.error('Invalid month range. From Month cannot be greater than To Month.');
      return;
    } else {
      const data = {
        fromMonth: this.fromMonth,
        toMonth: this.toMonth
      }
      this.dashboardService.getAllPurchaseCount(this.accessCtl.getEmployeeId(), this.accessCtl.getEntityId(), data).subscribe((res: any) => {
        const data = res.data;
        this.metrics = [

          { title: 'Supplier', value: data.supplierCount || 0 },
          { title: 'PR Count', value: data.prCount || 0 },
          { title: 'PO Count', value: data.purchaseOrderCount || 0 },
          { title: 'GRN Count', value: data.grnCount || 0 },
          { title: 'Invoice Count', value: data.invoiceCount || 0 },
          { title: 'Open PO Count', value: data.openPo || 0 },
          { title: 'Open PO Amount', value: data.openPoAmount ? `${parseFloat(data.openPoAmount).toLocaleString()}` : 0 }
        ];
      });
    }
  }

  onToMonthChange(newValue: number): void {
    console.log('To Month Changed:', newValue);
    this.toMonth = newValue;
    this.applyFilters();
  }

  applyFilters() {
    this.getPurchaseDataCount();
    this.getTotalSpend();
    this.getQuantityLedger();
  }

  getQuantityLedger() {
    const entityId = this.accessCtl.getEntityId();
    this.dashboardService.getQuantityLedger(entityId).subscribe((res: any) => {
      if (res && res.data) {
        this.quantityLedger = res.data;
        this.applySearchFilter();
      }
    });
  }

  applySearchFilter() {
    if (!this.searchTerm.trim()) {
      this.filteredLedger = this.quantityLedger;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredLedger = this.quantityLedger.filter(item => 
        (item.pr_number && item.pr_number.toLowerCase().includes(term)) ||
        (item.item_name && item.item_name.toLowerCase().includes(term)) ||
        (item.item_code && item.item_code.toLowerCase().includes(term)) ||
        (item.current_stage && item.current_stage.toLowerCase().includes(term))
      );
    }
  }
}
