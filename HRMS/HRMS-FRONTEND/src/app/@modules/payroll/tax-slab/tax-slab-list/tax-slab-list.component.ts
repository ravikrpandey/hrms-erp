import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { TaxSlabActionComponent } from '../tax-slab-action/tax-slab-action.component';
import { TaxSlabToggleComponent } from '../tax-slab-toggle/tax-slab-toggle.component';

@Component({
  selector: 'app-tax-slab-list',
  templateUrl: './tax-slab-list.component.html',
  styleUrls: ['./tax-slab-list.component.scss']
})
export class TaxSlabListComponent {

  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private payrollService:PayrollService,
    private toast:ToastrService
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.getAllCreatedTaxslabList()
  }


  getAllCreatedTaxslabList() {
    this.payrollService.getAllCreatedTaxslabList().subscribe((res: any) => {
      if (res && res.data) {
        // Assuming res.data is an array of objects
        this.rowData = res.data.map((item: { concatenatedValue: string; min: any; max: any; }) => {
          // Concatenate values from field1 and field2 (you can replace with actual fields)
          item.concatenatedValue = `${item.min} - ${item.max}`;
          return item;
        });
      }
    }, err => {
      this.toast.error(err.error.message);
    });
  }
  



  public columnDefs = [
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Name',
      field: 'tax_slab_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    // {
    //   headerName: 'Percentage',
    //   field: 'percentage',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    // },

    {
      headerName: 'Effective From',
      field: 'start_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
   
    {
      headerName: 'Standard Deduction',
      field: 'standard_deduction',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      cellRenderer: TaxSlabToggleComponent,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },
   
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 120,
      cellRenderer: TaxSlabActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
      cellClass: 'grid-cell-centered',
    },
  ];




  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

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


  onCellClicked(e: any) {

  }

}
