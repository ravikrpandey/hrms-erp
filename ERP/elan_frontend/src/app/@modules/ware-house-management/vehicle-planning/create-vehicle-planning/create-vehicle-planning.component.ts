import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from 'src/app/@modules/sales/service/sales.service';
import { InventoryManagementService } from '../../inventory-management.service';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { Location } from '@angular/common';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { MatDialog } from '@angular/material/dialog';
import { RfqDialogComponent } from '../rfq-dialog/rfq-dialog.component';
import { ColDef, FirstDataRenderedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import Swal from 'sweetalert2';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-create-vehicle-planning',
  templateUrl: './create-vehicle-planning.component.html',
  styleUrls: ['./create-vehicle-planning.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateVehiclePlanningComponent implements OnInit {
  priorityList: number[] = [1];
  form: FormGroup;
  formDisabled: boolean = false;
  isMultiple: boolean = true;
  showTransporter: boolean = true;
  transporterList: any[] = [];
  transportedByList: any[] = [];
  transportTypeList: any[] = [];
  vehicleTypes: any[] = [];
  dispatchedSO: any[] = [];
  warehouseList: any = [];
  viaWarehouseList: any = [];
  vehicleCategories: any[] = [];
  entity_id: any;
  financial_year_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  public gridOptions: any = { rowSelection: 'multiple' };
  selectedRows: any[] = [];
  isDeleteButtonVisible: boolean = false;
  getDataPath = (data:any) => {
    if (data.children) {
      return [data.name];
    } else {
      return [data.parent.name, data.rate_agreement_details_id.toString()];
    }
  };
  
  minDate: Date = new Date();
  minDate2: any;
  vpId: any;
  mode: string = 'create';
  vehiclePlan: any;
  typeCode: any;
  mainWarehouseList: any =[];
  selectedSaleOrders: FormControl = new FormControl([]);
  userData: any;

  get saleOrdersArray(): FormArray {
    return this.form.get('saleOrders') as FormArray;
  }

  selectedOption: any;
  isTypeCode: boolean = true;

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private salesService: SalesService,
    private toast: ToastrService,
    private inventoryService: InventoryManagementService,
    private transport_service: TransportManagementService,
    private route: ActivatedRoute,
    private location: Location,
    private crm: CrmService,
    private matDialog: MatDialog,
    private accessData: AccessControlService,
  ) {
    let loginUser = localStorage.getItem('signInUser')!;
    this.userData = JSON.parse(loginUser);

    this.form = this._fb.group({
      mainWarehouseId: [null, Validators.required],
      saleOrderIds: [null, Validators.required],
      saleOrders: this._fb.array([]),

      transported_by_id: [null, Validators.required],
      transportor_id: [null],
      // transportor_mobile: [null],
      vehicle_type_id: ['', Validators.required],
      created_by: [this.userData.employee_id],

      transport_type_id: [],
      gateIn_updated_by: [null],
      gateOut_updated_by: [null],
      gate_inward_status: ['Pending'],
      gate_outward_status: ['Pending'],
      status: ['Pending'],
      gate_inward_date: [null],
      vehicle_root_status: ['DIRECT'],
      // viaAddress:[],
      via_warehouse_id: [],
      // gate_outward_date: [null],
    });

    this.form
      .get('gate_bypass_status')
      ?.valueChanges.subscribe((value: any) => {
        if (value === 'Yes' && this.form.get('status')?.value === 'Approved') {

        } else {
          this.form.get('gate_inward_status')?.setValue('Pending');
          this.form.get('gate_inward_date')?.setValue(null);
          this.form.get('gate_inward_updated_by')?.setValue(null);
          this.form.get('gate_outward_status')?.setValue('Pending');
          this.form.get('gate_outward_date')?.setValue(null);
          this.form.get('gate_outward_updated_by')?.setValue(null);
        }
      });

    this.form.get('saleOrderIds')?.valueChanges.subscribe((ids: any) => {
      const saleOrdersFormArray = this.saleOrdersArray;
      // Clear existing 

      while (saleOrdersFormArray.length !== 0) {
        saleOrdersFormArray.removeAt(0);
      }
      if (ids?.length > 0) {
        let soDatas: any[] = [];
        ids.forEach((id: number) => {
          const soData = this.dispatchedSO.find(
            (value) => value.sales_order_id === id
          );
          if (soData) {
            soDatas.push(soData);
          }
        });
        this.onSaleOrdersChange(soDatas);
        this.priorityList = Array.from({ length: soDatas?.length }, (_, i) => i + 1);
      }
    });
    this.form.get('status')?.valueChanges.subscribe((value: any) => {
      if (
        value &&
        value === 'Approved' &&
        this.form.get('gate_bypass_status')?.value === 'Yes'
      ) {
        this.form.get('gate_inward_status')?.setValue('Approved');
        this.form.get('gate_inward_date')?.setValue(new Date().toISOString());
        this.form.get('gateIn_updated_by')?.setValue(this.userData.employee_id);
      }
    });
  }

  ngOnInit() {
    this.entity_id = this.accessData.getEntityId(); 
    this.financial_year_id = this.accessData.getFinancialId();

    this.getAllWarehouseList();
    this.getAll_vehicleType();

    this.route.queryParams.subscribe((params: any) => {
      this.vpId = params['vpId'];
      this.mode = params['mode'];

      // if (this.mode === "view") {
      //   this.form.disable();
      // }
      if (this.vpId) {
        this.getVpDetails(this.vpId);
      }
    });

    this.getWarehouseList();
    // this.getDispatchedSO();
    this.selectedSaleOrders.valueChanges.subscribe((selectedItems: any[]) => {
      this.onSaleOrdersChange(selectedItems);
    });


    this.getAllTransportedBy(this.entity_id)
    this.getAll_transportType(this.entity_id)
  }

  comparePriority = (a: any, b: any): boolean => {
    return Number(a) === Number(b);
  }

  onPickupDateChange(date: Date) {
    if (!date) return;

    this.minDate2=date;
    const extendedDeliveryDate = new Date(date); 
    extendedDeliveryDate.setDate(extendedDeliveryDate.getDate() + 3);
  
    this.form.patchValue({ pickup_date: date });

    // Apply the same dispatch and expected delivery dates.
    this.saleOrdersArray.controls.forEach(ctrl => {
      ctrl.patchValue(
        { pickup_date: date,expected_delivery_date:extendedDeliveryDate },
        { emitEvent: false }
      );
    });

    this.form.get('transported_by_id')?.reset();
  }

  // get warehouse list according to organization id
  getWarehouseList() {
    this.inventoryService
      .getAllmainWarehouseList(this.entity_id,this.vpId)
      .subscribe((response: any) => {
        this.mainWarehouseList = response.data || [];
      });
  }

  onWarehouseChange(event:any){
    this.form.get('saleOrderIds')?.setValue([]);
    this.getDispatchedSO(event.value);
  }

  rate_agreement_id:any;
  getVpDetails(vpId: string) {
    this.inventoryService.getVehiclePlanById(vpId).subscribe(
      (next: any) => {
        this.vehiclePlan = next.data;

        this.form.patchValue({
          transported_by_id: this.vehiclePlan.transported_by_id,
          transport_type_id: this.vehiclePlan.transport_type_id,
          vehicle_type_id: this.vehiclePlan.vehicle_type_id
        });

        this.rate_agreement_id=this.vehiclePlan?.rate_agreement_id;
        let wh_id = this.vehiclePlan?.saleOrders[0]?.warehouse_id;
        this.form.patchValue({ mainWarehouseId: wh_id });
        this.onWarehouseChange({value:wh_id});

        this.getAllTranspostName(this.vehiclePlan.transported_by_id);

        //let ids: any[] = [];
        setTimeout(() => {
          if (this.vehiclePlan.saleOrders && this.dispatchedSO.length > 0) {
            const selectedItems = this.vehiclePlan.saleOrders
              .map((vpSO: any) => {
                const data = this.dispatchedSO.find(
                  (dso: any) => dso.sales_order_id === vpSO.sale_order_id
                );
                //ids.push(vpSO.sale_order_id);
                return { ...vpSO, ...data, priority: Number(data?.priority ?? vpSO?.priority) || 1};
              })
              .filter((item: any) => item !== undefined);

            this.priorityList = Array.from({ length: selectedItems?.length }, (_, i) => i + 1);
            this.selectedSaleOrders.patchValue(selectedItems);
            //this.form.get('saleOrderIds')?.setValue(ids, { emitEvent: false });

            this.form.patchValue(this.vehiclePlan);
            this.typeCode = this.transportedByList.find(
              x => x.id === this.form.value.transported_by_id
            )?.typeCode;
            
            if (this.typeCode === '3PL') {
              this.isMultiple = true;
            } else {
              this.isMultiple = false;
              // this.form.get('transportor_id')?.patchValue(this.vehiclePlan.transportor_id[0]);
              // this.selectedViaWarehouse(this.form.get('transportor_id')?.value)
            }
            this.showTransporter = false;
            
            setTimeout(() => this.showTransporter = true, 0);
          }
        }, 500);
      },
      (error: any) => { }
    );
  }

  getAllTranspostName(transporter_type_id: any) {
    this.transport_service.getTransporterMasterListByTransporterTypeId(transporter_type_id).subscribe({
      next: (res: any) => {
       this.transporterList = res.data || [];

        if (this.vehiclePlan?.transportor_id?.length) {
          this.form.patchValue({
             transportor_id: this.vehiclePlan.transportor_id.map(Number)
          });
        }
      }
    })
  }

  getAllTransportedBy(entity: any) {
    this.transport_service.getAll_transporterType(entity, 'ACTIVE').subscribe({
      next: (res: any) => {
        
        this.transportedByList = res.data;
      }, error: (err) => {
        
      }
    })
  }

  getAll_transportType(entity: any) {
    this.transport_service.getAll_transportType(entity, 'ACTIVE').subscribe({
      next: (res: any) => {
        
        this.transportTypeList = res.data;
      }, error: (err) => {
       
      }
    })
  }

  createSaleOrderGroup(item: any, index: number): FormGroup {

    const fb = this._fb.group({
      id: [item.id || ''],
      priority: [parseInt(item.priority) || 1, Validators.required],
      sale_order_id: [item.sales_order_id],
      sales_order_no: [item.sales_order_no || '', Validators.required],
      pickup_date: [item.pickup_date || '', Validators.required],
      warehouse_id: [item.warehouse_id || '', Validators.required],
      pickup_address: [item.pickup_address || '', Validators.required],
      pickup_city_id: [item.pickup_city_id || ''],
      delivery_address: [item.address+", "+item.delivery_postal_address+", "+item.pincode || '', Validators.required],
      delivery_city_id: [item.delivery_city_id || ''],
      expected_delivery_date: [item.expected_delivery_date || '',Validators.required],
      company_name: [item.company_name || '', Validators.required],
      quantity: [item.quantity || 0, Validators.required],
      pickup_city_name: [item.pickup_city_name || ''],
      delivery_city_name: [item.delivery_city_name || ''],
    });
    if (this.vpId) {
      fb.get('warehouse_id')?.setValue(item.warehouse_id);
      const warehouse = this.warehouseList.find(
        (value: any) => value.id == item.warehouse_id
      );
      if (warehouse) {
        fb.get('pickup_address')?.setValue(warehouse.address);
      }
    }
    fb.get('warehouse_id')?.valueChanges.subscribe((id: any) => {
      const warehouse = this.warehouseList.find((value: any) => value.id == id);
      if (warehouse) {
        fb.get('pickup_address')?.setValue(warehouse.address);
      }
    });
    return fb;
  }

  onSaleOrdersChange(selectedItems: any[]) {
    this.isTypeCode = true;
    // this.form.get('transported_by_id')?.patchValue(null);
    const saleOrdersFormArray = this.saleOrdersArray;
    // Clear existing controls
    while (saleOrdersFormArray.length !== 0) {
      saleOrdersFormArray.removeAt(0);
    }
    // Add new controls for selected items
    selectedItems.forEach((item, index) => {
      saleOrdersFormArray.push(this.createSaleOrderGroup(item, index));
    });
  }

  getDispatchedSO(mainWarehouseId: any) {
    this.salesService.getDispatchedSOByWareouseId(this.vpId,mainWarehouseId).subscribe(
    // this.salesService.getDispatchedSO(this.vpId).subscribe(
      (response: any) => {
        this.dispatchedSO = response.data || [];

        if (this.vehiclePlan?.saleOrders?.length) {
          const ids = this.vehiclePlan.saleOrders.map(
            (x: any) => x.sale_order_id
          );
          this.form.get('saleOrderIds')?.setValue(ids);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getAll_vehicleType() {
    this.transport_service.getAll_vehicleType(this.entity_id, 'ACTIVE')
      .subscribe(
        (res: any) => {
          if (res) {
            
            this.vehicleTypes = res.data;
          }
        },
        (err: any) => { }
      );
  }

  getAllVehicleCategory() {
    this.transport_service
      .getAll_vehical_category(this.entity_id, this.financial_year_id)
      .subscribe(
        (res: any) => {
          if (res) {
            this.vehicleCategories = res.data;
          }
        },
        (err: any) => { }
      );
  }

  selectWarehouse(data: any) {

    this.form.get('gate_bypass_status')?.patchValue(data?.inOut);
  }

  onCreate() {

    if (this.form.invalid) {
      this.toast.error('Please fill all required fields correctly.');
      return;
    }
    //const formData = this.form.value;
    let error:any
    const salesOrder =this.form.value.saleOrders
    let agreementDetails:any=[];
    if(this.selectedRows.length){

      salesOrder.forEach((elem:any) => {
          let match:boolean=false
            this.selectedRows[0].children.forEach((el:any) => {
              if (
                Number(elem.pickup_city_id) === Number(el.validFromCity_id) &&
                Number(elem.delivery_city_id) === Number(el.validToCity_id) &&
                Number(this.form.value.vehicle_type_id) === Number(el.vehicleType)
              ) {          
              
              match=true;
              agreementDetails.push({
                trip_id:this.selectedRows[0]?.id,
                details_id:el.rate_agreement_details_id
              })
              }
            });
            if (!match) {
              error = true;
            }
          });
          if (error) {
            this.toast.error('Dispatch City, Delivery City, or Vehicle Type mismatch.');
            return;
          }
    }
    
    const formData = {
      ...this.form.value,
      entity_id: this.entity_id,
      financial_year_id: this.financial_year_id,
      rate_agreement:agreementDetails
    };
    if( agreementDetails && agreementDetails.length>0){
      formData.transportor_id = [this.form.value.transportor_id];
    }
// console.log(formData,"_____ABABBABABA");
// return;
    if (this.mode === 'edit') {
      this.inventoryService
        .updateVehiclePlanById(formData, this.vpId)
        .subscribe(
          (response: any) => {
            this.toast.success('Sale Order updated successfully');
            this.router.navigate([
              '/master/warehouse-management/vehicle-planning',
            ]);
          },

          (error: any) => {
            this.toast.error('Error updating Sale Order')
            return;
          }
        );
    } else {
      
      this.inventoryService.createVehiclePlan(formData).subscribe(
        (next) => {
          this.toast.success('Vehicle planning saved successfully.');
          this.router.navigate([
            '/master/warehouse-management/vehicle-planning',
          ]);
        },
        (error) => {
          console.error('Error:', error);
          this.toast.error('Failed to save vehicle planning.');
          return;
        }
      );
    }
  }

  getAllWarehouseList() {
    this.inventoryService
      .getAllNewWarehouseList(this.entity_id, this.financial_year_id)
      .subscribe((response: any) => {
        this.warehouseList = response.data || [];
        this.viaWarehouseList = response.data || [];
      });
  }

  onApprove() { }

  back() {
    this.location.back();
  }

  selectedViaWarehouse(event: any) {
    
    // if (!this.isMultiple) {
      
    //   let vehical_type_id = this.form.get('vehicle_type_id')?.value;
      
    //   const soList = JSON.stringify(this.saleOrdersArray.value);
      
    //   this.transport_service.getsRateAgreementByTransporter(event, vehical_type_id, soList).subscribe({
    //     next: (res: any) => {
    //       if(res?.data){
    //         this.rowData = flattenChildrenRecursively(res.data);
    //         console.log(this.rowData,'========');
    //       }else{
    //         this.rowData=[];
    //       }
    //     }, error: (err) => {
    //       this.rowData=[];
    //     },
    //   })
    // }
  }

  changeSelect(e: any) {
    if (e?.value === 'VIA') {

    } else {

    }
  }

  selectTranpBy(event: any) {

    const soStatus = this.saleOrdersArray.value.some(
      (el: any) => !el.pickup_date
    );

    if (soStatus) {
      this.toast.error('Please select the Dispatch Date first.');
      return;
    }

    const transportorNameCtrl = this.form.get('transportor_name');
    const transportorTypeCtrl = this.form.get('transported_type');
    const vehicleCategoryCtrl = this.form.get('vehicle_category_id');

    this.typeCode = this.transportedByList.find(
      x => x.id === event
    )?.typeCode;

    if (this.typeCode === '3PL') {
      this.isTypeCode = true;
      this.isMultiple = true;
      transportorNameCtrl?.setValue([]);
      transportorNameCtrl?.reset();
      transportorNameCtrl?.clearValidators();

      transportorTypeCtrl?.reset();
      transportorTypeCtrl?.clearValidators();

      vehicleCategoryCtrl?.reset();
      vehicleCategoryCtrl?.clearValidators();

    } else {
      this.isMultiple = false;
      this.isTypeCode = false;
      transportorNameCtrl?.setValue(null);
      transportorNameCtrl?.setValidators([Validators.required]);
      transportorTypeCtrl?.setValidators([Validators.required]);
      vehicleCategoryCtrl?.setValidators([Validators.required]);
    }

    transportorNameCtrl?.updateValueAndValidity();
    transportorTypeCtrl?.updateValueAndValidity();
    vehicleCategoryCtrl?.updateValueAndValidity();

    this.getAllTranspostName(event);
    this.showTransporter = false;
    setTimeout(() => this.showTransporter = true, 0);
  }

  rfqDialog() {
    let formData = this.form.value;
    let dialogRef = this.matDialog.open(RfqDialogComponent, {
      width: "800px",
      height: "300px",
      data: formData
    });
  }

  columnDefs: ColDef[] = [
    // Columns for child rows
    { headerName: 'From City', field: 'validFromCity', flex: 1 },
    { headerName: 'To City', field: 'validToCity', flex: 1 },
    { headerName: 'Rate', field: 'rate', flex: 1 },
    { headerName: 'Extra Charge', field: 'extraCharge', flex: 1 },
    { headerName: 'Remark', field: 'remark', flex: 1 },
    // { headerName: 'Vehicle Type', field: 'vehicleType', flex: 1 },
    // { headerName: 'Valid From', field: 'valid_from', flex: 1 },
    // { headerName: 'Valid To', field: 'valid_to', flex: 1 }
  ];
  autoGroupColumnDef = {
    headerName: 'Agreement',
    minWidth: 500,
    flex: 1,
    valueGetter: (params: any) => params.data.name || '',
    cellRendererParams: {
      suppressCount: true
    },
    checkboxSelection: (params: any) => !params.data.parent, 
  };
  
  // autoGroupColumnDef = {
  //   headerName: 'Agreement',
  //   minWidth: 300,
  //   flex: 1,
  //   valueGetter: (params: any) => {
  //     // Only parent row has `name`, child rows will have undefined
  //     return params.data.name || '';
  //   },
  //   cellRendererParams: {
  //     suppressCount: true
  //   }
  // };
  frameworkComponents:any;

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.addEventListener(
      'selectionChanged',
      this.onSelectionChanged.bind(this)
    );
  
  }
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.forEachNode((node) => {
      // select only parent rows
      
      if (node.data?.id==this.rate_agreement_id) {
        node.setSelected(true);
      }
    });
  }
  
  onSelectionChanged(event: any) {
    
    this.selectedRows = event.api.getSelectedRows();
    // this.isDeleteButtonVisible = this.selectedRows.length > 0;
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

  viewItemDetails(items: any): void {
    const data = items.value;
    this.salesService.getSOByid(data.sale_order_id).subscribe((res: any) => {
      const obj = res.data?.productDetailList || [];
      const getChildItems = (parentId: number) =>
        obj.filter((x: any) => x.parent_item_id === parentId);

      let tableRows = '';

      obj.filter((x: any) => !x.parent_item_id)
        .forEach((item: any, index: number) => {

          // Parent Row
          tableRows += `
            <tr class="parent-row">
                <td>${index + 1}</td>
                <td class="parent-name">${item.item_name || ''}${item.item_code ? ' - ' + item.item_code : ''}</td>
                <td>${item.item_description || ''}</td>
                <td>
                    <span class="type-standard">
                        ${item.item_type || ''}
                    </span>
                </td>
                <td>${item.hsncode || ''}</td>
                <td class="qty">
                    ${item.qty || 0} ${item.UOM || ''}
                </td>
            </tr>
          `;

          // Child Rows
          const childs = getChildItems(item.id);

          childs.forEach((child: any, childIndex: number) => {

            tableRows += `
              <tr class="child-row">
                  <td class="tree-column">
                      <div class="tree-wrapper">
                          <span class="tree-line"></span>
                          ${
                            childIndex === childs.length - 1
                              ? `<span class="tree-end"></span>`
                              : `<span class="tree-mid"></span>`
                          }
                      </div>
                  </td>
                  <td class="child-name">
                      <span class="arrow">↳</span>
                      ${child.item_name || ''}${child.item_code ? ' - ' + child.item_code : ''}
                  </td>
                  <td>${child.item_description || ''}</td>
                  <td>${child.item_type || ''}</td>
                  <td>${child.hsncode || ''}</td>
                  <td>${child.qty || 0} ${child.UOM || ''}</td>
              </tr>
            `;
          });
        });

      Swal.fire({
        width: '95%',
        padding: 0,
        heightAuto: false,
        position: 'top',
        showConfirmButton: false,
        showCloseButton: true,
        customClass: {
          popup: 'so-popup',
          closeButton: 'so-close'
        },
        html: `
      <div class="so-header">
        <div class="header-left">
          <div><h2>SO Number : ${data.sales_order_no}</h2></div>
        </div>
      </div>

      <div class="so-title">SO Item Details</div>
      <div class="table-box">
          <div class="table-responsive">
              <table class="so-table">
                  <thead>
                      <tr>
                        <th width="80">S.No.</th>
                        <th>Item Name</th>
                        <th>Item Description</th>
                        <th width="150">Item Type</th>
                        <th width="140">HSN Code</th>
                        <th width="130">Quantity</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${tableRows}
                  </tbody>
              </table>
          </div>
      </div>
  `
      });
    });
  }
  
}

const flattenChildrenRecursively = (
  data: any,
  parent = null,
  childHierachy: any = null
) => {
  let newData: any = [];

  if (data) {
    data.forEach((initialRow: any) => {
      let parentHierachy: any = [];
      initialRow.hierachy = parentHierachy;

      if (parent) {
        initialRow.parent = parent;
        parentHierachy = [...childHierachy];
        initialRow.hierachy = parentHierachy;
      }
      parentHierachy.push(initialRow.name);

      newData.push(initialRow);

      if (initialRow.children) {
        newData = [
          ...newData,
          ...flattenChildrenRecursively(
            initialRow.children,
            initialRow,
            parentHierachy
          ),
        ];
      }
    });
  }

  return newData;
};