import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
})
export class CustomerDetailsComponent {
  currentReport: string = '';
  new_customer: any = null;
  tabname: boolean = false;
  reportMap: { [key: string]: string } = {
    '/master/sales/customer-details/profile': 'Company Profile',
    '/master/sales/customer-details/contact': 'Contact Information',
    '/master/sales/customer-details/address': 'Address Information',
    '/master/sales/customer-details/directory': 'Customer Directory',
    '/master/sales/customer-details/business-details': 'Business Details',
    '/master/sales/customer-details/documents': 'Documents',
    '/master/sales/customer-details/ledger': 'Ledger',
    '/master/sales/customer-details/invoice': 'Invoice',
  };
  action_type: any = '';
  customer_id: any;
  addCustomer_Id: any = '';
  lead_id: any = '';
  parentStatus: string | null = null; 

  constructor(
    private router: Router,
    private comman_service: CommonService,
    private activetRoute: ActivatedRoute,
    private location: Location
  ) {
    this.comman_service.sharedData$.subscribe((tab: any) => {
      if (tab) {
        this.tabname = true;
      } else {
        this.tabname = false;
      }
    });

    this.activetRoute.queryParams.subscribe((params: any) => {
      this.new_customer = params.new_customer;
      this.parentStatus = params.status; // Read status from query params
      if (params.action_type) {
        this.action_type = params.action_type;
        this.customer_id = params.id;
        this.lead_id = params.lead_id;

      } else {
        this.customer_id = params.id;
        if (this.customer_id) {
          this.action_type = 'add';
          this.lead_id = params.lead_id;
        }
      }
    });
  }

  ngOnInit(): void {
    this.updateCurrentReport();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateCurrentReport();
      }
    });
  }

  onChange(event: any) {
    const routes: any = {
      Profile: '/master/sales/customer-list/profile',
      contact: '/master/sales/customer-list/contact',
      address: '/master/sales/customer-list/address',
      bank: '/master/sales/customer-list/bank',
      'business-details': '/master/sales/customer-list/business-details',
      documents: '/master/sales/customer-list/documents',
      ledger: '/master/sales/customer-list/ledger',
      billing: '/master/sales/customer-list/billing',
      'customer-delivery': '/master/sales/customer-list/customer-delivery',
      // 'customer-amount':
      //   '/master/sales/customer-details/customer-product-price',
      'customer-amount':
        '/master/sales/customer-list/customer-item-name',
      'approve-customer': '/master/sales/customer-list/approve-customer',
      'account-receivable-details': '/master/sales/customer-list/account-receivable-details',
      'advance-customer': '/master/sales/customer-list/advance-customer',
    };

    const route = routes[event];

    if (route && (this.action_type == 'edit' || this.action_type == 'view')) {
      const queryParams = this.action_type
        ? {
            id: this.customer_id,
            action_type: this.action_type,
            lead_id: this.lead_id,
            new_customer: this.new_customer,
            status: this.parentStatus, // Add status for approve-customer
          }
        : null;
      this.router.navigate([route], { queryParams });
    } else {
      const queryParams =
        this.action_type == 'add'
          ? {
              id: this.customer_id,
              lead_id: this.lead_id,
              new_customer: this.new_customer,
              status: this.parentStatus, // Add status for approve-customer
            }
          : null;
      this.router.navigate([route], { queryParams });
    }
  }

  updateCurrentReport(): void {
    const currentRoute = this.router.url;
    this.currentReport = this.reportMap[currentRoute] || 'Details';
  }

  onBack(){
    this.location.back();
  }

}
