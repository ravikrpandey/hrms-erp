import { AfterViewInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ModuleAction } from 'src/app/@shared/interface/core.interface';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { NegotiationDialogComponent } from '../../dialog/negotiation-dialog/negotiation-dialog.component';

@Component({
  selector: 'app-negotiation-action',
  templateUrl: './negotiation-action.component.html',
  styleUrls: ['./negotiation-action.component.scss']
})
export class NegotiationActionComponent implements AfterViewInit {
  assignAction: ModuleAction;
  prId: any;
  tab: string = '';

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _rbackService: RbacMasterService,
    private prService: PurchaseRequestService,
    private _activatedRoute: ActivatedRoute,
  ) {
    this._activatedRoute.queryParams.subscribe((params: any) => {
      this.tab = params['tab'];
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.assignAction = this._rbackService.accessAssignAction();
    }, 0);
  }

  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.cellValue = params
    this.prId = params.data?.purchase_request_id;
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  startNegotiate(e: any) {
    e.stopPropagation();
    this.router.navigate(['master/purchase-management/negotiation/create-negotiation'], {
      queryParams: {
        pr_id: this.cellValue.data.purchase_request_id,
        prType: this.cellValue.data.pr_category,
        rfp_number: this.cellValue.data.rfp_number,
      }
    })
  }

  navigateToQuotation() {
    this.router.navigate(['master/purchase-management/negotiation/create-negotiation-quotation'], {
      queryParams: {
        pr_id: this.cellValue.data.purchase_request_id,
        prType: this.cellValue.data.pr_category,
        actionType: this.cellValue?.data?.nego_status_pvn === 'CLOSE NEGO' ? 'close' : 'view',
        rfp_number: this.cellValue.data.rfp_number,
        negotiation_code: this.cellValue.data.negotiation_code,
      }
    })
  }

  extendDate(e: any) {
    e.stopPropagation();
    this.prService.procurementProductId.next(this.cellValue.data?.purchase_request_id)
    const dialogRef = this.dialog.open(NegotiationDialogComponent, {
      width: '450px',
      data: { cellData: this.cellValue }
    });
    dialogRef.afterClosed().subscribe(result => {

    })
  }

  stopNegotiate(e: any) {
    e.stopPropagation()
    const dialogRef = this.dialog.open(NegotiationDialogComponent, {
      width: '450px',
      data: { prId: this.prId, status: "stop_RFP" }
    });
    dialogRef.afterClosed().subscribe(result => {

    })
  }
}
