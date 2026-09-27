import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ModuleAction } from 'src/app/@shared/interface/core.interface';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';
import { GrnServiceService } from '../../../purchase-management/services/grn-service.service' ;

@Component({
  selector: 'app-grn-cost-mapping-action',
  templateUrl: './grn-cost-mapping-action.component.html',
  styleUrls: ['./grn-cost-mapping-action.component.scss']
})
export class GrnCostMappingActionComponent  implements OnInit, AfterViewInit {
  assignAction: ModuleAction;
  public cellValue: any;

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _rbackService: RbacMasterService,
    private grnService: GrnServiceService,
    private toast: ToastrService,
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.assignAction = this._rbackService.accessAssignAction();
    }, 0);
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = params.data;
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }


  navigateToPaymentCheck(e: any) {
    e.stopPropagation();
    this.router.navigate(
      ['/master/purchase-management/invoice/po-details-invoice'],
      {
        queryParams: {
          po_id: this.cellValue.po_Id,
          status: this.cellValue.status,
          version_id: this.cellValue.version_id,
          rejectGRN: this.cellValue.discardStatus,
          RejectStatus: 'RejectView',
          navigateFrom:'Grn-cost-mapping'
        },
      }
    );
  }

  navigateToPaymentView(e: any) {
    e.stopPropagation();
    this.router.navigate(
      ['/master/purchase-management/invoice/po-details-invoice'],
      {
        queryParams: {
          po_id: this.cellValue.po_Id,
          status: this.cellValue.status,
          version_id: this.cellValue.version_id,
          rejectGRN: this.cellValue.discardStatus,
          actionType: 'View',
          invoiceNo: this.cellValue.invoiceNo,
        },
      }
    );
  }




  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigateByUrl(currentUrl);
    });
  }
}
