import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { TransportRequestActionComponent } from '../transport-request/transport-request-action/transport-request-action.component';

@Component({
  selector: 'app-all-trip',
  templateUrl: './all-trip.component.html',
  styleUrls: ['./all-trip.component.scss']
})
export class AllTripComponent {

   rowClass: any = 'rowClass';
    private gridApi!: GridApi<any>;

    allData: any[] = []; // Full data
    rowData: any[] = []; // Filtered data for grid

    selectedTab: string = 'my';

    assignAction: any;
    entity_id: string | null;
    financial_year_id: string | null;
    loginUser: any;

    public gridOptions: any = { rowSelection: 'multiple', rowHeight: 55 };

    constructor(
      private route: Router,
      private _rbackService: RbacMasterService,
      private toaster: ToastrService,
      private transport_service: TransportManagementService
    ) {}
 currentUrl: string = '';
    ngOnInit(): void {
      this.assignAction = this._rbackService.accessAssignAction();
      this.entity_id = localStorage.getItem('selectedEntityId');
      this.financial_year_id = localStorage.getItem('financial_id');
      this.loginUser = JSON.parse(localStorage.getItem('signInUser') || '{}');
    this.currentUrl = this.route.url;

    // Optional: listen to route changes
    this.route.events.subscribe(() => {
      this.currentUrl = this.route.url;
    });
      this.getAllRequests();
    }

    getAllRequests() {
      this.transport_service.getAll_vehicleMaster(
        this.entity_id,
      ).subscribe((res: any) => {
        if (res?.data) {
          this.allData = res.data;
          this.filterGridData(this.selectedTab); // Initially "My Request"
        }
      }, () => {
        this.toaster.error('Error fetching transport data');
      });
    }

    filterGridData(tab: string) {
      this.selectedTab = tab;

      // switch (tab) {
      //   case 'my':
      //     this.rowData = this.allData.filter(x => x.status === 'Approved Trip');
      //     break;
      //   case 'app':
      //     this.rowData = this.allData.filter(x => x.status === 'Schedule Trip');
      //     break;
      //   case 'approved':
      //     this.rowData = this.allData.filter(x => x.status === 'Live Trip');
      //     break;
      //   case 'rejected':
      //     this.rowData = this.allData.filter(x => x.status === 'Closed Trip');
      //     break;
      //   default:
      //     this.rowData = [];
      // }

      if (this.gridApi) {
        this.gridApi.paginationGoToFirstPage();
      }
    }


    onGridReady(params: GridReadyEvent) {
      this.gridApi = params.api;
    }

    onPageSizeChanged() {
      var value = (document.getElementById('page-size') as HTMLInputElement).value;
      this.gridApi.paginationSetPageSize(Number(value));
    }

    onFilterTextBoxChanged() {
      this.gridApi.setQuickFilter((document.getElementById('filter-text-box') as HTMLInputElement).value);
    }

    // openDialog() {
    //   this.route.navigate(['/master/transport-management/transport-request/add-new-request']);
    // }

  isLiveTripActive(): boolean {
    return this.currentUrl.includes('live-trip-list') || this.currentUrl.includes('live-trip-info');
  }

}
