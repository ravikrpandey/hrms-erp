import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ModuleAction } from 'src/app/@shared/interface/core.interface';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';
import { GrnServiceService } from '../../services/grn-service.service';

@Component({
  selector: 'app-grn-action',
  templateUrl: './grn-action.component.html',
  styleUrls: ['./grn-action.component.scss'],
})
export class GrnActionComponent implements OnInit, AfterViewInit {
  assignAction: ModuleAction;
  environment: any;
  public cellValue: any;
  tab: any;

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _rbackService: RbacMasterService,
    private _grnService: GrnServiceService,
    private toast: ToastrService,
    private _activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.environment = environment.servralUrl;
    this._activatedRoute.queryParams.subscribe((params) => {
      this.tab = params['tab'];
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.assignAction = this._rbackService.accessAssignAction();
    }, 0);
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = params.data;
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  navigateToPaymentCheck(e: any) {
    e.stopPropagation();
    this.router.navigate(['/master/purchase-management/grn/create-grn'], {
      queryParams: {
        po_id: this.cellValue.id,
        ship_id: this.cellValue.shipment_id,
        status: this.tab,
        version_id: this.cellValue.version_id,
        rejectGRN: this.cellValue.discardStatus,
        RejectStatus: 'RejectView',
      },
    });
  }

  addNewGRNForReject() {
    this.router.navigate(['/master/purchase-management/grn/create-grn'], {
      queryParams: {
        po_id: this.cellValue.id,
        ship_id: this.cellValue.shipment_id,
        status: 'partial-list',
        version_id: this.cellValue.version_id,
        rejectGRN: this.cellValue.discardStatus,
        RejectStatus: 'RejectAdd',
      },
    });
  }

  navigetToView() {
    this.router.navigate(['/master/purchase-management/grn/create-grn'], {
      queryParams: {
        po_id: this.cellValue.po_Id,
        ship_id: this.cellValue.shipment_id,
        grn_id: this.cellValue?.id,
      },
    });
  }

  rejectFile() {
    Swal.fire({
      title: 'Do You Want to Close this PO?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#f44336',
      confirmButtonColor: '#3f51b5',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this._grnService
          .rejectedGRN(this.cellValue.grn_id)
          .subscribe((res: any) => {
            if (res.code == 200) {
              this.toast.success('Approved PR Successfully');
              this.reloadCurrentRoute();
            }
          });
      }
    });
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  downloadPDF(e: Event) {
    this._grnService
      .downloadPurchaseGRNById(this.cellValue.id, this.cellValue.version_id)
      .subscribe(
        (res: any) => {
          const blob = new Blob([res], { type: 'application/pdf' });
          const link = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          link.href = url;
          link.download = `GRN_${this.cellValue.grn_number}_PO_${this.cellValue.po_number}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        (err: any) => {
          console.log(err);
          if (err.status == 400) {
          }
        },
      );
  }
}
