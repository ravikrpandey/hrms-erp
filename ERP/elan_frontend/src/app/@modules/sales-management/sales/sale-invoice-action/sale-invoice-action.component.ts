import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import Swal from 'sweetalert2';
import { SalesManagementService } from '../../sales-management-service/sales-management.service';

@Component({
  selector: 'app-sale-invoice-action',
  templateUrl: './sale-invoice-action.component.html',
  styleUrls: ['./sale-invoice-action.component.scss']
})
export class SaleInvoiceActionComponent {
    quotation_doc_id: any;
    assignAction: any;
    status: any;
  delivery_created: any;
  deliveryQty: any;
  quantity: any;

    constructor(
      private salesManagementService: SalesManagementService,
      private route: Router,
      private _rbackService: RbacMasterService,
      private recruitService: RecruitService,
      private toast: ToastrService,
      private _empMasterService: EmpMasterService,
      public dialog: MatDialog
    ) {}
    ngOnInit(): void {

    }
    public cellValue: any;

    agInit(params: ICellRendererParams): void {
      this.status = params.data.status
      this.delivery_created = params.data.delivery_created
      this.deliveryQty = params.data.deliveryQty;
      this.quantity = params.data.quantity;
      this.cellValue = this.getValueToDisplay(params);
    }
    getValueToDisplay(params: ICellRendererParams) {
      // Quotation

      if (params.data.proforma_doc_code) {
        this.quotation_doc_id = params.data.proforma_doc_code;
        this.assignAction = this._rbackService.accessAssignAction();
        return params.data.id;
      }
    }

    refresh(params: ICellRendererParams): boolean {
      // set value into cell again

      this.cellValue = this.getValueToDisplay(params);
      return true;
    }
    navigateToCreateDel() {
      this.route.navigate(['master/sales-management/delivery-order/create-delivery-order'], {
        queryParams: { sales_id: this.cellValue },
      });
    }

    view(e: any) {

      e.stopPropagation();
      this.route.navigate(['/master/sales-management/sales/create-sales-invoice'], {
        queryParams: { id: this.cellValue ,view:'view'},
      });
    }
    edit(e: any) {
      e.stopPropagation();
      this.route.navigate(['/master/sales-management/create-quotation'], {
        queryParams: { id: this.cellValue ,edit:'edit'},
      });
    }

    deleteQuotation() {
      Swal.fire({
        title: 'Are you sure want to remove it?',

        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#5d6c7c',
        confirmButtonColor: '#f44336',
        confirmButtonText: 'Delete!',
        cancelButtonText: 'Skip',
      }).then((result) => {
        if (result.value) {
          this.salesManagementService
            .deleteQuotation(this.cellValue)
            .subscribe((res) => {
              window.location.reload();
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    }
  }
