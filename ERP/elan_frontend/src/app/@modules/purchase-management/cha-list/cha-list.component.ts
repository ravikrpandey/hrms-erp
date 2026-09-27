import { Component } from '@angular/core';
import { GridApi, GridReadyEvent, ColDef } from 'ag-grid-community';
import { Router } from '@angular/router';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';

@Component({
  selector: 'app-cha-list',
  templateUrl: './cha-list.component.html',
  styleUrls: ['./cha-list.component.scss'],
})
export class ChaListComponent {
  private gridApi!: GridApi<any>;
  filteredData: any[] = [];
  public gridOptions: any = { rowSelection: 'multiple' };
  public rowData: any = [];
  page: string = 'CHA';

  constructor(
    private router: Router,
    private prService: PurchaseRequestService,
  ) {
    this.getList();
  }

  public columnDefs: ColDef[] = [
    {
      headerName: 'S. No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.5,
    },
    {
      headerName: 'PO No.',
      field: 'po_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.8,
    },
    {
      headerName: 'Shipment No.',
      field: 'shiped_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.8,
    },
    {
      headerName: 'Vendor Name',
      field: 'vendorName',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1.2,
    },
    {
      headerName: 'Vendor Contact No.',
      field: 'contact_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Mode Type',
      field: 'mode',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Shipping Status',
      field: 'audit',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Shipment Date',
      field: 'shipment_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 0.5,
      cellClass: 'grid-cell-centered',

      cellRenderer: (params: any) => {
        const container = document.createElement('div');

        const restrictedStatus = [
          'CHA_BILL_GENERATED',
          'OUT_FOR_DELIVERY',
          'RECEIVED',
        ];

        const isReadOnly = restrictedStatus.includes(params.data.audit);

        const icon = document.createElement('span');

        if (isReadOnly) {
          icon.innerHTML = `<i class="material-icons">visibility</i>`;
          icon.title = 'View/Download Bill';
          icon.style.color = '#2196f3';
        } else {
          icon.innerHTML = `<i class="material-icons">edit</i>`;
          icon.title = 'Edit Data';
          icon.style.color = '#4caf50';
        }

        icon.style.cursor = 'pointer';
        icon.style.fontSize = '20px';

        icon.addEventListener('click', () => {
          this.router.navigate(
            ['master/purchase-management/cha-list/cha-form'],
            {
              queryParams: {
                id: params.data.id,
                page: this.page,
                mode: isReadOnly ? 'view' : 'edit',
              },
            },
          );
        });

        container.appendChild(icon);
        return container;
      },
    },
  ];

  getList() {
    this.prService.getCHAForwarderList(this.page).subscribe(
      (res: any) => {
        this.rowData = res.data;
        this.filteredData = this.rowData;
      },
      (err: any) => {
        this.filteredData = [];
      },
    );
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value,
    );
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
