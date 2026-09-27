import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-material-request-approval',
  templateUrl: './material-request-approval.component.html',
  styleUrls: ['./material-request-approval.component.scss']
})
export class MaterialRequestApprovalComponent {
  materialForm!: FormGroup;
  cetegory: any[] = [];
  item: any[] = [];
  private gridApi!: GridApi<any>;
  rowData: any[] = [];
  rowClass: any;
  Login_user_id: any = localStorage.getItem('signInUser');
  loginUserId: any = JSON.parse(this.Login_user_id).employee_id;
  id: string | null;

  constructor(
    private fb: FormBuilder,
    private _configurationalMasterService: ConfigurationalmasterService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this._configurationalMasterService.getAllMaterialRequestList().subscribe((res: any) => {
      this.rowData = res.data;
    });
  }

  public columnDefs = [
    { 
      headerName: 'S.No', 
      valueGetter: "node.rowIndex + 1", 
      sortable: true, 
      resizable: true, 
      cellClass: "grid-cell-centered", 
      flex: 1, 
      minWidth: 150 
    },
    { 
      headerName: 'Service center name', 
      valueGetter: (params: any) => params.data.CRMS_REGISTER_COMPLAIN?.SERVICE_CENTER_MASTER?.sc_name || 'N/A', 
      sortable: true, 
      resizable: true, 
      cellClass: "grid-cell-centered", 
      flex: 1, 
      minWidth: 150 
    },
    { 
      headerName: 'Complain Id', 
      valueGetter: (params: any) => params.data.CRMS_REGISTER_COMPLAIN?.complain_ID || 'N/A', 
      sortable: true, 
      resizable: true, 
      cellClass: "grid-cell-centered", 
      flex: 1, 
      minWidth: 150 
    },
    { 
      headerName: 'Request Id', 
      valueGetter: (params: any) => params.data.id || 'N/A', 
      sortable: true, 
      resizable: true, 
      cellClass: "grid-cell-centered", 
      flex: 1, 
      minWidth: 150 
    },
    { 
      headerName: 'Status', 
      valueGetter: (params: any) => params.data.CRMS_REGISTER_COMPLAIN?.complain_status || 'N/A', 
      sortable: true, 
      resizable: true, 
      cellClass: "grid-cell-centered", 
      flex: 1, 
      minWidth: 150 
    },
    { 
      headerName: 'Action', 
      cellRenderer: (params: any) => {
        const icon = document.createElement('i');
        icon.className = 'material-icons';
        icon.innerText = 'open_in_new';
        icon.title = 'Material Detail';
        icon.style.cursor = 'pointer';
        icon.addEventListener('click', () => {
          this.openDialog(params.data);
        });
        return icon;
      },
      flex: 1, 
      minWidth: 150 
    }
  ];

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter((document.getElementById('filter-text-box') as HTMLInputElement).value);
  }

  onPageSizeChanged() {
    const value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onCellClicked(e: any) {}

  openDialog(rowData: any) {
    const dialogRef = this.dialog.open(MaterialRequestApprovalComponent, {
      width: '900px',
      data: { lead_id: rowData.CRMS_REGISTER_COMPLAIN.register_complain_id }
    });
    
    dialogRef.afterClosed().subscribe(result => {});
  }
}
