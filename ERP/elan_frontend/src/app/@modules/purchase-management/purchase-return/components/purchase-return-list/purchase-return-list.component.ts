import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-purchase-return-list',
  templateUrl: './purchase-return-list.component.html',
  styleUrls: ['./purchase-return-list.component.scss']
})
export class PurchaseReturnListComponent implements OnInit {
  @Input() returnsList: any[] = [];
  @Input() isVendor: boolean = false;
  @Input() stats: any = { total: 0, pending: 0, approved: 0, rejected: 0 };
  @Input() vendorsList: any[] = [];
  @Input() statusList: any[] = [];

  @Output() onView = new EventEmitter<number>();
  @Output() onEdit = new EventEmitter<number>();
  @Output() onSubmit = new EventEmitter<number>();
  @Output() onDelete = new EventEmitter<number>();
  @Output() onComplete = new EventEmitter<number>();
  @Output() onCreate = new EventEmitter<void>();
  @Output() onRefresh = new EventEmitter<void>();

  vendorTab: 'approval' | 'history' = 'approval';
  filterVendor: any = '';
  filterStatus: any = '';
  filterSearch: string = '';

  constructor() {}

  ngOnInit(): void {}

  setVendorTab(tab: 'approval' | 'history') {
    this.vendorTab = tab;
  }

  getFilteredReturns() {
    let list = this.returnsList || [];
    
    // Apply local search filtering first
    if (this.filterSearch) {
      const search = this.filterSearch.toLowerCase();
      list = list.filter(r => r.return_no && r.return_no.toLowerCase().includes(search));
    }
    if (this.filterVendor) {
      list = list.filter(r => r.vendor_id == this.filterVendor);
    }
    if (this.filterStatus) {
      list = list.filter(r => r.status === this.filterStatus);
    }

    if (!this.isVendor) {
      return list;
    }

    // Apply vendor tabs filters
    if (this.vendorTab === 'approval') {
      return list.filter(r => r.status === 'APPROVED');
    } else {
      return list.filter(r => r.status === 'COMPLETED');
    }
  }

  searchReturns() {
    this.onRefresh.emit();
  }

  resetFilters() {
    this.filterVendor = '';
    this.filterStatus = '';
    this.filterSearch = '';
    this.onRefresh.emit();
  }
}
