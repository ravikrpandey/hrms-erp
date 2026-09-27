import { Component } from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { MatDialog } from '@angular/material/dialog';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { RfqDetailsComponent } from './rfq-details/rfq-details.component';

@Component({
  selector: 'app-rfq-request',
  templateUrl: './rfq-request.component.html',
  styleUrls: ['./rfq-request.component.scss']
})
export class RfqRequestComponent {

  selectedTab: string = 'ALL';
  private gridApi!: GridApi<any>;
  entity_id: any;
  financial_year_id: any;
  public rowData: any = [];
  
  constructor(
    private transport_service : TransportManagementService,
    private accessData: AccessControlService,
    private dialog: MatDialog
  ) {
    
  }

  ngOnInit(): void {
    this.entity_id = this.accessData.getEntityId(); 
    this.financial_year_id = this.accessData.getFinancialId();
    this.filterGridData('ALL');
  }

  public columnDefs = [
    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      cellClass: 'grid-cell-centered',
      flex: .4
    },
    {
      headerName: 'Vehicle Planning Code',
      field: 'planning_code',
      cellClass: 'grid-cell-centered',
      flex: .9
    },
    {
      headerName: 'Transporter Name',
      field: 'tm_name',
      cellClass: 'grid-cell-centered',
      flex: 1,
      tooltipField: 'tm_name',
    },
    {
      headerName: 'Route Type',
      field: 'vehicle_root_status',
      cellClass: 'grid-cell-centered',
      flex: .6
    },
    {
      headerName: 'Vehicle Type',
      field: 'vehicle_type_name',
      cellClass: 'grid-cell-centered',
      flex: .8
    },
    {
      headerName: 'Transport Type',
      field: 'typeName',
      cellClass: 'grid-cell-centered',
      flex: .8
    },
    {
      headerName: 'Transporter Status',
      field: 'transporter_status',
      cellClass: 'grid-cell-centered',
      flex: .8
    },
    {
      headerName: 'Approval Status',
      field: 'admin_status',
      cellClass: 'grid-cell-centered',
      flex: .7
    },
    {
      headerName: 'View',
      field: 'id',
      flex: .5,
      cellRenderer: (params: any) => {
        let viewIcon = `
          <i class="material-icons view" title="View" style="color: #00644d !important;cursor:pointer">
            visibility
          </i>
        `;

        let approveIcon = '';
        if (this.selectedTab === 'PENDING') {
          approveIcon = `
            <i class="material-icons approve"
              title="Approve RFQ"
              style="cursor:pointer; color:#1976d2; margin-left:10px">
              mail
            </i>
          `;
        }

        return `
          <span class="action-icons">
            ${viewIcon}
            ${approveIcon}
          </span>
        `;
      },
      onCellClicked: (params: any) => {
        const target = params.event.target;

        if (target.classList.contains('view')) {
          this.OnClick(params.data.id, params.data.pt_id);
        }

        if (target.classList.contains('approve')) {
          const approveUrl = `transporter-request-link?planning=${params.data.id}&transporter=${params.data.pt_id}`;
          window.open(approveUrl, '_blank');
        }
      }
    }
  ];
    
  OnClick(id:any, pt_id: any){
    this.dialog.open(RfqDetailsComponent, {
      width: '100vw',
      maxWidth: '100vw',
      height: '100vh',
      panelClass: 'full-screen-dialog',
      data: {
        id: id,
        pt_id: pt_id
      }
    });
  }
  
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  filterGridData(tab: string) {
    this.selectedTab = tab;
    this.rowData = [];
    this.transport_service.getAllRFQList(this.entity_id,tab).subscribe({
      next: (res: any) => {
        this.rowData = res?.data;
      },
      error: (err: any) => {
        this.rowData = [];
      }
    });
  }

}