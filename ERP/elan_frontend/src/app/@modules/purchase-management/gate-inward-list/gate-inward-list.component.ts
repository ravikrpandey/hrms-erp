import { Component } from '@angular/core';
import { GridApi, GridReadyEvent, ColDef } from 'ag-grid-community';
import { Router } from '@angular/router';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gate-inward-list',
  templateUrl: './gate-inward-list.component.html',
  styleUrls: ['./gate-inward-list.component.scss'],
})
export class GateInwardListComponent {
  private gridApi!: GridApi<any>;
  filteredData: any[] = [];
  public gridOptions: any = { rowSelection: 'multiple' };
  public rowData: any = [];
  page: string = 'TRANSPORT';

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
      valueFormatter: (params) =>
        params.data.audit === 'RECEIVED'
          ? 'Vehicle Reached'
          : params.data.audit,
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

        // VIEW/DOWNLOAD
        const icon = document.createElement('span');

        icon.innerHTML = `<i class="material-icons">visibility</i>`;
        icon.title = 'View/Download Bill';
        icon.style.color = '#2196f3';

        icon.style.cursor = 'pointer';
        icon.style.fontSize = '20px';

        icon.addEventListener('click', () => {
          this.router.navigate(
            ['master/purchase-management/cha-forwarder-form'],
            {
              queryParams: {
                id: params.data.id,
                page: this.page,
                mode: 'view',
              },
            },
          );
        });

        container.appendChild(icon);

        // RECEIVED BUTTON ONLY FOR OUT_FOR_DELIVERY
        if (params.data.audit === 'OUT_FOR_DELIVERY') {
          const receiveIcon = document.createElement('span');

          receiveIcon.innerHTML = `<i class="material-icons">check_circle</i>`;
          receiveIcon.title = 'Mark As Received';

          receiveIcon.style.color = '#ff9800';
          receiveIcon.style.cursor = 'pointer';
          receiveIcon.style.fontSize = '20px';

          receiveIcon.addEventListener('click', () => {
            Swal.fire({
              title: 'Are you sure?',
              text: 'Do you want to mark this as Vehicle Reached?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, Vehicle Reached',
              cancelButtonText: 'Cancel',
            }).then((result) => {
              if (result.isConfirmed) {
                this.prService
                  .receivedPOFromGateInward({ id: params.data.id })
                  .subscribe({
                    next: (res: any) => {
                      Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Status changed to Vehicle Reached',
                      });

                      this.getList();
                    },

                    error: (err: any) => {
                      Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Something went wrong',
                      });
                    },
                  });
              }
            });
          });

          container.appendChild(receiveIcon);
        }

        // RECEIVED STATUS ICON (NO ACTION)
        if (params.data.audit === 'RECEIVED') {
          const completedIcon = document.createElement('span');

          completedIcon.innerHTML = `<i class="material-icons">task_alt</i>`;
          completedIcon.title = 'PO Already Vehicle Reached';

          completedIcon.style.color = '#4caf50';
          completedIcon.style.cursor = 'not-allowed';
          completedIcon.style.fontSize = '20px';
          completedIcon.style.opacity = '0.8';

          container.appendChild(completedIcon);
        }
        return container;
      },
    },
  ];

  getList() {
    this.prService.getGateInwardList().subscribe(
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
