import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { ModuleAction } from 'src/app/@shared/interface/core.interface';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { CryptoService } from 'src/app/@shared/services/crypto/crypto.service';
import { SalesTargetService } from 'src/app/@shared/services/sales-target.service';

@Component({
  selector: 'app-target-achievement',
  templateUrl: './target-achievement.component.html',
  styleUrls: ['./target-achievement.component.scss']
})
export class TargetAchievementComponent {

  selectedIndex = 0;
  assignAction: ModuleAction;
  private gridApi!: GridApi<any>;
  actions: any[] = [];
  isReportingManager: boolean = true;
  entity_id: any;
  financial_year_id: any;
  user_role_id: any;
  user_role_code: any;
  public rowData: any[] = [];

  constructor(
    private router: Router, private cryptoService: CryptoService, private STService: SalesTargetService,
    private accessCtrl: AccessControlService,
    private _rbackService: RbacMasterService,
  ) {}

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    this.entity_id= this.accessCtrl.getEntityId();
    this.financial_year_id= this.accessCtrl.getFinancialId();
    this.user_role_id= this.accessCtrl.getRoleId();
    this.user_role_code= this.accessCtrl.getRoleCode();
    this.getData();
  }

  getData() {
    this.STService.getAchievementList(this.entity_id).subscribe((res: any) => {
      if (res && res.data) {
        this.rowData = res.data;
      }
    }, (err: any) => {
      this.rowData = []
    })
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter((document.getElementById('filter-text-box') as HTMLInputElement).value);
  }

  public columnDefs = [
    {
      headerName: 'S. No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: .6
    },
    {
      headerName: 'Target Name',
      field: 'target_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1.2
    },
    {
      headerName: 'Period',
      field: 'period',
      sortable: true,
      resizable: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1.4
    },
    {
      headerName: 'Target Amount (₹)',
      field: 'target_amount',
      sortable: true,
      resizable: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      valueFormatter: (params: any) => {
        if (!params.value) return '₹ 0';
        return `₹ ${Number(params.value).toLocaleString('en-IN')}`;
      }
    },
    {
      headerName: 'Achievement Amount (₹)',
      field: 'achievement_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      valueFormatter: (params: any) => {
        if (!params.value) return '₹ 0';
        return `₹ ${Number(params.value).toLocaleString('en-IN')}`;
      }
    },
    {
      headerName: 'Achievement (%)',
      field: 'achievement_per',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      valueFormatter: (params: any) => {
        const value = Number(params.value || 0);

        return Number.isInteger(value)
          ? `${value}%`
          : `${value.toFixed(2)}%`;
      }
    },
    {
      headerName: 'Created Date',
      field: 'createdAt',
      sortable: true,
      resizable: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: .8,
      valueFormatter: (params: any) => {
        return new Date(params.value).toLocaleDateString('en-GB');
      },
    },
    {
      headerName: 'Reporting Manager',
      field: 'reporting_manager_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1.2
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: .7,
      cellRenderer: (params: any) => {

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '8px';
        container.style.height = '100%';
        const viewBtn = document.createElement('button');
        viewBtn.innerHTML = 'View';
        viewBtn.classList.add('btn', 'btn-sm', 'btn-primary');
        viewBtn.addEventListener('click', () => {
          this.router.navigate(
            ['master/sales-target-achievement/achievement-details'],
            {
              queryParams: {
                id: this.cryptoService.encrypt(params.data.id),
                mode: this.cryptoService.encrypt('view')
              }
            }
          );
        });
        container.appendChild(viewBtn);
        return container;
      }
    }
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}