import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { ModuleAction } from 'src/app/@shared/interface/core.interface';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CryptoService } from 'src/app/@shared/services/crypto/crypto.service';
import { SalesTargetService } from 'src/app/@shared/services/sales-target.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sales-target',
  templateUrl: './sales-target.component.html',
  styleUrls: ['./sales-target.component.scss']
})
export class SalesTargetComponent {

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
    private router: Router, private cryptoService: CryptoService,
    private route: ActivatedRoute, private STService: SalesTargetService,
    private accessCtrl: AccessControlService,
    private _rbackService: RbacMasterService,
  ) {}

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    this.entity_id= this.accessCtrl.getEntityId();
    this.financial_year_id= this.accessCtrl.getFinancialId();
    this.user_role_id= this.accessCtrl.getRoleId();
    this.user_role_code= this.accessCtrl.getRoleCode();

    // user_id: this.accessCtrl.getEmployeeId();
    // user_role_name: this.accessCtrl.getRoleName();

    this.route.queryParams.subscribe((params) => {
      let tab = Number(this.cryptoService.decrypt(params['tab']));
      this.selectedIndex = tab ? tab : 0;
      this.getData(this.selectedIndex);
    });
  }

  getData(tab: any) {
    let statusType = tab == 0 ? 'APPROVED' : 'PENDING';
    this.STService.getTargetList(this.entity_id,statusType).subscribe((res: any) => {
      if (res && res.data) {
        this.rowData = res.data;
        this.isReportingManager = this.user_role_code === 'Super Admin' ? true : res?.is_reporting_manager;
        this.setActions();
      }
    }, (err: any) => {
      this.rowData = []
    })
  }

  setActions() {
    this.actions =
      this.assignAction?.Write && this.isReportingManager
        ? [
            {
              label: 'Create Sales Target',
              icon: 'add',
              callback: this.create.bind(this),
            },
          ]
        : [];
  }

  onTabChange(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
    this.getData(event.index);
  }

  create() {
    this.router.navigate(['master/sales-target-achievement/create-target'])
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
      wrapHeaderText: true,
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
      headerName: 'Employees',
      field: 'employee_count',
      sortable: true,
      resizable: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: .9
    },
    {
      headerName: 'Created Date',
      field: 'createdAt',
      sortable: true,
      resizable: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
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
      headerName: 'Actions',
      field: 'id',
      flex: 1.2,
      cellRenderer: (params: any) => {

        const container = document.createElement('div');
        // All Targets
        if (this.selectedIndex == 0 && this.isReportingManager) {
          container.style.display = 'flex';
          container.style.alignItems = 'center';
          container.style.gap = '8px';
          container.style.height = '100%';
          const viewBtn = document.createElement('button');
          viewBtn.innerHTML = 'View';
          viewBtn.classList.add('btn', 'btn-sm', 'btn-primary');
          viewBtn.addEventListener('click', () => {
            this.router.navigate(
              ['master/sales-target-achievement/create-target'],
              {
                queryParams: {
                  id: this.cryptoService.encrypt(params.data.id),
                  mode: this.cryptoService.encrypt('view')
                }
              }
            );
          });
          container.appendChild(viewBtn);
        }

        // PENDING TAB ONLY
        if (this.selectedIndex == 1 && this.assignAction.Write) {
          const editBtn = document.createElement('button');
          editBtn.style.marginRight = '8px';
          editBtn.innerHTML = 'Edit';
          editBtn.classList.add('btn', 'btn-sm', 'btn-primary');
          editBtn.addEventListener('click', () => {
            this.router.navigate(
              ['master/sales-target-achievement/create-target'],
              {
                queryParams: {
                  id: this.cryptoService.encrypt(params.data.id),
                  mode: this.cryptoService.encrypt('edit')
                }
              }
            );
          });

          container.appendChild(editBtn);

          // APPROVE BUTTON
          if (this.user_role_code === 'Super Admin') {

            const approveBtn = document.createElement('button');
            approveBtn.innerHTML = 'Approve';
            approveBtn.classList.add('btn', 'btn-sm', 'btn-success');
            approveBtn.addEventListener('click', () => {

              Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to approve this target?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Approve',
                cancelButtonText: 'Cancel',
                allowOutsideClick: false,
                allowEscapeKey: false,

                preConfirm: () => {
                  // loader show hoga
                  Swal.showLoading();

                  return this.STService.targetStatusChange({
                    id: params.data.id,
                    status: 'APPROVED'
                  }).toPromise()
                  .then((res: any) => {
                    return res;
                  })
                  .catch((err: any) => {
                    Swal.showValidationMessage(
                      err?.error?.message || 'Something went wrong'
                    );
                  });
                }
              }).then((result) => {

                if (result.isConfirmed) {
                  Swal.fire(
                    'Approved!',
                    'Sales target approved successfully.',
                    'success'
                  );
                  // refresh grid
                  this.getData(this.selectedIndex);
                }
              });
            });
            container.appendChild(approveBtn);
          }
        }
        return container;
      }
    }
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}