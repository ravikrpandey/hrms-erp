import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';

import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
// import { ItemMasterStatusComponent } from './pr-item-action/item-master-status/item-master-status.component';
import { environment } from 'src/app/environments/environment';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { SubCategoryStatusComponent } from '../subcategory/subcategory-action/subcategory-status/subcategory-status.component';
import { SubcategoryActionComponent } from '../subcategory/subcategory-action/subcategory-action.component';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ZoneTypedialogComponent } from './zone-typedialog/zone-typedialog.component';
import { ZoneTypestatusComponent } from './zone-typedialog/zone-typestatus/zone-typestatus.component';
import { data } from 'jquery';


@Component({
  selector: 'app-zone-type',
  templateUrl: './zone-type.component.html',
  styleUrls: ['./zone-type.component.scss']
})
export class ZoneTypeComponent {

  errorMessage: any;
  id: any;
  item_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any = [];
  count: any = 0;
  assignAction: any;
  entity_id: any;
  financial_year_id: any;
  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private prService: PurchaseRequestService,
    private _finaceservice: FinaceService,
    private shortcutService: ShortcutService,

  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    this.getAllItem();
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.item_id = this.id.item_id;

    });
    this.shortcutService.registerShortcut('a', () => {
      this.route.navigate(["/master/configurational-master/zone-type-master/create-zone"])
    });

  }

  addItem() {
    this.route.navigate(["/master/configurational-master/zone-type-master/create-zone"]);
  }


  public columnDefs = [
    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      flex: 1,
    },
    {
      headerName: 'Sub Location Type Name',
      field: 'zone_type',
      flex: 1,
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: ZoneTypestatusComponent,
      flex: 1
    },
    {
      headerName: 'Action',
      field: 'id',
      cellRenderer: ZoneTypedialogComponent,
      flex: 1
    }
  ];


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

  }

  //   edit(event: any) {
  //   event.stopPropagation();
  //   this.route.navigate(
  //     ['master/configurational-master/zone-type-master/create-zone'],
  //     { queryParams: { id: this.cellValue, action_type: 'edit' } }
  //   );
  // }

  // view(event: any) {
  //   event.stopPropagation();
  //   this.router.navigate(
  //     ['master/configurational-master/zone-type-master/create-zone'],
  //     { queryParams: { id: this.cellValue, action_type: 'view' } }
  //   );
  // }

  // delete(event: any) {
  //   event.stopPropagation();

  //   Swal.fire({
  //     title: 'Do You Want to Delete?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes',
  //     cancelButtonText: 'No'
  //   }).then((result) => {
  //     if (!result.isConfirmed) return;

  //     this._commonService.showLoader();
  //     this._configService.deletezoneTypeById(this.cellValue).subscribe(
  //       () => {
  //         this._commonService.hideLoader();
  //         this.toastr.success('Deleted Successfully');
  //         window.location.reload();
  //       },
  //       () => {
  //         this._commonService.hideLoader();
  //         this.toastr.error('Something went wrong');
  //       }
  //     );
  //   });
  // }


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

  getAllItem() {
    this._configurationalMasterService.zoneTypeList().subscribe((res: any) => {
      this.rowData = res.data
    })
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  cellClicked(e: any) {

    // const dialogRef = this.dialog.open(PrItemDilogComponent, { width: '400px', data: { cellData: e.data } });
    // dialogRef.afterClosed().subscribe(result => {

    // })

  }
  isShortcutVisible() {
    return this.shortcutService.isShortcutVisible();
  }

}