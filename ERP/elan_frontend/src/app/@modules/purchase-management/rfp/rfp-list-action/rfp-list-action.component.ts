import { AfterViewInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ModuleAction } from 'src/app/@shared/interface/core.interface';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ExtendRfpDateDialogComponent } from '../../dialog/extend-rfp-date-dialog/extend-rfp-date-dialog.component';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rfp-list-action',
  templateUrl: './rfp-list-action.component.html',
  styleUrls: ['./rfp-list-action.component.scss']
})
export class RfpListActionComponent implements AfterViewInit {
  public cellValue: any;
  assignAction!: ModuleAction;
  idPr: any;
  paramsData: any;
  serviceType: string;
  getdataCopy: any;
  approvedCondi: boolean = false;
  tab: string;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private _rbackService: RbacMasterService,
    private route: ActivatedRoute,
    private prService: PurchaseRequestService,
    private toast: ToastrService,
  ) {
    this.route.queryParams.subscribe((params: any) => {
      this.tab = params['tab'];
    })
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.assignAction = this._rbackService.accessAssignAction();
      console.log(this.assignAction);
    }, 200);
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.idPr = params?.data?.id;
    this.paramsData = params?.data;
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  onCellClicked(e: any) {
    e.stopPropagation();
    let flag = 0;
    if (this.cellValue.final_status == 'APPROVED' || this.cellValue.final_status == 'REJECTED') {
      flag = 1;
    }
    this.router.navigate(['master/purchase-management/purchase-request/create-pr'], { queryParams: { id: this.idPr, type: 'View', status: this.cellValue?.pr_category, flag: flag } })
  }

  edit(e: any) {
    e.stopPropagation();
    this.router.navigate(['master/purchase-management/purchase-request/create-pr'], { queryParams: { id: this.idPr, type: 'Edit', status: this.cellValue?.pr_category } })
  }

  createRfp(e: any) {
    e.stopPropagation();
    this.router.navigate(['master/purchase-management/rfp/send-rfp'], { queryParams: { pr_id: this.paramsData.id, pr_category: this.paramsData.pr_category } })
  }

  navigateToQuotation(e: Event) {
    e.stopPropagation();
    this.router.navigate(['master/purchase-management/rfp/quotation-details'], {
      queryParams: {
        pr_id: this.idPr,
        pr_category: this.paramsData?.pr_category,
        type: this.tab === 'close-rfp' ? 'Approval' : 'View',
        rfp_number: this.paramsData?.rfp_number,
      }
    })
  }

  extendDate(e: Event) {
    e.stopPropagation();
    this.prService.procurementProductId.next(this.idPr)
    const dialogRef = this.dialog.open(ExtendRfpDateDialogComponent, { width: '450px', data: { cellData: this.paramsData } });
    dialogRef.afterClosed().subscribe(result => {
      this.reloadCurrentRoute();
    })
  }

  stopRfp(e: any) {
    e.stopPropagation()
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to stop this RFP',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        const stopDate = moment(new Date()).format("DD-MM-YYYY");
        const data = {
          rfp_status: "CLOSE RFP",
          nego_status: "LIVE NEGO",
          stop_rfp_date: stopDate,
          rfp_number: this.paramsData?.rfp_number,
        }
        this.prService.updateRfpStopDate(this.idPr, data).subscribe((res: any) => {
          this.toast.success("Rfp is Successfully Stopped!")
          this.router.navigate(['master/purchase-management/rfp'], { queryParams: { tab: 'close-rfp' } })
        },
          ((err: any) => {
            this.toast.error(err.error.message || "Something Went To Wrong");
          })
        )
      }
    })


  }

  deleteRfp() {
    let data = {
      status: "INACTIVE"
    }
    this.prService.deleteLiveRfp(this.idPr, data).subscribe((res: any) => {
      if (res && res.code == 200) {
        this.toast.success('RFP deleted successfully.');
        this.reloadCurrentRoute();
      }
    }, err => {
      this.toast.error(err.error.message || "Something Went To Wrong");
    })
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl);
    });
  }
}
