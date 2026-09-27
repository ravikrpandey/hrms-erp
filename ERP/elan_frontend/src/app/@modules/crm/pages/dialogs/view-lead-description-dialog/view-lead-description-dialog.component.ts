import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { environment } from 'src/app/environments/environment';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
// import { RecruitService } from 'src/app/@service/recruitment.service';
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
    this.singleData = this.data?.id;
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.viewDescription();
  }


  // Get description start
  viewDescription() {
    try {
      console.log(this.singleData)
      this.$crm.viewDescription(this.singleData?.id).subscribe((response: any) => {
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
      headerName: 'Name',
      field: 'lead_owner',
      minWidth: 175,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Description',
      field: 'description',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      cellRenderer: this.customHtmlCellRenderer.bind(this),
    },
    {
      headerName: 'Status',
      field: 'field_value',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Follow Up Date',
      field: 'follow_up_date',
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
    },
  ];

  customHtmlCellRenderer(params: any): HTMLElement {
    const element = document.createElement('div');
    element.innerHTML = params.value;
    return element;
  }


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    // 
  }

}
