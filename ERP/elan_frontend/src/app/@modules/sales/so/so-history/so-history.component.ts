import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { SalesService } from '../../service/sales.service';
import { UpdateSoDateComponent } from '../create-so/update-so-date/update-so-date.component';
import { CommonService } from 'src/app/@shared/services/common.service';
import { SoHistoryActionComponent } from './so-history-action/so-history-action.component';

@Component({
  selector: 'app-so-history',
  templateUrl: './so-history.component.html',
  styleUrls: ['./so-history.component.scss'],
})
export class SoHistoryComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  proposalDetailsData: any;
  public gridOptions: any = { rowSelection: 'multiple' };
  isDeleteButtonVisible: boolean = false;
  selectedRows: any[] = [];
  queryParamss: any;
  id: any;
  collegeids: any;
  collegeIdCopy: any;
  loginUser: any;
  assignAction: any;
  proposal_id: number;
  constructor(
    public dialog: MatDialog,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private route: Router,
    private $proposal: ProposalService,
    private activeroute: ActivatedRoute,
    private _productionService: ProductionService,
    private _sales: SalesService,
    private commonService: CommonService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((res: any) => {
      if (res) {
        this.proposal_id = res.so_history;
        this.getAllSoHistoy(this.proposal_id);
      }
    });
  }

  getAllSoHistoy(id: any) {
    try {
      this._sales.getSOHistory(id).subscribe(
        (response: any) => {
          if (response) {
            this.rowData = response.data;
            this.proposalDetailsData = response.proposalDetails;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  onCellClicked(event: CellClickedEvent) {
    if (event.colDef.field === 'sales_order_date') {
      this.openDateDialog(event.value);
    }
  }
  openDateDialog(data: string) {
    let dialogRef = this.dialog.open(UpdateSoDateComponent, {
      data: data,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.code === 200) {
        this.getAllSoHistoy(this.proposal_id);
      }
    });
  }

  public columnDefs: ColDef[] = [
    {
      headerName: 'S. No.',
      valueGetter: 'node.rowIndex + 1',
      maxWidth: 80,
      cellClass: 'grid-cell-centered',
      tooltipValueGetter: () => 'Row serial number',
    },
    {
      headerName: 'SO No.',
      field: 'sales_order_no',
      cellClass: 'grid-cell-centered',
      maxWidth: 150
    },
    {
      headerName: 'Delivered Qty',
      wrapHeaderText: true,
      autoHeaderHeight: true,
      field: 'total_delivered_quantity',
      maxWidth: 120,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Expected Delivery Date',
      wrapHeaderText: true,
      autoHeaderHeight: true,
      field: 'expected_delivery_date',
      // maxWidth: 110,
      cellClass: 'grid-cell-centered clickable-date',
      cellRenderer: (params: any) => `<span>${params.value}</span>`,
      onCellClicked: (params: any) => this.openDateDialog(params.data),
    },
    {
      headerName: 'Delivery Address',
      field: 'delivery_address',
      tooltipField: 'delivery_address',
      cellClass: 'grid-cell-centered',
      // maxWidth: 400
      flex: 4
    },
    {
      headerName: 'Invoice Status',
      field: 'so_invoice_status',
      tooltipField: 'so_invoice_status',
      cellClass: 'grid-cell-centered',
      flex: 1.2
    },
    {
      headerName: 'Invoice Status',
      wrapHeaderText: true,
      autoHeaderHeight: true,
      field: 'so_invoice_status',
      maxWidth: 150,
      cellClass: 'grid-cell-centered',
      cellRenderer: (params: any) => {

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.gap = '12px';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';

        const invoiceStatus = params.data.so_invoice_status;

        // ---------------- INVOICE ICON ----------------

        const invoiceIcon = document.createElement('span');
        invoiceIcon.innerHTML = `<i class="material-icons">receipt</i>`;
        invoiceIcon.style.fontSize = '20px';

        if (invoiceStatus === 'APPROVED') {

          // Disable Invoice Button
          invoiceIcon.style.color = '#bdbdbd';
          invoiceIcon.style.cursor = 'not-allowed';
          invoiceIcon.title = 'Invoice already generated';

          invoiceIcon.addEventListener('click', () => {
            const id = params.data.id;
            const url =
              // `master/sales/return/create-so-return?so_id=${id}&type=INVOICE_CANCEL&status=VIEW`;
              `/master/sales/so/invoice/create-so-invoice?so_id=${id}&invoiceStatus=${invoiceStatus}`;

            window.open(url, '_self');
          });

        } else {

          invoiceIcon.style.color = '#4caf50';
          invoiceIcon.style.cursor = 'pointer';
          invoiceIcon.title = 'Generate Invoice';

          invoiceIcon.addEventListener('click', () => {
            const id = params.data.id;
            const url =
              `/master/sales/so/invoice/create-so-invoice?so_id=${id}&invoiceStatus=${invoiceStatus}`;

            window.open(url, '_self');
          });
        }

        // ---------------- CANCEL ICON ----------------

        const cancelIcon = document.createElement('span');
        cancelIcon.innerHTML = `<i class="material-icons">cancel</i>`;
        cancelIcon.style.fontSize = '20px';

        if (invoiceStatus === 'APPROVED') {

          cancelIcon.style.color = '#bdbdbd';
          cancelIcon.style.cursor = 'not-allowed';
          cancelIcon.title =
            'Cancel the invoice first to cancel the Sales Order.';

          // cancelIcon.addEventListener('click', () => {
          //   alert('Cancel the invoice first to cancel the Sales Order.');
          // });

        } else {

          cancelIcon.style.color = '#f44336';
          cancelIcon.style.cursor = 'pointer';
          cancelIcon.title = 'Create Sales Return';

          cancelIcon.addEventListener('click', () => {

            const id = params.data.id;

            const url =
              `/master/sales/return/create-so-return?so_id=${id}&type=${encodeURIComponent('SO_CANCEL')}`;

            window.open(url, '_self');
          });
        }
        const downloadIcon = document.createElement('span');

        downloadIcon.innerHTML =
          `<i class="material-icons">download</i>`;

        downloadIcon.style.fontSize = '20px';
        downloadIcon.style.color = '#2196f3';
        downloadIcon.style.cursor = 'pointer';
        downloadIcon.title = 'Download Invoice';

        downloadIcon.addEventListener('click', () => {

          const id = params.data.id;


          this._sales.downloadSalesOrder(id).subscribe({
            next: (blob: Blob) => {

              console.log('Blob Size:', blob.size);
              console.log('Blob Type:', blob.type);

              const url = window.URL.createObjectURL(blob);

              const a = document.createElement('a');
              a.href = url;
              a.download = `SalesOrder_${params.data.id}.pdf`;

              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);

              window.URL.revokeObjectURL(url);
            },
            error: (err) => {
              console.error(err);
            }
          });

        });
        container.appendChild(invoiceIcon);
        container.appendChild(cancelIcon);
        container.appendChild(downloadIcon);

        return container;
      }
    }
  ];


  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  productionData: any;
  getAllProductionData() {
    this._productionService
      .getAllProductionData()
      .subscribe((response: any) => {
        this.productionData = [];
      });
  }

  customCellRenderer(params: any) {
    const cellValue = params.value;
    const clickableContent = document.createElement('div');
    clickableContent.style.cursor = 'pointer';
    clickableContent.style.color = 'green';
    clickableContent.style.textDecoration = 'underline';
    clickableContent.innerText = cellValue;
    clickableContent.addEventListener('click', () => {
      this.clickIt(params);
    });
    return clickableContent;
  }

  clickIt(params: any) {
    this._sales
      .getSalesByProsalId(params?.data?.proposal_id, params?.data?.id)
      .subscribe(
        (res: any) => {
          if (res) {
            this.route.navigate(['master/sales/view-order'], {
              queryParams: {
                proposalId: params?.data?.proposal_id,
                doId: params?.data?.id,
                actionType: 'view-details',
              },
            });
          }
        },
        (err: any) => {
          this.toast.warning(err.error.message);
        }
      );
  }
}
