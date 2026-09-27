import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import * as moment from 'moment';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { MatDialog } from '@angular/material/dialog';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-all-fr',
  templateUrl: './all-fr.component.html',
  styleUrls: ['./all-fr.component.scss']
})


export class AllFrComponent implements OnInit, AfterViewInit {
  quickFilter: string;
  rowClass: any;
  private gridApi!: GridApi<any>;
  depData: any;
  catData: any;
  assignAction: any;
  filteredData: any
  entity_id:any;
  userDetails: any;
  constructor(
    private route: Router,
    private toast: ToastrService,
    private activeroute: ActivatedRoute,
    public dialog: MatDialog,
    private configService: ConfigurationalmasterService,
    private financeService: FinaceService,
    private _rbackService: RbacMasterService,
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.configService.getDepartment(this.entity_id).subscribe((res: any) => {
      this.depData = res.data;
    })

    this.getAllFundRequest();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
    }, 0);
  }
  getClassForPrice(lowThsthresholdStock: any): string {
    return 'low_hershold_stock';
  }
  getClassForPrice2(lowThsthresholdStock: any): string {
    return 'statusAssets2';
  }

  public rowData: any = [];

  public columnDefs = [
    {
      headerName: 'Sr No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Fund Request Code',
      field: 'fund_request_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      // cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      cellClass: (params: { value: any; }) => this.getClassForPrice(params)
    },
    {
      headerName: 'Department',
      field: 'department_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Expense Type',
      field: 'expense_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
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
      minWidth: 150,
      valueFormatter: (params: any) => {
        return moment(new Date(params.value)).format('LL')
      },
    },
    {
      headerName: 'Status',
      field: 'final_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      // cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      cellClass: (params: { value: any; }) => this.getClassForPrice2(params)
    }
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  navigate() {
    this.route.navigate(['master/purchase-main/purchase-request/create-pr'])
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

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  statusCellClicked(e: any) {
    // if (this.assignAction.Write) {
    //   const dialogRef = this.dialog.open(PrStatusDilogComponent, { width: '500px', data: e.data });
    //   dialogRef.afterClosed().subscribe(result => {
    //   })
    // }
  }

  getAllFundRequest() {
    // this.financeService.getAllFundRequest(this.entity_id).subscribe((res: any) => {
    //   this.rowData=res.data
    //   this.filteredData = this.rowData;
    // }, (err: any) => {
    //   this.rowData = []
    // })
  }

}
