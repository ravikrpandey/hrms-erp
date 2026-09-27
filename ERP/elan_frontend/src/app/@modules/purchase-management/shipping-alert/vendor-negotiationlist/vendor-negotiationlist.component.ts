import { Component } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { Router } from '@angular/router';
import { CryptoService } from 'src/app/@shared/services/crypto/crypto.service';

@Component({
  selector: 'app-vendor-negotiationlist',
  templateUrl: './vendor-negotiationlist.component.html',
  styleUrls: ['./vendor-negotiationlist.component.scss']
})
export class VendorNegotiationlistComponent {

  vendor_id: any;
  vendor_id_header: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  filteredData: any[] = [];
  public gridOptions: any = { rowSelection: 'multiple', };
  public rowData: any = [];
  
  constructor(private poService: PurchaseRequestService,
    private router: Router, private cryptoService: CryptoService
  ) { }

  ngOnInit(): void {
    const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
    this.vendor_id_header = loginData.loginID;
    this.vendor_id = this.cryptoService.decrypt(this.vendor_id_header);
    this.getListForVendor();
  }

  public columnDefs: ColDef[] = [
    {
      headerName: 'S. No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 80,
    },
    {
      headerName: 'Negotiation No.',
      field: 'negotiation_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
    },
  //  {
  //     headerName: 'Budget Type',
  //     field: 'po_type',
  //     sortable: true,
  //     resizable: true,
  //     wrapHeaderText: true,
  //     autoHeaderHeight: true,
  //     cellClass: "grid-cell-centered",
  //     flex: 1,
  //     minWidth: 120,
  //   },
    {
      headerName: 'Start Date',
      field: 'start_date_nego',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      valueFormatter: (params: any) => {

        if (!params.value) return '-';

        const date = new Date(params.value);

        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      }
    },
    {
      headerName: 'End Date',
      field: 'end_date_nego',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      valueFormatter: (params: any) => {

        if (!params.value) return '-';

        const date = new Date(params.value);

        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      }
    },
    {
      headerName: 'Create Date',
      field: 'createdAt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 180,

      valueFormatter: (params: any) => {

        if (!params.value) return '-';

        const date = new Date(params.value);

        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      }
    },
   {
      headerName: 'Status',
      field: 'nego_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 180,

      cellRenderer: (params: any) => {

        const status = params.value || '';

        const badge = document.createElement('span');

        badge.innerText = status;

        badge.style.borderRadius = '20px';
        badge.style.fontSize = '12px';
        badge.style.fontWeight = '600';
        badge.style.display = 'inline-block';
        badge.style.minWidth = '110px';
        badge.style.textAlign = 'center';

        if (status === 'LIVE NEGO') {

          badge.style.backgroundColor = '#dcfce7';
          badge.style.color = '#15803d';
          badge.style.border = '1px solid #86efac';

        }

        else if (status === 'CLOSE NEGO') {

          badge.style.backgroundColor = '#ffedd5';
          badge.style.color = '#c2410c';
          badge.style.border = '1px solid #fdba74';

        }

        else {

          badge.style.backgroundColor = '#fee2e2';
          badge.style.color = '#dc2626';
          badge.style.border = '1px solid #fca5a5';

        }

        return badge;
      }
    },
    {
      headerName: 'Action',
      field: 'action',
      sortable: false,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 2,
      minWidth: 180,

      cellRenderer: (params: any) => {

        const container = document.createElement('div');

        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'flex-start';
        container.style.gap = '10px';
        container.style.width = '100%';

        /* Common Button Style Function */
        const applyButtonStyle = (
          button: HTMLButtonElement,
          bgColor: string,
          hoverColor: string
        ) => {

          button.style.border = 'none';
          button.style.padding = '7px 14px';
          button.style.borderRadius = '8px';
          button.style.fontSize = '12px';
          button.style.fontWeight = '600';
          button.style.cursor = 'pointer';
          button.style.color = '#fff';
          button.style.background = bgColor;
          button.style.transition = '0.3s ease';
          button.style.minWidth = '130px';
          button.style.height = '34px';

          button.onmouseenter = () => {
            button.style.background = hoverColor;
          };

          button.onmouseleave = () => {
            button.style.background = bgColor;
          };
        };

        if (params.data.nego_status == 'LIVE NEGO') {

          const createBtn = document.createElement('button');

          createBtn.innerText = 'Action Negotiation';

          applyButtonStyle(
            createBtn,
            '#2563eb',
            '#1d4ed8'
          );

          createBtn.addEventListener('click', () => {

            this.router.navigate(
              ['/send-negotiation-link'],
              {
                queryParams: {
                  vendor_id: this.vendor_id_header,
                  nego_id: this.cryptoService.encrypt(params.data.negotiation_code),
                  renego_status: this.cryptoService.encrypt(params.data.nego_status),
                  procurement_type: this.cryptoService.encrypt(params.data.pr_category)
                }
              }
            );

          });

          container.appendChild(createBtn);
        }

        return container;
      }
    }
  ];

  getListForVendor() {
    this.poService.getAllNegotiationListForVendor(this.vendor_id).subscribe((res: any) => {
      this.rowData = res.data;
      this.filteredData = this.rowData;
    },
      ((err: any) => {
      this.filteredData = [];
      })
    )
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

  onFilterByDepartment(event: any) {
    if (event == null || undefined) {
      this.filteredData = this.rowData;
    } else {
      this.filteredData = this.rowData.filter((res: any) => res.department_name == event);
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}