import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerApprovalActionComponent } from './customer-approval-action/customer-approval-action.component';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';


@Component({
  selector: 'app-customer-approval',
  templateUrl: './customer-approval.component.html',
  styleUrls: ['./customer-approval.component.scss']
})
export class CustomerApprovalComponent {
  private gridApi!: GridApi<any>
  rowClass: any;
  rowData: any;
  id: any;
  constructor(
    private _rbackService: RbacMasterService,
    public dialog: MatDialog,
    private _commonService: CommonService,
    private shortcutService: ShortcutService,
    private toaster: ToastrService,
    private router: Router,
    private service: ConfigurationalmasterService,
 private route: ActivatedRoute,
  ) {
  }


  public columnDefs = [

    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      // field: 'i',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },  
      {
    headerName: 'Approval Option',
    field: 'approval_option',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: "grid-cell-centered",
    flex: 1,
    minWidth: 200,   
  },
   {
    headerName: 'Employee Count',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: "grid-cell-centered",
    flex: 1,
    minWidth: 150,
    valueGetter: (params: any) => {
      return Array.isArray(params.data?.employee_ids)
        ? params.data.employee_ids.length
        : 0;
    }
  },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: CustomerApprovalActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    }
  ];

    ngOnInit(): void {
    this.getAllCustomerApproval();

    this.route.queryParams.subscribe((params: any) => {
      this.id = params;
    });
  }

  createCustomerApproval() {
    this.router.navigate(["/master/workflow/customer-approval/create"])
  };

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

    getAllCustomerApproval() {
    this.service.getAllCustomerApproval().subscribe((res: any) => {
        this.rowData = res.data;
      });
  }

}
