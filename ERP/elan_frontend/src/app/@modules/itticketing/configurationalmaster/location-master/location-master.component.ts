import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { LocationMasterActionComponent } from './location-master-action/location-master-action.component';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';


@Component({
  selector: 'app-location-master',
  templateUrl: './location-master.component.html',
  styleUrls: ['./location-master.component.scss']
})
export class LocationMasterComponent {
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
  getCityData: any[] = [];

  constructor(
    private _rbackService: RbacMasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private _finaceservice: FinaceService,
    private shortcutService: ShortcutService,
    private _empRegistration: EmpRegistrationService,
    private _configurationalMasterService: ConfigurationalmasterService,

  ) {
    this.rowClass = 'rowClass';
  }


  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.assignAction = this._rbackService.accessAssignAction();
    this.getAllItem();
    this.getCity();
    this.loadData();
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.item_id = this.id.item_id;

    });

  }

  addLocationPlace() {
    this.route.navigate(["/master/configurational-master/location-master/create_location"])
    this._finaceservice.getFinancialYearActiveMonthByEntityId(this.entity_id, this.financial_year_id).subscribe({
      next: (res: any) => {
        let newMonth = this._finaceservice.getCurrentMonth();
        let isExistData = res.data.some((x: any) => x.month === newMonth);
        if (!isExistData && res.code === 200) {
          this.toaster.warning(res.message);
          return
        }
        if (!isExistData && res.code === 201) {
          this.toaster.warning(res.message);
          return
        }
        this.route.navigate(["/master/configurational-master/location-master/create_location"])
      }, error: (err) => {
        console.log(err)
        this.toaster.warning(err.error.message);
        return
      }
    })
  }

  loadData() {
    this._configurationalMasterService.getCity().subscribe((res: any) => {
      this.getCityData = res.data;

      this._empRegistration.getAllLocation().subscribe((res: any) => {
        const locations = res.data;
        //  Merge city_name into locations
        this.rowData = locations.map((loc: any) => {
          const city = this.getCityData.find((c: any) => c.city_id === loc.city_id);
          return {
            ...loc,
            city_name: city ? city.city_name : "N/A"
          };
        });

        console.log("Final Row Data ===>", this.rowData);
      });
    });
  }

  public columnDefs = [
    {
      headerName: 'S.No.',
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
      headerName: 'City Name',
      field: 'city_name',   // 👈 ab ye merged data se aayega
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Location Name',
      field: 'location_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Location Code',
      field: 'location_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: LocationMasterActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
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

  getAllItem() {
    this._empRegistration.getAllLocation().subscribe((res: any) => {
      this.rowData = res.data;
      console.log("1111111", this.rowData)
    })
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  cellClicked(e: any) { }

  isShortcutVisible() {
    return this.shortcutService.isShortcutVisible();
  }

  getCity() {
    this._configurationalMasterService.getCity().subscribe((res: any) => {
      this.getCityData = res.data;
      console.log("############2222222222222222222", this.getCityData)

    })
  }

}
