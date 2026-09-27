import { BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { warehouseListService } from 'src/app/@shared/services/warehouse/warehouse-list.service';
import { ToastrService } from 'ngx-toastr';
import { DispatchListActionComponent } from './dispatch-list-action/dispatch-list-action.component';
import { DispatchedService } from 'src/app/@shared/services/warehouse/dispatched.service';
import { SalesService } from '../../sales/service/sales.service';
import { ColDef } from 'ag-grid-community';
// import { SalesService } from '../service/sales.service';

@Component({
  selector: 'app-dispatch-list',
  templateUrl: './dispatch-list.component.html',
  styleUrls: ['./dispatch-list.component.scss'],
})
export class DispatchListComponent {
  rowClass: string;
  isDispatched = new BehaviorSubject('');
  matBtnColor: any;
  loginUser: any;
  employee_ids: any;
  role_master_id: any;
  customizationOn: boolean = false;
  doListOn: boolean = true;
  rowDataCustomization: any;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private dispatchedServices: DispatchedService,
    private _seles: SalesService
  ) {
    this.rowClass = 'rowClass';
  }
  selected = new FormControl(0);
  tabs = ['Order List', 'Dispatched List', 'Customization List'];
  ngOnInit() {
    this.role_master_id = localStorage.getItem('role_master_id');
    this.getSaleOrderList(0);
  }

  redirect2() {
    this.router.navigate([
      'master/warehouse-management/dispatched-product/dispatched-product',
    ]);
  }

  rowData: any[] = [];
  rowData2: any[] = [];
  getSaleOrderList(event: any) {
    this.dispatchedServices.getSOForDispatch(event).subscribe({
      next: (value) => {
        this.rowData = value.data;
      },
    });
  }

  getAllSalesOrderData() {
    try {
      this._seles
        .getAllSOList(this.loginUser, this.role_master_id, 0)
        .subscribe(
          (response: any) => {
            if (response) {
              this.rowDataCustomization = response.data.map((item: any) => ({
                ...item,
                addSo: 'true',
              }));
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } catch (error) {
      console.log(error);
    }
  }
  onTabClick(event: any) {
    if (event === 0) {
      this.customizationOn = false;
      this.doListOn = true;
      this.getSaleOrderList(event);
    } else if (event === 1) {
      this.customizationOn = false;
      this.doListOn = true;
      this.getSaleOrderList(event);
    } else if (event === 2) {
      this.getSaleOrderList(event);
      this.customizationOn = true;
      this.doListOn = true;
    } else if (event === 3) {
      this.getSaleOrderList(event);
      this.customizationOn = true;
      this.doListOn = true;
    } else {
      this.getSaleOrderList(event);
      this.customizationOn = false;
      this.doListOn = true;
    }
  }

  public columnDefs: ColDef[] = [
    {
      headerName: 'S. No.',
      valueGetter: (params: any) => params.node.rowIndex + 1,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 75,
    },
    {
      headerName: 'SO No',
      field: 'sales_order_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 2,
      minWidth: 150, // ✅ more space
      tooltipField: 'sales_order_no', // ✅ show full on hover
      tooltipValueGetter: (params: any) => params.value,
    },
    {
      headerName: 'Quotation No',
      field: 'proposal_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 2,
      minWidth: 150, // ✅ more space
      tooltipField: 'proposal_no', // ✅ show full on hover
      tooltipValueGetter: (params: any) => params.value,
    },
    {
      headerName: 'SO Date',
      field: 'sales_order_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 2,
      minWidth: 150, // ✅ more space
      tooltipField: 'sales_order_date', // ✅ show full on hover
      tooltipValueGetter: (params: any) => params.value,
    },
    {
      headerName: 'Expected Delivery Date',
      field: 'expected_delivery_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 2,
      minWidth: 150, // ✅ more space
      tooltipField: 'expected_delivery_date', // ✅ show full on hover
      tooltipValueGetter: (params: any) => params.value,
    },
    {
      headerName: 'Company Name',
      field: 'company_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 2,
      minWidth: 150, // ✅ more space
      tooltipField: 'company_name', // ✅ show full on hover
      tooltipValueGetter: (params: any) => params.value,
    },
    {
      headerName: 'Customer Name',
      field: 'contact_person_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 2,
      minWidth: 150, // ✅ more space
      tooltipField: 'contact_person_name', // ✅ show full on hover
      tooltipValueGetter: (params: any) => params.value,
    },
    {
      headerName: 'Address',
      field: 'address',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 2,
      minWidth: 150, // ✅ more space
      tooltipField: 'address', // ✅ show full on hover
      tooltipValueGetter: (params: any) => params.value,
    },
    {
      headerName: 'Customisation Date',
      field: 'customisationDate',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 2,
      minWidth: 150, // ✅ more space
      tooltipField: 'customisationDate', // ✅ show full on hover
      tooltipValueGetter: (params: any) => params.value,
    },
    {
      headerName: 'Action',
      field: 'id',
      width: 80,
      suppressSizeToFit: true,
      cellClass: 'grid-cell-centered',
      pinned: 'right',
      cellRenderer: DispatchListActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    },
  ];
}
