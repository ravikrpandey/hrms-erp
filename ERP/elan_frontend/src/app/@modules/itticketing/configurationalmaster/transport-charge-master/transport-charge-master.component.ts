import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CheckPostingPeriod } from 'src/app/@shared/helper/checkPostingPeriod/checkPostingPeriod';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { CreateTransportChargeComponent } from './create-transport-charge/create-transport-charge.component';
import { TransporterChargeActionComponent } from './transporter-charge-action/transporter-charge-action.component';

@Component({
  selector: 'app-transport-charge-master',
  templateUrl: './transport-charge-master.component.html',
  styleUrls: ['./transport-charge-master.component.scss']
})
export class TransportChargeMasterComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  subscription: Subscription;
  columnDefs: any[] = [
    {
      headerName: 'S.No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 0.5,
    },
    {
      headerName: "Charge Name",
      field: 'charge_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
    },
    
    {
      headerName: "Action",
      field: 'city_name',
      flex: 1,
      minWidth: 150,
      cellRenderer: TransporterChargeActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    }
  ];

  entity_id: any;
  financial_year_id: any;

  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    public dialog: MatDialog, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private _finaceservice: FinaceService,
  ) {
    this.rowClass = 'rowClass'
  }

  ngOnInit(): void {
    this.getTransportChargeList();
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.countryss_id = this.id.countryss_id
    })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  agInit(params: ICellRendererParams): void {
    // Implementation if needed
  }

  openDialog() {
    const dialogRef = this.dialog.open(CreateTransportChargeComponent, {
      width: '30%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getTransportChargeList();
    });
  }

  onCellValueChanged(event: CellValueChangedEvent) {
    let id1 = event.data.countryss_id;
    let val = event.newValue;
    let sta = event.data;

    if (val == event.data.status) {
      this._configurationalMasterService.updateSingleCountry(id1, sta).subscribe(
        (res: any) => {
          this.toaster.success('Status Updated Successfully')
        }, (err: any) => {
        });
    }
  }

  addRecordToGrid(data: any) {
    if (!data || data.id == null) { return; }

    const api = this.gridApi;
    
    const rowAlreadyInGrid = !!api.getRowNode(data.id);

    if (rowAlreadyInGrid) {
      return;
    }

    const transaction = {
      add: [data],
    };

    api.applyTransaction(transaction);
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

  getTransportChargeList() {
    this._configurationalMasterService.getTransportChargeList().subscribe((res: any) => {
      this.rowData = res.data;
    })
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}