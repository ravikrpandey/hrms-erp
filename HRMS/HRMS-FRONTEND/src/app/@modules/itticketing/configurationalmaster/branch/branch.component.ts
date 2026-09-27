import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { MatDialog } from '@angular/material/dialog';
import { BranchActionComponent } from './branch-action/branch-action.component';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;

  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private toaster: ToastrService,
    private activeRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this._configurationalMasterService
      .listBranch()
      .subscribe((params: any) => {
        this.rowData = params.data;
        
      });
  }
  public columnDefs = [
    {
      headerName: 'S.NO',
      field: 'branch_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth:150
    },
    {
      headerName: 'Branch',
      field: 'branch_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth:150,
      //editable: true,
    },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth:150,
     
      // editable:true
    },
    {
      headerName: 'Action',
      // field: '',
       flex: 1,
       minWidth:150,
      cellRenderer: BranchActionComponent,
      // cellRendererParams: {
      //   className: 'mat-blue',
      //   hideRequestButton: true,
      //   hideDetailsButton: false,
      //   hideDownloadIcon: false,
      //   showCustomIcon: false, // Hide attachment icon
      // },
    },
  ];
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    
  }
  addRecordToGrid(data: any) {
    // if data missing or data has no it, do nothing
    if (!data || data.id == null) {
      return;
    }

    const api = this.gridApi;
    // do nothing if row is already in the grid, otherwise we would have duplicates
    const rowAlreadyInGrid = !!api.getRowNode(data.branch_id);

    if (rowAlreadyInGrid) {
      
      return;
    }

    const transaction = {
      add: [data],
    };

    api.applyTransaction(transaction);
  }

  onFactoryButtonClick(e: any) {
    

    this.count++;
    if (this.count === 1) {
      var button = e.currentTarget,
        buttonColor = button.getAttribute('data-color'),
        side = button.getAttribute('data-side'),
        data = createDataItem(buttonColor);
      this.addRecordToGrid(data);
      this.gridApi.paginationGoToLastPage();
    } else {
      this.toaster.warning("can't add without fill!");
    }
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  getCountry() {
    this._configurationalMasterService.listBranch().subscribe((res: any) => {
      this.rowData = res.data;
      
    });
  }
  onCellValueChanged(event: CellValueChangedEvent) {
    let id1 = event.data.branch_id;
    let val = event.newValue;
    
    

    //  --------------- change on cell -------------------
    
    let sta = event.data;

    // 
    if (
      val == event.data.branch_name ||
      val == event.data.status ||
      val == event.data.branch_id
    ) {
      this._configurationalMasterService.editBranch(id1, sta).subscribe(
        (res: any) => {
          
          this.toaster.success('Updated Successfully');
          this.reloadCurrentRoute();
        },
        (err: any) => {
          // this.toaster.error('Something went wrong please try again', 'Error Message');
          
        }
      );
    }
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  onCellClicked(e: any) {
    
    const dialogRef = this.dialog.open(BranchActionComponent, {
      width: '400px',
      data: {
        role_master_id: e.data.role_master_id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      
    });
  }
}
let rowIdSequence = 100;

function createDataItem(color: string) {
  const obj = {
    id: rowIdSequence++,
    color: color,
    value1: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100),
  };

  return obj;
}
