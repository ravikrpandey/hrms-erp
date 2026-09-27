import { Component, Inject, ViewChild } from '@angular/core';
// import { ActionCellRenderer } from '../action-cell-renderer/action-cell-renderer.component';
import { HelpdeskService } from 'src/app/@shared/services/HelpDeskService/helpdesk.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
// import { ActionComponent } from '../action/action.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ActionCellRenderer } from './action-cell-renderer/action-cell-renderer.component';
import { ActionComponent } from './action/action.component';
import { TicketCategoryDialogComponent } from './ticket-category-dialog/ticket-category-dialog.component';
import { GridApi } from 'ag-grid-community';

@Component({
  selector: 'app-ticket-category',
  templateUrl: './ticket-category.component.html',
  styleUrls: ['./ticket-category.component.scss'],
})
export class TicketCategoryComponent {
  @ViewChild(AgGridAngular) agGrid: AgGridAngular;
  displayStyle: any = 'none';
  rowData: any[] = [];
  columnDefs: any[];
  departmentname: any;
  isActive: boolean = false;
  categorycode: string | null = null;
  ticketCategory: FormGroup;
  id: any;
  searchQuery: string = '';
  filteredData: any[] = [];

  rowClass:any
 private gridApi!: GridApi<any>;
  constructor(
    private helpdeskservice: HelpdeskService,
    private fb: FormBuilder,
    private _commonService: CommonService,
    public toaster: ToastrService,
    public dialog: MatDialog
  ) {
    this.ticketCategory = this.fb.group({
      categoryCode: [null, Validators.required],
      categoryName: [null, Validators.required],
      dept_id: [null, Validators.required],
      status: [false, Validators.required],
    });
  }

  gridOptions = {
    context: {
      componentParent: this,
    },
  };

  ngOnInit(): void {
    this.gridOptions.context = {
      componentParent: this,
    };
    this.calldata();
    this.getDepartmentData();
    this.helpdeskservice.getUniquecategoryCode().subscribe((res: any) => {
      this.categorycode = res.data.categoryCode;
    });
  }

  getSingleuserData() {
    this.helpdeskservice
      .getTheSingleDatabasedOnid(this.id)
      .subscribe((res: any) => {
        console.log('hi i am recve dthe data');
      });
  }

  getDepartmentData() {
    this.helpdeskservice.getDepertmentdata().subscribe((res: any) => {
      this.departmentname = res.data;
    });
  }

  shareAction(rowData: any): void {
    console.log('Share clicked for ticket:', rowData);
  }

  onGridReady(e: any): void {
    this.helpdeskservice.getAllticketcategorydata().subscribe((res: any) => {
      this.rowData = res.data.map((item: any, index: any) => {
        return {
          ...item,
          serialNo: index + 1,
        };
      });
      this.helpdeskservice.getDepertmentdata().subscribe((deptRes: any) => {
        this.departmentname = deptRes.data;
        this.rowData = this.rowData.map((row: any) => {
          const selectedDept = this.departmentname.find(
            (dept: any) => dept.dept_id === row.dept_id
          );
          if (selectedDept) {
            return {
              ...row,
              departmentName: selectedDept.department_name,
            };
          } else {
            console.warn('No department found for dept_id:', row.dept_id);
            return row;
          }
        });
        this.updateGridData();
      });
    });
  }

  onSearchInput(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.searchQuery = searchTerm;
    this.filteredData = this.rowData.filter(
      (item) =>
        item.categoryName.toLowerCase().includes(searchTerm) ||
        item.categoryCode.toLowerCase().includes(searchTerm) ||
        item.departmentName.toLowerCase().includes(searchTerm)
    );
    this.updateGridData();
  }

  updateGridData(): void {
    if (this.agGrid && this.agGrid.api) {
      this.agGrid.api.setRowData(this.filteredData);
    } else {
      console.error('Grid API is not available!');
    }
  }

  calldata(): void {
    this.columnDefs = [
      {
        headerName: 'Serial No',
        field: 'serialNo',
        sortable: true,
        resizable: true,
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Category Code',
        field: 'categoryCode',
        sortable: true,
        resizable: true,
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Category Name',
        field: 'categoryName',
        sortable: true,
        resizable: true,
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Department Name',
        field: 'departmentName',
        sortable: true,
        resizable: true,
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Status',
        field: 'status',
        sortable: true,
        resizable: true,
        flex: 1,
        minWidth: 150,
        cellRendererFramework: ActionCellRenderer,
      },
      {
        headerName: 'Action',
        field: 'id',
        sortable: true,
        resizable: true,
        flex: 1,
        minWidth: 150,
        cellRendererFramework: ActionComponent,
      },
    ];
  }

  toggleActive(event: any): void {
    this.isActive = event.checked;
  }

  openModal() {
    const dialogRef = this.dialog.open(TicketCategoryDialogComponent, {
      width: '40%',
      data: { data: null },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  closePopup() {
    this.displayStyle = 'none';
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }
}
