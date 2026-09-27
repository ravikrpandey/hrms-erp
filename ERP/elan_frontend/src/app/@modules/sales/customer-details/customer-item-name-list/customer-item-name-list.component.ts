import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GridApi } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { SalesService } from '../../service/sales.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-customer-item-name-list',
  templateUrl: './customer-item-name-list.component.html',
  styleUrls: ['./customer-item-name-list.component.scss']
})
export class CustomerItemNameListComponent {
  categoryList: any = [];
  subCategoryList: any = [];
  isHidden: boolean = true;
  private gridApi!: GridApi<any>;
  rowData: any = [];
  rowClass = 'rowClass';
  itemList: any = [];
  categoryId: any;
  mesShow: any;
  customer_id: any;
  frmItem: FormGroup;
  constructor(private _configurationalMasterService: ConfigurationalmasterService, private router: Router, private activeRoute: ActivatedRoute, private salesService: SalesService, private toast: ToastrService, private fb: FormBuilder, private $productionService: ProductionService) { }

  ngOnInit() {
    this.frmItem = this.fb.group({
      category_id: [''],
      sub_category_id: [''],

    })

    this.activeRoute.queryParams.subscribe((params: any) => {
      this.customer_id = params['id'];
      this.getCustomerItems(this.customer_id);

    });
    this.getAllCategory();
    
    this.frmItem.get('category_id')?.valueChanges.subscribe(value => {
      console.log(value);
      this.categoryId = value;
      this.getSubCategory(value)
    });
    this.frmItem.get('sub_category_id')?.valueChanges.subscribe(value => {
      console.log(value);
      this.getItemList(value, this.categoryId)
    });

  }
  add() {
    this.isHidden = false;
    this.rowData = [];

  }
  getSubCategory(event: any) {
    this._configurationalMasterService.getSubCategory(event?.value ?? event).subscribe((res: any) => {
      if (res.code === 201) {
        this.toast.error(res.message);
      }
      this.subCategoryList = res.data;
    },
      (error) => {
        this.toast.error(error.message);
      }
    );
  }

  getAllCategory() {
    this._configurationalMasterService.getActiveAssetMasterList().subscribe((res: any) => {
      this.categoryList = res.data;
    });
  }
  getItemList(event: any, event2: any) {
    this.$productionService.getItemListForCustomer(event?.id ?? event, event2?.item_category_id ?? event2, this.customer_id).subscribe((res: any) => {
      if (res.code === 201) {
        this.toast.error(res.message);
        return;
      }

      const products = res.data || [];
      this.rowData = [];
      this.rowData = products;


    }, (error) => {
      this.rowData = [];
    });


  }
  getCustomerItems(customer_id: any) {
    this.$productionService.getCustomerItems(this.customer_id).subscribe((res: any) => {
      if (res.code === 201) {
        this.toast.error(res.message);
        return;
      }

      const products = res.data || [];
      this.rowData = [];

      this.rowData = products;


    }, (error) => {
      this.rowData = [];
    });


  }
  public columnDefs = [
    {
      headerName: '',
      field: 'checkbox',
      width: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true
    },
    {
      headerName: 'S. No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      minWidth: 100,
      maxWidth: 100,
      flex: 1,
    },
    {
      headerName: 'Item Code',
      field: 'item_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Item Name',
      field: 'item_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },

    // {
    //   headerName: 'Customer Item Name',
    //   field: 'customer_item_name',
    //   sortable: true,
    //   editable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   valueGetter: (params: any) => {
    //     if (params.data.customer_item_name) {
    //       return params.data.customer_item_name;
    //     }
    //     return params.data?.CUSTOMER_ITEM_MAPPINGs?.[0]?.item_name || '';
    //   },

    //   valueSetter: (params: any) => {
    //     params.data.customer_item_name = params.newValue;
    //     if (!params.data.CUSTOMER_ITEM_MAPPINGs) {
    //       params.data.CUSTOMER_ITEM_MAPPINGs = [{}];
    //     }
    //     if (!params.data.CUSTOMER_ITEM_MAPPINGs.length) {
    //       params.data.CUSTOMER_ITEM_MAPPINGs.push({});
    //     }
    //     params.data.CUSTOMER_ITEM_MAPPINGs[0].item_name = params.newValue;
    //     return true;
    //     // valueGetter: (params: any) => {
    //     //   return params.data?.CUSTOMER_ITEM_MAPPINGs?.[0]?.item_name || '';
    //     // }
    //   },
    // }
{
  headerName: 'Customer Item Name (Suggested)',
  field: 'customer_item_name',
  sortable: true,
  editable: true,
  resizable: true,
  wrapHeaderText: true,
  autoHeaderHeight: true,
  cellClass: 'grid-cell-centered',
  flex: 1,

  valueGetter: (params: any) => {
    if (params.data.customer_item_name) {
      return params.data.customer_item_name;
    }
    return params.data?.CUSTOMER_ITEM_MAPPINGs?.[0]?.item_name || '';
  },

  valueSetter: (params: any) => {
    params.data.customer_item_name = params.newValue;

    if (!params.data.CUSTOMER_ITEM_MAPPINGs) {
      params.data.CUSTOMER_ITEM_MAPPINGs = [{}];
    }

    if (!params.data.CUSTOMER_ITEM_MAPPINGs.length) {
      params.data.CUSTOMER_ITEM_MAPPINGs.push({});
    }

    params.data.CUSTOMER_ITEM_MAPPINGs[0].item_name = params.newValue;

    return true;
  },

  cellRenderer: (params: any) => {
    return `
      <div class="editable-cell">
        <span>${params.value || ''}</span>
        <i class="fa fa-pencil edit-icon"></i>
      </div>
    `;
  }
}
  ];

  gridOptions = {
    rowSelection: 'multiple'
  };
  
  getSelectedRows() {
    
    let selectedRows = this.gridApi.getSelectedRows();
    selectedRows = selectedRows.filter(x => x.customer_item_name && x.customer_item_name.trim() !== '')
    console.log('Selected Rows:', selectedRows);
    if(!selectedRows.length){
      this.toast.warning('Please enter the suggested name for the selected item.');
      return;
    }
    this.salesService.customerItemName(this.customer_id, selectedRows).subscribe({
      next: (res: any) => {
        console.log(res)
        this.toast.success(res.message)
        this.getCustomerItems(this.customer_id); 
        // this.reloadCurrentRoute();
      }, error: (err) => {
        console.log(err)
        this.toast.error(err.message)
      },
    })
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }
  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }
  cancel() { }


  reloadCurrentRoute() {
    window.location.reload();
  }
}
