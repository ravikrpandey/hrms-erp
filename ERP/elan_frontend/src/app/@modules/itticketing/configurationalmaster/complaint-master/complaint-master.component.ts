import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CreateComplaintDialogComponent } from './create-complaint-dialog/create-complaint-dialog.component';
import { ComplaintStatusComponent } from './complaint-status/complaint-status.component';
import { ComplaintActionComponent } from './complaint-action/complaint-action.component';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-complaint-master',
  templateUrl: './complaint-master.component.html',
  styleUrls: ['./complaint-master.component.scss']
})
export class ComplaintMasterComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  editDesig: any;
  entity_id: string | null;
  financial_year_id: string | null;

  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private _finaceservice: FinaceService,
    private shortcutService: ShortcutService,
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');;
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
    });
    this.getAllIssueType();
    this.shortcutService.registerShortcut('a', () => {
      this.openDialog()
    });
 
  }

  public columnDefs = [
    {
      headerName: 'S.NO',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'complaint Code',
      field: 'complaint_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      editable: true,
    },
{

  headerName: 'Complaint Type',
  field: 'complaint_type',
  sortable: true,
  resizable: true,
  wrapHeaderText: true,
  autoHeaderHeight: true,
  cellClass: 'grid-cell-centered',
  flex: 1,
  minWidth: 150,
  editable: true,
},
    {
      headerName: 'Status',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: ComplaintStatusComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },

    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: ComplaintActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
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
    const rowAlreadyInGrid = !!api.getRowNode(data.id);

    if (rowAlreadyInGrid) {

      return;
    }
    const transaction = {
      add: [data],
    };

    api.applyTransaction(transaction);
  }


  openDialog(e?: any) {
    if (e) {
      e.stopPropagation();
    }


    this._finaceservice.getFinancialYearActiveMonthByEntityId(this.entity_id, this.financial_year_id).subscribe({
      next: (res: any) => {
        
        let newMonth = this._finaceservice.getCurrentMonth();
        let isExistData = res.data.some((x: any) => x.month === newMonth);
        if (!isExistData && res.code===200) {
          this.toaster.warning(res.message);
          return
        }
        if (!isExistData && res.code===201) {
          this.toaster.warning(res.message);
          return
        }
      
        const dialogRef
          = this.dialog.open(CreateComplaintDialogComponent, {
            width: '30%',
            data: { data: '' }
          });
    
        dialogRef.afterClosed().subscribe((result:any) => {
        });
      }, error: (err) => {
        console.log(err)
        this.toaster.warning(err.error.message);
        return
      }
    })








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


  onCellValueChanged(event: CellValueChangedEvent) {


  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

getAllIssueType(){
  this._configurationalMasterService.get_all_complaint_type(this.entity_id,this.financial_year_id).subscribe((res:any)=>{
     if(res){
      this.rowData=res.data;
     }
  },(err:any)=>{

  })
}
isShortcutVisible() {
  return this.shortcutService.isShortcutVisible();
}

}




