import { Component, Input } from '@angular/core';
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
  selector: 'app-quotation-action',
  templateUrl: './quotation-action.component.html',
  styleUrls: ['./quotation-action.component.scss'],
})
export class QuotationActionComponent {
  hideEditIcon: boolean = false;
  hideDeleteIcon: boolean = false;

  quotation_doc_id: any;
  assignAction: any;
  proformaId: any = 9;
  status: any;
  proforma_created: any;
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
  // public cellValue2: any;

  agInit(params: ICellRendererParams): void {
    this.status = params.data.status;
    this.proforma_created = params.data.proforma_created;
    this.cellValue = this.getValueToDisplay(params);
    // this.cellValue2 = this.getValueToDisplay2(params);
    this.hideEditIcon = (params as any).hideEditIcon ?? false;
    this.hideDeleteIcon = (params as any).hideDeleteIcon ?? false;
  }
  getValueToDisplay(params: ICellRendererParams) {
    if (params.data.quotation_doc_code) {
      this.quotation_doc_id = params.data.quotation_doc_code;
      this.assignAction = this._rbackService.accessAssignAction();
      return params.data.id;
    }
  }
  // getValueToDisplay2(params: ICellRendererParams) {
  //   if (params.data.quotation_doc_code) {
  //     this.quotation_doc_id = params.data.quotation_doc_code;
  //     this.assignAction = this._rbackService.accessAssignAction();
  //     return params.data.id;
  //   }
  // }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  navigateToCreateProformas() {
    this.route.navigate(['master/sales-management/proforma/create-proformas'], {
      queryParams: { quotation_id: this.cellValue },
    });
  }

  view(e: any) {
    e.stopPropagation();
    this.route.navigate(['/master/sales-management/create-quotation'], {
      queryParams: { id: this.cellValue, view: 'view' },
    });
  }
  edit(e: any) {
    e.stopPropagation();
    this.route.navigate(['/master/sales-management/create-quotation'], {
      queryParams: { id: this.cellValue, edit: 'edit' },
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
