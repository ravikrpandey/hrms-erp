import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { QuotationApprovalActionComponent } from './quotation-approval-action/quotation-approval-action.component';

@Component({
  selector: 'app-quotation-approval',
  templateUrl: './quotation-approval.component.html',
  styleUrls: ['./quotation-approval.component.scss']
})
export class QuotationApprovalComponent {
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
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Levels',
      flex: 1,
      minWidth: 200,
      valueGetter: (params: any) => {
        if (Array.isArray(params.data?.details)) {
          return params.data.details
            .map((d: any) => `Level ${d.level_id}`)
            .filter((v: string, i: number, self: string[]) => self.indexOf(v) === i) // duplicate remove
            .join(', ');
        }
        return '';
      }
    },
    {
      headerName: 'Sub Category Count',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      valueGetter: (params: any) => {
        if (Array.isArray(params.data?.details)) {
          const uniqueSubs = new Set(params.data.details.map((d: any) => d.sub_category_id));
          return uniqueSubs.size;
        }
        return 0;
      }
    },

    {
      headerName: 'Action',
      flex: 1,
      minWidth: 150,
      cellRenderer: QuotationApprovalActionComponent,
      cellRendererParams: (params: any) => {
        return {
          id: params.data.id,
          className: 'mat-blue',
          hideRequestButton: true,
          hideDetailsButton: false,
          hideDownloadIcon: false,
          showCustomIcon: false,
        };
      },
    }
  ];

  ngOnInit(): void {
    this.getAllQuotationApproval();
    this.route.queryParams.subscribe((params: any) => {
      this.id = params;
    });
  }

  createQuotationApproval() {
    this.router.navigate(["/master/workflow/quotation-approval/create"])
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

  getAllQuotationApproval() {
    this.service.getAllQuotationApproval().subscribe((res: any) => {
      this.rowData = res.data;
    });
  }

}
