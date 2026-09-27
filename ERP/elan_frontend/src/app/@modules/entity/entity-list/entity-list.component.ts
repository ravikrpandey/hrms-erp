import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { EntityActionComponent } from '../entity-action/entity-action.component';
import { EntityStatusComponent } from '../entity-status/entity-status.component';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { EntityLogoComponent } from '../entity-logo/entity-logo.component';
import { CommonService } from 'src/app/@shared/services/common.service';
import * as moment from 'moment';


@Component({
  selector: 'app-entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.scss']
})
export class EntityListComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  public gridOptions: any = { rowSelection: 'multiple', getRowHeight: this.getRowHeight.bind(this) };
  isDeleteButtonVisible: boolean = false;
  selectedRows: any[] = [];
  queryParamss: any;
  id: any;
  collegeids: any;
  collegeIdCopy: any;
  loginUser: any;
  assignAction: any;
  formattedShiftTime: string = '';
  selectedView: string = 'list';

  getRowHeight(params: any) {
    // Adjust this logic as per your requirements
    return 40; // Example: return a fixed height like 50px
  }

  constructor(
    public dialog: MatDialog,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private entityService: EntityMasterService,
    private _commonService : CommonService
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.getAllEntity();
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
      this.collegeids = this.id.id;
    });
    // this._configurationalMasterService.messageSubject.subscribe((id: any) => {
    //   this.collegeIdCopy = id;
    // });
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);
    this.assignAction = this._rbackService.accessAssignAction();
  }

  redirect() {
    this.route.navigate(['/master/entity/add-entity'])
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
      minWidth: 150,
    },
    {
      headerName: 'Logo',
      field: 'logo',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      // minHeight: 150,
      cellRenderer: EntityLogoComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
    {
      headerName: 'Entity Name',
      field: 'entity_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Registered Office',
      field: 'registered_office',
      flex: 1,
      minWidth: 150,
      // cellRenderer: EntityStatusComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    }, 
    {
      headerName: 'Created Date',
      field: 'entity_createdAt',
      flex: 1,
      minWidth: 150,
      // cellRenderer: EntityStatusComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
      valueFormatter:(params:any)=>{
              return moment(params.value).format('lll')
            }
    },

    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: EntityActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
  ];

  onSelectionChanged(event: any) {
    this.selectedRows = event.api.getSelectedRows();

    this.isDeleteButtonVisible = this.selectedRows.length > 0;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.addEventListener('selectionChanged', this.onSelectionChanged.bind(this));

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

  getAllEntity() {
    try {
      this._commonService?.showLoader()
      this.entityService.getEntityList().subscribe((response: any) => {
        if (response) {
          this._commonService?.hideLoader()
          this.rowData = response.data
        }
      }, (err: any) => {
        this._commonService?.hideLoader()
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }

}
