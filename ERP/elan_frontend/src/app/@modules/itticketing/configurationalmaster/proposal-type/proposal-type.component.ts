import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import {
  GridApi,
  GridReadyEvent,
  ColDef,
} from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

import { ProposalActionComponent } from './proposal-action/proposal-action.component';

@Component({
  selector: 'app-proposal-type',
  templateUrl: './proposal-type.component.html',
  styleUrls: ['./proposal-type.component.scss'],
})
export class ProposalTypeComponent {
  id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  columnDefs: ColDef[] = [
    {
      headerName: 'S.No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      maxWidth: 80,
      minWidth: 60,
    },
    {
      headerName: 'Type',
      field: 'perposal_type',
      sortable: true,
      resizable: true,
      flex: 1,
      minWidth: 120,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Description',
      field: 'perposal_discription',
      sortable: true,
      resizable: true,
      flex: 2,
      minWidth: 200,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      resizable: true,
      flex: 1,
      minWidth: 100,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Action',
      field: 'id',
      pinned: 'right',
      flex: 1,
      minWidth: 140,
      maxWidth: 180,
      cellRenderer: ProposalActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    },
  ];


  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private router: Router
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.getProposalType();

    this.route.queryParams.subscribe((params: any) => {
      this.id = params;
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

  getProposalType() {
    this._configurationalMasterService
      .getProposalType()
      .subscribe((res: any) => {
        this.rowData = res.data;
      });
  }
}
