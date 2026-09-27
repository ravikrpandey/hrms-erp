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
  selector: 'app-depreciation-forecast',
  templateUrl: './depreciation-forecast.component.html',
  styleUrls: ['./depreciation-forecast.component.scss']
})
export class DepreciationForecastComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  assignAction: any;
  entity_id:any;
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
    this.finance.getFinancialYear().subscribe((res: any) => {
      this.rowData = res.data;
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


