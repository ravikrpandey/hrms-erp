import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { InventoryManagementService } from '../../inventory-management.service';


@Component({
  selector: 'app-add-action',
  templateUrl: './add-action.component.html',
  styleUrls: ['./add-action.component.scss']
})
export class AddActionComponent {
  private onActionCallback: Function | undefined;
  assignAction: any;
  singleData: any = {};
  constructor(private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private employService: EmpRegistrationService,
    private toster: ToastrService,
    private _rbackService: RbacMasterService,
    private inventoryService: InventoryManagementService
  ) {
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService?.accessAssignAction();
  }
  public cellValue: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  params: any;
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.singleData = params.data;
    this.params = params;
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data;
  }

   
  view(e: any) {
    e.stopPropagation();
    this.router.navigate(['/master/warehouse-management/create-stock-transfer'], {
      queryParams: { id: this.singleData?.id, actionType: 'view' },
    });
  }

  edit(e: any) {
    e.stopPropagation();
    this.router.navigate(['/master/warehouse-management/create-stock-transfer'], {
      queryParams: { id: this.singleData?.id, actionType: 'edit' },
    });
  }

  updateStatus(status: string, e: any) {
    e.stopPropagation();
    const payload = {
      status: status,
      employee_id: localStorage.getItem("EmpMainId"),
      financial_year_id: localStorage.getItem("financial_id")
    };
    this.inventoryService.updateStockTransferStatus(this.singleData.id, payload).subscribe({
      next: (res: any) => {
        this.toster.success(res.message);
        this.reloadCurrentRoute();
      },
      error: (err: any) => {
        this.toster.error(err?.error?.message || 'Failed to update status');
      }
    });
  }
}

