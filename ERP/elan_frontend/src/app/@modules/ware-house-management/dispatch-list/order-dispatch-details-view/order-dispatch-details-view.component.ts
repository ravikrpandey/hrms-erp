import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { CommonService } from 'src/app/@shared/services/common.service';
import { DispatchedService } from 'src/app/@shared/services/warehouse/dispatched.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';

@Component({
  selector: 'app-order-dispatch-details-view',
  templateUrl: './order-dispatch-details-view.component.html',
  styleUrls: ['./order-dispatch-details-view.component.scss']
})
export class OrderDispatchDetailsViewComponent  implements OnInit {
  frmDispatch:FormGroup;
  proposalTypeList: any = ["GST", "NON GST"];
  gstTypeList: any = ["CGST/SGST", "IGST"];
  isDiscountRequired: boolean = false;
  isDiscountApproved: boolean = false;
  warehouseList:any[]=[];
  blockList:any[]=[];
  bayList:any[]=[];
  rackList:any[]=[];
  productData: any=[];
  cetegory: any=[];
  productVariantData: any=[];
constructor(private router:Router ,private _fb:FormBuilder,private dispatchedService:DispatchedService,
  private _active:ActivatedRoute,private $crm : CrmService,private _toaster:ToastrService,
  private $common:CommonService,private _configurationalMasterService:ConfigurationalmasterService,
  private $productionService:ProductionService){

  this.frmDispatch=_fb.group({
    do_date:new FormControl(''),
    customer_name:new FormControl(''),
    do_number:new FormControl(''),
    billing_address:new FormControl(''),
    shipping_address:new FormControl(''),
    order_number:new FormControl(''),
    notes:new FormControl(''),
    terms_and_conditions:new FormControl(''),
    company_name:new FormControl(''),
    in_status:new FormControl(''),
    warehouse:new FormControl(''),
    vehicle_type:new FormControl(''),
    vehicle_number:new FormControl(''),

    productDetailList: new FormArray([
      new FormGroup({
        id: new FormControl(null),
        product_master_id: new FormControl(null),
        product_category_id: new FormControl(null),
        variant_id: new FormControl(null),
        // product_varient_list: new FormControl([]),
        product_code: new FormControl(null),
        product_description: new FormControl(null),
        uom_name: new FormControl(null),
        uom_id: new FormControl(null),
        qty: new FormControl(null),
        price_per_unit: new FormControl(null),
        gst_type: new FormControl(null),
        cgst: new FormControl(null),
        sgst: new FormControl(null),
        igst: new FormControl(null),
        // maximum_discount: new FormControl(null),
        // discount_approved: new FormControl(null),
        // discount_request: new FormControl(null),

      }),
    ]),
  })

}
proposal_id:any;
frmReadOnly:boolean=false;
entityId: string | null;
formDisabled:boolean=false;
financial_year_id: string | null;
ngOnInit(): void {

  this.entityId = localStorage.getItem('selectedEntityId');
  this.financial_year_id = localStorage.getItem('financial_id');
  this.getAllCategory();
  this._active.queryParams.subscribe((res:any)=>{
    this.proposal_id=res.sales_id;

    let status = res.sales_id.split('_');
    if(status[0]==="view"){
      this.frmReadOnly=true;

    }
   if(res.sales_id){
    this.getsalesOrderListByid(status[1])
   }


  })
  this.getAllproduct();
  // this.proposalVersionListById()


}

handleShowHide(data: any) {

    this.isDiscountRequired = true;
    this.isDiscountApproved = true;

}
getAllProductDetails:any=[]

rackDetails:any=[];
getsalesOrderListByid(id:any){
  this.dispatchedService.getDispachedOrderDetails(id).subscribe((res:any)=>{

     let obj=res.data
     this.getAllProductDetails=obj?.productDetailList

   if(res){
     setTimeout(() => {
      this.setAllData(obj)
      // this.getWarehouseList(this.getAllProductDetails)
     }, 100);


this.rackDetails=res.data.wData;
    this.frmDispatch.patchValue({
      customer_name:res.data.contact_person_name,
      do_number:res.data.proposal_no,
      company_name:res.data.company_name,
      warehouse:res.data.warehouse?.WAREHOUSE_MASTER?.name,
      vehicle_type:res.data.wData[0].vehicle_type,
      vehicle_number:res.data.wData[0].vehicle_number,
    })

   }


  })
}


get CF_1(): any {
  return this.frmDispatch.controls;
};

addrow() {

  <FormArray>this.CF_1.productDetailList.push(
    new FormGroup({
      product_master_id: new FormControl(null),
      variant_id: new FormControl(null),
      product_varient_list: new FormControl([]),
      product_code: new FormControl(null),
      product_description: new FormControl(null),
      uom_name: new FormControl(null),
      uom_id: new FormControl(null),
      qty: new FormControl(null),
      price_per_unit: new FormControl(null),
      cgst: new FormControl(null),
      gst_type: new FormControl(null),
      sgst: new FormControl(null),
      igst: new FormControl(null),
      maximum_discount: new FormControl(null),
      discount_approved: new FormControl(null),
    }),
  );


}

deleteRow(i: any, control: any) {
  if (this.CF_1.productDetailList.length >= 1) {
    this.CF_1.productDetailList.removeAt(i);
  } else {
    // this.toast.error('must be one', "Can't Deleted!");
  }
}

patchData(e: any): FormArray {
  return new FormArray(
    e.map((x: any, index: any) => {
      this.getAllActiveProduct(x?.product_category_id, index);
      this.getAllProductVariant(x?.product_id??x?.product_master_id, index);

      const defaultControls = {
        variant_id: null,
        qty: null,
        gst_type: null,
        cgst: null,
        sgst: null,
        igst: null,
        discount_approved: null,
        discount_request: null,
        readonly: false,
      };

      const mergedData = { ...defaultControls, ...x };

      // Create a new FormGroup
      const obj = new FormGroup({});

      Object.keys(mergedData).forEach((k) => {
        if (k === 'product_id') {
          obj.addControl('product_master_id', new FormControl(mergedData[k]));
        }
        else if(k=='id'){
          obj.addControl('id', new FormControl(null));
        }
          else {
          obj.addControl(k, new FormControl(mergedData[k]));
        }

      });

      obj.addControl(
        'product_code',
        new FormControl(x?.MASTER_PRODUCT?.product_code??x?.product_code)
      );
      obj.addControl(
        'product_description',
        new FormControl(x?.MASTER_PRODUCT?.product_description??x?.product_description)
      );
      obj.addControl(
        'price_per_unit',
        new FormControl(x?.MASTER_PRODUCT?.product_list_price || null)
      );
      obj.addControl(
        'maximum_discount',
        new FormControl(x?.MASTER_PRODUCT?.maximum_discount || null)
      );
      obj.addControl(
        'uom_name',
        new FormControl(x?.MASTER_PRODUCT?.MASTER_UOM?.uom_name || null)
      );

      return obj;
    })
  );
}

productList: any = [];
getAllproduct() {
  try {
    this.$crm.getAllproduct().subscribe((response: any) => {
      if (response) {
        this.productList = response.data;
      }
    }, (err:any) => {
      console.log(err);
    })
  } catch (error) {
    console.log(error);
  }
}

selectProduct(data: any, index: any) {
  let currentList = this.frmDispatch?.value?.productDetailList;
  let productObj = this.productList?.find((elem: any) => elem?.id == data);

  // varient list create start
  let tempList = [...this.productList];
  let productVarientList: any = [];
  tempList?.map((item: any) => {
    if (item?.id == data) {
      productVarientList = item?.product_variant_masters;
    }
  })

  currentList[index] = {
    ...currentList[index],
    product_master_id: productObj?.id,
    // variant_id: productObj?.variant_id,
    product_code: productObj?.product_code,
    product_varient_list: productVarientList,

    // variant_id: '',
    product_description: '',
    uom_name: '',
    uom_id: '',
    price_per_unit: '',
  }
  this.frmDispatch.patchValue({
    productDetailList: currentList,
  });

}

generateProductVarient(data: any, index: any) {
  let currentList = [...this.frmDispatch?.value?.productDetailList];

  // Varient object generate start
  let varientObj: any = {};
  this.productList?.map((item: any) => {
    item?.product_variant_masters?.map((subItem: any) => {
      if (subItem?.id == data) {
        varientObj = subItem;
      }
    })
  })
  // Varient object end

  // handle duplicate entry start
  let isDuplicate = true;
  if (currentList?.length > 1) {
    let newList = currentList.slice();
    if (currentList && currentList.length > 1) newList.splice(index, 1)
    newList?.map((item: any) => {
      if (item.variant_id == data) {
        isDuplicate = false;
        // this.toast.error('This variant has been already added.')
      };
    });
  }
  // handle duplicate entry end

  currentList[index] = {
    ...currentList[index],
    variant_id: isDuplicate ? varientObj?.id : '',
    product_description: isDuplicate ? varientObj?.product_description : '',
    uom_name: isDuplicate ? varientObj?.tbl_uom?.uom_name : '',
    uom_id: isDuplicate ? varientObj?.uom_id : '',
    price_per_unit: isDuplicate ? varientObj?.price_per_unit : '',
    maximum_discount: isDuplicate ? varientObj?.maximum_discount : '',
  }
  this.frmDispatch.patchValue({
    productDetailList: currentList,
  });
  this.productColculation();
}

productColculation() {
  let formObj = this.frmDispatch?.value;
  let currentList = this.frmDispatch?.value?.productDetailList;
  if (currentList?.length) {
    let total_cost = 0;
    let taxable_value = 0;
    let discount = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    let grant_total = 0;

    currentList?.map((item: any) => {
      if (item?.qty) {
        total_cost = total_cost + (item?.qty * item?.price_per_unit);
      }
      else {
        total_cost = total_cost + Number(item?.price_per_unit);
      }

      if (item?.discount_approved) {
        discount = discount + (item?.qty ? item?.qty * item?.price_per_unit * item?.discount_approved / 100 : item?.price_per_unit * item?.discount_approved / 100);
      }
      else {
        discount = discount + (item?.qty ? item?.qty * item?.price_per_unit * item?.maximum_discount / 100 : item?.price_per_unit * item?.maximum_discount / 100);
      }

      if (item?.gst_type == 'CGST/SGST') {
        cgst = cgst + (item?.qty * item?.price_per_unit * item?.cgst / 100);
        sgst = sgst + (item?.qty * item?.price_per_unit * item?.sgst / 100);
      }
      else {
        igst = igst + (item?.qty * item?.price_per_unit * item?.igst / 100);
      }
    })
    taxable_value = taxable_value + (total_cost + Number(formObj?.additional_charges)) - discount;
    grant_total = taxable_value + cgst + sgst + igst;
    this.frmDispatch.patchValue({
      total_cost: total_cost?.toFixed(2),
      discount: discount.toFixed(2),
      taxable_value: taxable_value.toFixed(2),
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      igst: igst.toFixed(2),
      grant_total: grant_total.toFixed(2)
    });
  }
}
// Product colculation end

// to restrict user from entering strings
keyPress(event: Event | any) {
  const pattern = /[0-9\+\-\ ]/;
  let inputChar = String.fromCharCode(event.charCode);
  if (event.keyCode != 8 && !pattern.test(inputChar)) {
    event.preventDefault();
  }
}

selectGstType(index: any) {
  let currentList = this.frmDispatch?.controls?.["productDetailList"]?.value;
  currentList[index] = {
    ...currentList[index],
    cgst: null,
    sgst: null,
    igst: null,
  }
  this.frmDispatch.patchValue({
    productDetailList: currentList,
  });
  this.frmDispatch.patchValue({
    cgst: 0,
    sgst: 0,
    igst: 0,
  });
}


setAllData(obj: any) {
  
  // handle variant start
  let productDetailList = obj?.productDetailList;
  if (productDetailList) {
    this.productList?.map((item: any) => {
      productDetailList?.map((subSubItem: any) => {
        if (subSubItem?.product_master_id == item?.id) {
          console.warn(subSubItem, 'ggg');

          subSubItem.product_varient_list = item.product_variant_masters;
        }
      });
    });
    this.CF_1.productDetailList = this.patchData(productDetailList);
  }

  // handle variant end
  this.frmDispatch.patchValue({
    proposal_type: obj?.proposal_type,
    company_name: obj?.company_name,
    customer_name: obj?.contact_person_name,
    contact_number: obj?.contact_number,
    mail_id: obj?.mail_id,
    address: obj?.address,
    gst_no: obj?.gst_no,
    do_date: obj?.do_date,
    billing_address: obj?.billing_address,
    shipping_address: obj?.shipping_address,
    order_number: obj?.order_number,
    total_cost: obj?.total_cost,
    additional_charges: obj?.additional_charges ? obj?.additional_charges : 0,
    discount: obj?.discount,
    taxable_value: obj?.taxable_value,
    sgst: obj?.sgst,
    cgst: obj?.cgst,
    igst: obj?.igst,
    do_number: obj?.order_number,
    grant_total: obj?.grant_total,
    notes: obj?.notes,
    terms_and_conditions: obj?.terms_and_conditions,
    vehicle_number: obj?.vehicle_number,
    vehicle_type: obj?.vehicle_type,
  });
  this.frmDispatch.patchValue({ total_cost: obj?.total_cost })

  this.frmDispatch.patchValue({ proposal_no: obj?.proposal_no })

}
imageToUpload: any;
imageUrl:any
imagePath: any;
uploadDoc(evemt: any) {
  let isValidExtension = this.$common.checkForValidFile(evemt);
  if (!isValidExtension) return

  let data = "";
  if (evemt.target.files && evemt.target.files[0]) {
    data = evemt.target.files[0];
  }

  var formData: any = new FormData();
  formData.append('file', data);
  this.$crm.uploadDoc(formData).subscribe(
    (res: any) => {
      this.imageUrl = res?.backendUrl;
      // this.handleViewImg = false;
    },
    (err:any) => {
      if (err.status == 400) {
        this._toaster.error('Something went Wrong');
      } else if (err.status == 403) {
        this._toaster.error('Achievements Already Exits!');
      }
      else {
        this._toaster.error('Something went Wrong');
      }
    }
  );
}


ngSubmitform(data:any){
  console.warn(data,'ddd');
     if(this.frmDispatch.invalid){
      return this._toaster.error('Mendatory fields should not be empty!!')
     }

   let addDO={
    ...data,
    proposal_id:this.proposal_id,
    upload_file:this.imageUrl,
    do_date:moment(data.do_date).format('YYYY-MM-DD')
   }

  this.dispatchedService.createDispatch(addDO).subscribe((res:any)=>{
    if(res){
      this._toaster.success(res.message)
      this.router.navigate(['/master/warehouse-management/dispatch-list'])
    }
  },(err:any)=>{
    this._toaster.error(err.error.message)
  })

}


getWarehouseList(data:any){


  let product = JSON.stringify(data);
  this.dispatchedService.getWarehouseByProductQuantity(product).subscribe({
    next:(value:any) =>{

      console.log(value);
      this.warehouseList = value.data;
    },error(err:any) {
      console.log(err);
    },
  })
}
selectedMode: any;
selectedRadio() {
  const inStatus = this.frmDispatch.get('in_status')?.value;

 this.warehouseList =  this.warehouseList.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const timeA = isNaN(dateA.getTime()) ? Infinity : dateA.getTime();
    const timeB = isNaN(dateB.getTime()) ? Infinity : dateB.getTime();

    return inStatus === 'firstIn' ? timeA - timeB : timeB - timeA;
  });

}
getAllCategory() {
  this.$productionService.getAllCetegory(this.entityId).subscribe((res: any) => {
    this.cetegory = res.data;

  })
}
getAllProductVariant(data:any,index:any){
  this._configurationalMasterService.getProductVariantByproduct_id(data?.value??data).subscribe((res:any)=>{
    if(res){
      this.productVariantData[index]=res.data;
    }
  },(err:any)=>{

  })
}

bindProductData(index:any){
  let productDetailList = this.frmDispatch.get('productDetailList') as FormArray;
  let product_id = productDetailList.value[index]?.product_master_id;
  let data = this.productData[index].filter((res: any) => res.id == product_id);

  if (data && data.length > 0) {
    const product = data[0];
    productDetailList.at(index).patchValue({
      product_description: product.product_description,
      product_code: product.product_code
    });
  }

}
getAllActiveProduct(event: any,index:any) {
  this.$productionService.getAllActiveProduct(event.value??event,this.entityId).subscribe((res: any) => {
    this.productData[index] = res.data
  })
}
}
