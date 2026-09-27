import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { environment } from 'src/app/environments/environment';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-budget-planning-center',
  templateUrl: './budget-planning.component.html',
  styleUrls: ['./budget-planning.component.scss']
})
export class BudgetPlanningComponent {
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
    private _configurationalMasterService: ConfigurationalmasterService,
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
    this.filter_fy = localStorage.getItem('financial_id');
    this.assignAction = this._rbackService.accessAssignAction();
    this.getAllFinancialYear();

    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
    });
  }

  getAllFinancialYear() {
    this.finance.getAllBudgetPlan(this.entity_id,this.filter_fy).subscribe((res: any) => {
      this.rowData = res.data;
      let date = new Date();
      this.rowData.map((yr:any) => {
        const startDate = new Date(yr.start_date);
        const endDate = new Date(yr.end_date);
        if ( ( date.getTime() - startDate.getTime() >= 0 ) && ( endDate.getTime() - date.getTime() >= 0 )  ) {
          yr.valid = true;
        }
        else {
          yr.valid = false;
        }
        return yr;
      })
    })
  }

  redirect(yr:any){
    if(yr.valid){
      this.route.navigate(['master/finance/budget-planning/budget-planning-list'], { queryParams: { id: yr.id , type: 'Opex', page:'planning'},skipLocationChange: true})
    }else {
      this.toaster.error('Today Date not in date range','Error')
    }
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
}


