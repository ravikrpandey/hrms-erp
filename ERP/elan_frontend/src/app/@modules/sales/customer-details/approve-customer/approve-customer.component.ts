import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesService } from '../../service/sales.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-approve-customer',
  templateUrl: './approve-customer.component.html',
  styleUrls: ['./approve-customer.component.scss'],
})
export class ApproveCustomerComponent {
  customerList: any[] = [];
  pendingCustomers: any[] = [];
  selectedCustomers: any[] = [];
  entity_id: any;
  loginUser: any;
  financial_year_id: any;
  parentId: number | null = null;
  parentStatus: string | null = null; // Add this line
  remarks: any;
  remarksOpen: boolean = false;
  rowData: any;
  approvalData: any;
  profileData: any;
  gstInValue: boolean = false;
  docValue: boolean = false;
  billingAdress: boolean = false;
  constructor(
    private salesService: SalesService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private service: ConfigurationalmasterService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.parentId = parseInt(params['id']) || null;
      this.parentStatus = params['status'] || null; // Read status from query params
    });
    let a: any = localStorage.getItem('signInUser');
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');

    this.loginUser = JSON.parse(a);
    this.getAllCustomerList('Pending');
    this.getAllCustomerApproval();
    this.getCustomerProfileById(this.parentId);
    this.getCustomerDocumentsById(this.parentId);
    this.getCustomerAddressInfoById(this.parentId);
  }

  getAllCustomerList(status: string) {
    let data = {
      entity_id: this.entity_id,
      financial_year_id: this.financial_year_id,
      employee_id: this.loginUser?.employee_id,
      userRole: this.loginUser?.role,
      status: status,
    };
    this.customerList = [];
    this.salesService.getAllCustomersList(data).subscribe((res: any) => {
      if (res) {
        this.customerList = res.data
          ? res.data.filter((customer: any) => customer.id !== this.parentId)
          : [];
        // Filter pending customers if needed
        this.pendingCustomers = this.customerList;
      }
    });
  }

  approveSelectedCustomers() {
    if (!this.parentId) return;

    // if (this.approvalData?.approval_option === 'with_document') {
    //   if (
    //     this.gstInValue === true ||
    //     this.docValue === true ||
    //     this.billingAdress === true
    //   ) {
    //     this.toastr.warning('Gst Number or Document Not Filed Pls check');
    //     return;
    //   }
    // } else if (this.approvalData?.approval_option === 'without_document') {
    //   if (this.remarksOpen === false) {
    //     if (
    //       this.gstInValue === true ||
    //       this.docValue === true ||
    //       this.billingAdress === true
    //     ) {
    //       this.toastr.warning('Gst Number or Document Not Filed Pls check');
    //       return;
    //     }
    //   }
    // }

    Swal.fire({
      title: 'Are you sure?',
      text: 'That you have carefully filled in all the customer details? That’s why you are approving it?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const customersToApprove = this.selectedCustomers.map((customer) => ({
          ...customer,
          parentId: this.parentId,
          status: 'Approve',
        }));
        this.salesService
          .approveCustomers(customersToApprove, this.parentId!)
          .subscribe((res: any) => {
            if (res) {
              this.toastr.success('Customers approved successfully!');
              this.getAllCustomerList('Pending');
              this.selectedCustomers = [];
              this.router.navigate([
                '/master/sales/customer-list/customer-list',
              ]);
            } else {
              this.toastr.error('Failed to approve customers.');
            }
          });
      }
    });
  }
  onBypassChange(event: any) {
    if (event.checked) {
      console.log('Bypass is enabled');
      this.remarksOpen = true;
    } else {
      this.remarksOpen = false;

      console.log('Bypass is disabled');
    }
  }

  getAllCustomerApproval() {
    this.service.getAllCustomerApproval().subscribe((res: any) => {
      this.rowData = res.data;
      const item = this.rowData.find((d: any) =>
        d.employee_ids.includes(this.loginUser?.employee_id)
      );

      // Log item to the console before returning
      console.log(item, 'itemitemitem',this.loginUser);
      this.approvalData = item;
      // Return approval_option if found, else null
      return item ? item.approval_option : null;
    });
  }

  // profile api
  getCustomerProfileById(id: any) {
    let data = {
      status: this.parentStatus,
    };
    this.salesService
      .getCustomerProfileById(id, data)
      .subscribe((response: any) => {
        this.profileData = response.data;

        if (response.data && response.data?.gst_in == null) {
          this.gstInValue = true;
        }
        console.log(this.gstInValue, 'this.gstInValue<<<<');
      });
  }

  getCustomerDocumentsById(id: any) {
    this.salesService.getCustomerDocumentsById(id).subscribe((resp: any) => {
      resp.data.forEach((doc: any) => {});
      if (resp.data.length == 0) {
        this.docValue = true;
      }
      console.log(this.docValue, 'this.gstInValue<<<<<<<<<2');
    });
  }

  getCustomerAddressInfoById(id: any) {
    this.salesService.getCustomerAddressInfoById(id).subscribe((resp: any) => {
      console.log(resp, 'resssssss');

      let data = {
        billing_address: resp?.data?.customerAddress?.billing_address,
        billing_country_id: resp?.data?.customerAddress?.billing_country_id,
        billing_state_id: resp?.data?.customerAddress?.billing_state_id,
        billing_city_id: resp?.data?.customerAddress?.billing_city_id,
        billing_pin_code: resp?.data?.customerAddress?.billing_pin_code,
      };

      const hasNullValue = Object.values(data).some((value) => value === null);

      console.log(hasNullValue, 'hasNullValue<<<<<<<<');
      this.billingAdress = hasNullValue;
    });
  }
}
