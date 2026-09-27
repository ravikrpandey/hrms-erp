import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { environment } from 'src/app/environments/environment';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import * as moment from 'moment';
@Component({
  selector: 'app-view-lead-description-dialog',
  templateUrl: './view-lead-description-dialog.component.html',
  styleUrls: ['./view-lead-description-dialog.component.scss'],
})
export class ViewLeadDescriptionDialogComponent {
  private gridApi!: GridApi<any>;
  singleData: any;
  fileUrl;
  rowData: any = [];
  rowClass: any;

  constructor(
    private $crm: CrmService,
    public dialog: MatDialogRef<ViewLeadDescriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.fileUrl = environment.servralUrl+'/uploadDoc/';
    
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {

    this.getComplaintById(); 
  }


  // Get Complaint By Id
  getComplaintById() {
    try {
      this.$crm.getComplaintById(this.data.id?.id).subscribe((response: any) => {
        if (response) {
          this.rowData = response.data;
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }

  // Get description end

  public columnDefs = [
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered ',
      flex: 1,
    },
    {
      headerName: 'Customer Name',
      field: 'CRMS_REGISTER_COMPLAIN.customer_name',
      minWidth: 175,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Date',
      field: 'createdAt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      valueFormatter: function(params: any) {
        return moment(params.value).format('DD/MM/YYYY');
      }
    },
    
    {
      headerName: 'System Serial No',
      field: 'CRMS_REGISTER_COMPLAIN.system_serial_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      cellRenderer: this.customHtmlCellRenderer.bind(this),
    },
    {
      headerName: 'Complain Status',
      field: 'complain_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Complain Id',
      field: 'CRMS_REGISTER_COMPLAIN.complain_ID',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
  ];

  customHtmlCellRenderer(params: any): HTMLElement {
    const element = document.createElement('div');
    element.innerHTML = params.value;
    return element;
  }


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}