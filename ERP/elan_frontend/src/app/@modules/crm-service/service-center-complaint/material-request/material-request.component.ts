import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-material-request',
  templateUrl: './material-request.component.html',
  styleUrls: ['./material-request.component.scss']
})
export class MaterialRequestComponent implements OnInit {
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
    this.route.queryParamMap.subscribe(params => {
      this.id = params.get('id');
      this._configurationalMasterService.getMaterialRequestList(this.id).subscribe((res: any) => {
        this.rowData = res.data.CRMS_MATERIAL_REQUEST_DETAILs;
        this.remark = res.data?.remark
      });
    });
    this.materialForm = this.fb.group({
      cetegory: new FormControl(null, Validators.required),
      item: new FormControl(null, Validators.required),
      quantity: new FormControl(null, [Validators.required, Validators.min(1)])
    });

    this.loadMaterials();
    this.getCetegory();
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
        headerName: 'Item Category', 
        valueGetter: (params:any) => params.data.asset_category?.asset_category_name || params.data.cetegory, 
        sortable: true, 
        resizable: true, 
        cellClass: "grid-cell-centered", 
        flex: 1, 
        minWidth: 150 
    },
    { 
        headerName: 'Item Name', 
        valueGetter: (params:any) => params.data.ItemMaster?.item_name || params.data.item, 
        sortable: true, 
        resizable: true, 
        cellClass: "grid-cell-centered", 
        flex: 1, 
        minWidth: 150 
    },
    { 
        headerName: 'Item Code', 
        valueGetter: (params:any) => params.data.ItemMaster?.item_code || params.data.item_code, 
        sortable: true, 
        resizable: true, 
        cellClass: "grid-cell-centered", 
        flex: 1, 
        minWidth: 150 
    },
    { 
        headerName: 'Quantity', 
        field: 'quantity', 
        sortable: true, 
        resizable: true, 
        cellClass: "grid-cell-centered", 
        flex: 1, 
        minWidth: 150 
    },
    { 
        headerName: 'Price', 
        valueGetter: (params:any) => params.data.ItemMaster?.B2C_price || params.data.price, 
        sortable: true, 
        resizable: true, 
        cellClass: "grid-cell-centered", 
        flex: 1, 
        minWidth: 150 
    },
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

  getCetegory() {
    this._configurationalMasterService.getActiveCetegory().subscribe((res: any) => {
      this.cetegory = res.data;
    });
  }

  getItem(e: any) {
    this.item = []
    const categoryId = e.target.value;
    this._configurationalMasterService.getItem(categoryId).subscribe((res: any) => {
      this.item = res.data;
    });
  }

  loadMaterials() {
    const materials = localStorage.getItem('materials');
    if (materials) {
      this.rowData = JSON.parse(materials);
    }
  }

  openModal() {
    const modal = document.getElementById('addMaterialModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeModal() {
    const modal = document.getElementById('addMaterialModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  onCellClicked(e: any) {}

  submitForm() {
    const selectedCategoryId = Number(this.materialForm.value.cetegory);
    const selectedCategory = this.cetegory.find(category => category.id === selectedCategoryId);
    const categoryName = selectedCategory ? selectedCategory.asset_category_name : 'Unknown Category';
    const selectedItemId = Number(this.materialForm.value.item);
    const selectedItem = this.item.find(item => item.id === selectedItemId);
    const itemName = selectedItem ? selectedItem.item_name : 'Unknown Item';
    const itemCode = selectedItem ? selectedItem.item_code : 'Unknown Code';
    const itemPrice = selectedItem ? selectedItem.B2C_price : 0;
    const newMaterial = {
      cetegory: categoryName,
      item: itemName,
      quantity: this.materialForm.value.quantity,
      item_code: itemCode,
      price: itemPrice
    };
    const materialRequestDetails = {
      asset_id: this.materialForm.value.cetegory,
      item_id: this.materialForm.value.item,
      quantity: this.materialForm.value.quantity,
    };
    this.rowData.push(newMaterial);
    localStorage.setItem('materials', JSON.stringify(this.rowData));
    this.gridApi.setRowData(this.rowData);
    this.closeModal();
    this.materialForm.reset();
  }

  remark: any;
  clearLocalStorage() {
    const convertedData = this.rowData.reduce((acc, item) => {
      if (item.ItemMaster && item.asset_category) {
          acc.push({
              cetegory: item.asset_category.asset_category_name,
              item: item.ItemMaster.item_name,
              quantity: item.quantity,
              item_code: item.ItemMaster.item_code,
              price: item.ItemMaster.B2C_price
          });
      }
      return acc;
  }, []);
  
  const thirdTypeData = this.rowData.filter(item => !item.ItemMaster && !item.asset_category);
  convertedData.push(...thirdTypeData);
    const modifiedRowPromises = convertedData.map((row:any) => {
      const selectedCategory = this.cetegory.find(category => category.asset_category_name === row.cetegory);
      const selectedCategoryId = selectedCategory ? selectedCategory.id : 0;
      return this._configurationalMasterService.getItem(selectedCategoryId).toPromise().then((res: any) => {
        const items = res.data;
        const selectedItem = items.find((item: any) => item.item_name === row.item);
        const selectedItemId = selectedItem ? selectedItem.id : 0;
        return {
          asset_id: selectedCategoryId,
          item_id: selectedItemId,
          quantity: row.quantity,
          item_code: row.item_code,
          price: row.price
        };
      });
    });

    Promise.all(modifiedRowPromises).then(modifiedRowData => {
      const data = {
        materialRequests: modifiedRowData,
        remark: this.remark,
        register_complain_id: this.id
      };

      this._configurationalMasterService.createMateriaRequest(data).subscribe((res: any) => {
        if (res) {
          this.router.navigate(['master/crm-service/service-center-complaint']);
          localStorage.removeItem('materials');
          this.rowData = [];
        }
      });
  
    });
  }
}
