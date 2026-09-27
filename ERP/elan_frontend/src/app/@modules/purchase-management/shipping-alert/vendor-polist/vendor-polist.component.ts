import { Component } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { Router } from '@angular/router';
import { CryptoService } from 'src/app/@shared/services/crypto/crypto.service';

@Component({
  selector: 'app-vendor-polist',
  templateUrl: './vendor-polist.component.html',
  styleUrls: ['./vendor-polist.component.scss']
})
export class VendorPolistComponent {

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
    this.getPOListForVendor();
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
      headerName: 'PO No.',
      field: 'po_number',
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
      headerName: 'Total Amount',
      field: 'total_purchase',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 110,
    },
    {
      headerName: 'PO Date',
      field: 'po_date',
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
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 180,

      cellRenderer: (params: any) => {

        const status = params.value || 'Pending';

        const badge = document.createElement('span');

        badge.innerText = status;

        //badge.style.padding = '6px 14px';
        badge.style.borderRadius = '20px';
        badge.style.fontSize = '12px';
        badge.style.fontWeight = '600';
        badge.style.display = 'inline-block';
        badge.style.minWidth = '110px';
        badge.style.textAlign = 'center';

        /* Completed */
        if (status === 'Completed') {

          badge.style.backgroundColor = '#dcfce7';
          badge.style.color = '#15803d';
          badge.style.border = '1px solid #86efac';

        }

        /* In Progress */
        else if (status === 'In Progress') {

          badge.style.backgroundColor = '#ffedd5';
          badge.style.color = '#c2410c';
          badge.style.border = '1px solid #fdba74';

        }

        /* Pending */
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
      minWidth: 320,

      cellRenderer: (params: any) => {

        const container = document.createElement('div');

        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'flex-start';
        container.style.gap = '10px';
        container.style.width = '100%';
        // container.style.padding = '4px 0';

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

        /* Create Shipment Button */
        if (params.data.status !== 'Completed') {

          const createBtn = document.createElement('button');

          createBtn.innerText = 'Create Shipment';

          applyButtonStyle(
            createBtn,
            '#2563eb',
            '#1d4ed8'
          );

          createBtn.addEventListener('click', () => {

            this.router.navigate(
              ['/approved-shipping-alert'],
              {
                queryParams: {
                  vendor_id: this.vendor_id_header,
                  po_id: this.cryptoService.encrypt(params.data.id)
                }
              }
            );

          });

          container.appendChild(createBtn);
        }

        /* Track Shipment Button */
        if (params.data.status !== 'Pending') {

          const trackBtn = document.createElement('button');

          trackBtn.innerText = 'Track Shipment';

          applyButtonStyle(
            trackBtn,
            '#059669',
            '#047857'
          );

          trackBtn.addEventListener('click', () => {

            this.router.navigate(
              ['/vendor-tracking-alert'],
              {
                queryParams: {
                  vendor_id: this.vendor_id_header,
                  po_id: this.cryptoService.encrypt(params.data.id)
                }
              }
            );

          });

          container.appendChild(trackBtn);
        }

        return container;
      }
    }
  ];

  getPOListForVendor() {
    this.poService.getPOListForVendor(this.vendor_id).subscribe((res: any) => {
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