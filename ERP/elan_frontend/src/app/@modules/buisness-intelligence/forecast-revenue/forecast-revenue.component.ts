import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { environment } from 'src/app/environments/environment';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-forecast-revenue',
  templateUrl: './forecast-revenue.component.html',
  styleUrls: ['./forecast-revenue.component.scss']
})
export class ForecastRevenueComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  assignAction: any;
  entity_id:any;
  filter_fy:any;
  constructor(
    private finance: FinaceService,
    private _rbackService: RbacMasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private prService: PurchaseRequestService

  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.assignAction = this._rbackService.accessAssignAction();
    this.getAllFinancialYear();

    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
    });
  }

  getAllFinancialYear() {
    this.finance.getFinancialYearActive().subscribe((res: any) => {
      this.rowData = res.data;
      // let date = new Date();
      // this.rowData.map((yr:any) => {
      //   const startDate = new Date(yr.start_date);
      //   const endDate = new Date(yr.end_date);
      //   if ( ( date.getTime() - startDate.getTime() >= 0 ) && ( endDate.getTime() - date.getTime() >= 0 )  ) {
      //     yr.valid = true;
      //   }
      //   else {
      //     yr.valid = false;
      //   }
      //   return yr;
      // })
      // this.rowData = [1,2,3,4]
    })
  }

  redirect(yr:any){
      this.route.navigate(['master/business-intelligence/revenue-forecasting/list'], { queryParams: { fid: yr.id }})
  }
  
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
}


