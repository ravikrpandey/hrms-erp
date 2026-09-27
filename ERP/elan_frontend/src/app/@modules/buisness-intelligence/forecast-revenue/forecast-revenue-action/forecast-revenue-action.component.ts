import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { BuisnessIntelligenceService } from 'src/app/@shared/services/buisness-intelligence.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { CommonService } from 'src/app/@shared/services/common.service';
// import { DialogJobComponent } from '../dialog-job/dialog-job.component';

@Component({
  selector: 'app-forecast-revenue-action',
  templateUrl: './forecast-revenue-action.component.html',
  styleUrls: ['./forecast-revenue-action.component.scss']
})
export class ForecastRevenueActionComponent {
  paramsVal: any;
  id: any;
  fid:any;
  params: any;
  assignAction:any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private buisnessIntelligenceService: BuisnessIntelligenceService,
    private toaster: ToastrService,
    private _rbackService: RbacMasterService,
    private _commonService : CommonService
  ) {
    // this.data = localStorage.getItem("jobId");
    // 
  }
  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();

  }
  public cellValue: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
    
    this.params = params;
    this.paramsVal = params.data.id;
    this.cellValue = this.getValueToDisplay(params);
    this.id=params.data.id
    this.fid=params.data.fid
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted
      ? params.valueFormatted
      : params.data.id;
  }

  edit(e:any){
    this.router.navigate(['/master/business-intelligence/revenue-forecasting/create'], { queryParams: { fid: this.fid, id: this.id }})
  }
  view(e:any){
    this.router.navigate(['/master/business-intelligence/revenue-forecasting/create'], { queryParams: { fid: this.fid, id : this.id, mode: "view" }})
  }

  delete(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: 'Are you sure you want to Remove it?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result:any) => {
      if (result.isConfirmed) {
        this._commonService?.showLoader()
        this.buisnessIntelligenceService.deleteForecastRevenue(this.id).subscribe(
          (res:any) => { 
            this._commonService?.hideLoader()
            this.toaster.success('Deleted successfully ');
            this.params.onActionPerform({ name: 'successfully deleted' });
          },
          (err:any) => {
            this._commonService?.hideLoader()
            this.toaster.error("Somthing went wrong Please try agin", "Error Message")
          }
        )
      }
    });
  } 
}
