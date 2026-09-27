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
  selector: 'app-proforma-action',
  templateUrl: './proforma-action.component.html',
  styleUrls: ['./proforma-action.component.scss']
})
export class ProformaActionComponent {
  quotation_doc_id: any;
  assignAction: any;
  status: any;
  sales_created: any;

  constructor(
    private salesManagementService: SalesManagementService,
    private route: Router,
    private _rbackService: RbacMasterService,
    private recruitService: RecruitService,
    private toast: ToastrService,
    private _empMasterService: EmpMasterService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {}
  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.status = params.data.status
    this.sales_created = params.data.sales_created

    this.cellValue = this.getValueToDisplay(params);
  }
  getValueToDisplay(params: ICellRendererParams) {
    // Quotation

    if (params.data.quotation_doc_code) {
      this.quotation_doc_id = params.data.quotation_doc_code;
      this.assignAction = this._rbackService.accessAssignAction();
      return params.data.id;
    }
  }
  navigateToCreateSales() {
    this.route.navigate(['master/sales-management/sales/create-sales-invoice'], {
      queryParams: { proforma_id: this.cellValue },
    });
  }
  refresh(params: ICellRendererParams): boolean {
    // set value into cell again

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }


  view(e: any) {
    e.stopPropagation();
    this.route.navigate(['/master/sales-management/proforma/create-proformas'], {
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
