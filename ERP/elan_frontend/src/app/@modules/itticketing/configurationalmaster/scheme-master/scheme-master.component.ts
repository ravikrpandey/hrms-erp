import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';

@Component({
  selector: 'app-scheme-master',
  templateUrl: './scheme-master.component.html',
  styleUrls: ['./scheme-master.component.scss']
})
export class SchemeMasterComponent {
  regionForm:FormGroup;
  id:any;
  getData: any;
  entity_id: any;
  fileArray: any;
  fileGetCheck: any;
  productData: any[][] = []
  paramsType: any;
  cetegory: any;
  productDataPromo: any[][] = [];
  maxQuantity: number = 0;
  onItemType:boolean=true;
  onQuontityType:boolean=false;
  onPriceType:boolean=false;
  constructor(
    // private dialog: MatDialogRef<SchemeMasterComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private $productionService: ProductionService,
    private recruitService:RecruitService,
    private activeroute:ActivatedRoute,
    private location: Location,

    private _configurationalmasterService: ConfigurationalmasterService,private _fb:FormBuilder,private route:Router,private toaster:ToastrService
  ) {
    // this.id = data.id;
    // this.mode = data.mode;
    this.regionForm=this._fb.group({
      add_scheme:new FormControl(null,[Validators.required]),
      description:new FormControl(null,[Validators.required]),
      start_date:new FormControl(null),
      end_date:new FormControl(null),
      po_attached_doc:new FormControl(null),
      scheme_type:new FormControl(null),
      selectedType:new FormControl(null),
      quontity:new FormControl(null),
      price_scheme:new FormControl(null),
      productDetailListOut: new FormArray([
        new FormGroup({
          product_category_id:new FormControl(null),
          product_sub_category_id:new FormControl(null),

           product_master_id: new FormControl(null),
          qty: new FormControl(null),
          

        }),
      ]),
      productDetailPromo: new FormArray([
        new FormGroup({
          product_category_id_promo:new FormControl(null),
          product_sub_category_id_promo:new FormControl(null),
          promo_item:new FormControl(null),
          promoQty:new FormControl(null),
          price_amount_promo:new FormControl(null)

        }),
      ]),
    })
  }
  mode:any;
  ngOnInit() {
    this.activeroute.queryParams.subscribe((params: any) => {
      console.log(params,"params");
      
      this.paramsType = params.mode;
      this.id = params.id;
      // if ( this.paramsType == "view" ) this.isDisabled = true;
    });
    if(this.id){
      this.getByIdRole();
    }
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.getAllItem();
  this.getAllCategory();
  this.regionForm.patchValue({
    selectedType:'item'
  })
  }

  getAllItem() {
    // this._configurationalmasterService.getAllItem().subscribe((res: any) => {
    //   this.productData = res.data.reverse();

    // })
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  getVal(event:any){
  }

  get CF_1(): any {
    return this.regionForm.controls;
  }

  addrowOut() {
    <FormArray>this.CF_1.productDetailListOut.push(
      new FormGroup({
        product_category_id:new FormControl(null),
        product_sub_category_id:new FormControl(null),
        product_master_id: new FormControl(null),
        qty: new FormControl(null),
      
      })
    );
  }
  addrowPromo() {
    <FormArray>this.CF_1.productDetailPromo.push(
      new FormGroup({
      
        product_category_id_promo:new FormControl(null),
        product_sub_category_id_promo:new FormControl(null),
        promo_item:new FormControl(null),
        promoQty:new FormControl(null)
      })
    );
  }


  onChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imagePath = file.type === 'application/pdf' ? "/assets/icons/pdfimg.png" : e.target.result;
        this.fileArray.imagePath = imagePath;
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      console.log(file, 'file');
      this.fileGetCheck = formData;
      formData.append('file', file);

      this.recruitService.uploaddocumentsUpdate(formData).subscribe((res: any) => {
        this.toaster.success("File Uploaded Successfully");
        this.fileArray = res?.url;
        // this.fileArray[index].url_name = file?.name;

      }, (err: any) => {
        this.toaster.error(`${err?.error?.message}`);
      });
    }
  }
  submitData(data:any){
    const controls = this.regionForm?.get('productDetailListOut') as FormArray;
    const controlsPromo = this.regionForm?.get('productDetailPromo') as FormArray;

    console.log(controls,'control');
let val=this.regionForm.value;
 console.log(val,"val<<<<<<<");
 
    // if(this.regionForm.invalid){
    //   return
    // }
    let dataModify={
      scheme_name:data?.add_scheme,
      description:data?.description
    }
    const modifyData:any =[]
    controls?.value?.forEach((item:any)=>{
      modifyData.push({
        selected_qty:item?.qty,
        selected_item_id:item?.product_master_id,
        selected_category_id:item?.product_category_id,
        selected_subcat_id:item?.product_sub_category_id
      })
    })
    const modifyDataPromo:any =[]
    controlsPromo?.value?.forEach((item:any)=>{
      modifyDataPromo.push({
        promo_category_id:item?.product_category_id_promo,
        promo_subcat_id:item?.product_sub_category_id_promo,
        promo_qty:item?.promoQty,
        promo_item_id:item?.promo_item,
        price_amount_promo:item?.price_amount_promo
      })
    })

    let dataNew={
      scheme_name:data?.add_scheme,
      description:data?.description,
      start_date:moment(val?.start_date).format('YYYY-MM-DD'),
      end_date:moment(val?.end_date).format('YYYY-MM-DD'),
      selected_item:modifyData,
      promo_item:modifyDataPromo,
      documents:this.fileArray || this.getData?.documents,
      no_of_select_item:val?.scheme_type,
      number_of_qty:val.quontity || null,
      scheme_type:val.selectedType,
      price_scheme:val?.price_scheme || null
    }
    console.log(dataNew,"<<<<<<<<<<<<<<<")
    if(this.id){
    this._configurationalmasterService.updateScheme(this.id, dataNew).subscribe(
      (res: any) => {
        // if (res.message == "Region Already Exists!") {
        //   this.toaster.warning('Region Already Exists!');
        // }
        // else {
          this.toaster.success('Scheme Update Successfully');
    this.route.navigate(['/master/configurational-master/scheme-master/scheme-list'])
        
        // }
      }, (err: any) => {
        this.toaster.error(err.error.message)
        // if (err.status == 400) {
        //   this.toaster.error('Something went Wrong!');
        // } else if (err.status == 409) {
        //   this.toaster.error('Region Already Exists!');
        // } else {
        //   this.toaster.error('Error in submission!');
        // }
      });
    }
    else{
      this._configurationalmasterService.createScheme(dataNew).subscribe(
        (res: any) => {
          // if (res.message == "Leave Type is Already Exits!") {
          //   this.toaster.warning('Region Already Exits!');
          // }
          // else {
            this.toaster.success('Scheme Added Successfully');
            this.route.navigate(['/master/configurational-master/scheme-master/scheme-list'])

          // }
        },
        (err: any) => {
          this.toaster.error(err.error.message)
          // if (err.status == 400) {
          //   this.toaster.error('Something went Wrong!');
          // } else if (err.status == 201) {
          //   this.toaster.error('Region Already Exits!');
          // } else {
          //   this.toaster.error('Error in submission!');
          // }
        }
      );
    }
  }

  schemeType(e:any){
    console.log(e.value);
    const controls = this.regionForm?.get('productDetailListOut') as FormArray;
    console.log(controls.value,'control');
    let leng=controls.value?.length;
    console.log(leng,"leng<<<<<<<<<<");
    
    this.maxQuantity = leng;
    this.regionForm.get('scheme_type')?.setValidators([
      Validators.required,
      Validators.max(this.maxQuantity)
    ]);
  }
  onQuantityInput() {
    const qtyCtrl = this.regionForm.get('scheme_type');
    if (qtyCtrl && qtyCtrl.value > this.maxQuantity) {
      qtyCtrl.setValue(this.maxQuantity);
    }
  }
  getByIdRole() {
    this._configurationalmasterService.getByIdScheme(this.id).subscribe((res: any) => {
      this.getData = res.data;
    this.CF_1.productDetailListOut = this.patchData(res?.data);
    this.CF_1.productDetailPromo = this.patchDataPromo(res?.data);

      this.regionForm.patchValue({
        add_scheme:this.getData?.scheme_name,
        description:this.getData?.description,
        start_date:this.getData?.start_date,
        end_date:this.getData?.end_date,
        scheme_type:Number(this.getData?.no_of_select_item),
        selectedType:this.getData?.scheme_type,
        quontity:this.getData?.selected_item[0]?.selected_number_of_qty,
        price_scheme:this.getData?.selected_item[0]?.selected_price_scheme
       })
       if(this.getData?.scheme_type === "item"){
        this.onItemType=true;
        this.onQuontityType=false;
        this.onPriceType=false;
        
       }else if(this.getData?.scheme_type === "price"){
        this.onPriceType=true;
        this.onItemType=false;
        this.onQuontityType=false;
       }
       else{
        this.onItemType=false;
        this.onQuontityType=true;
        this.onPriceType=false;

       }
    });
  }
  subCategory: any[][] = [];
  subCategoryPromo:any[][]=[];
getSubCategory(event: any, index: number): void {
  const categoryId = event?.value ?? event;

  this._configurationalmasterService.getSubCategory(categoryId).subscribe((res: any) => {
    this.subCategory[index] = res?.data || [];
   

  });
}


getSubCategoryPromo(event: any, index: number): void {
  const categoryId = event?.value ?? event;

  this._configurationalmasterService.getSubCategory(categoryId).subscribe((res: any) => {
  
    this.subCategoryPromo[index] = res?.data || [];

  });
}
  getAllCategory() {
    this._configurationalmasterService.getActiveAssetMasterList()
      .subscribe((res: any) => {
        this.cetegory = res.data;
      });
  }
  getAllActiveProduct(subCategory: any, category: any, index: number): void {
    console.log(subCategory);
    console.log(category);
    console.log(index);
  
    const subCategoryId = subCategory?.id ?? subCategory;
    const categoryId = category?.item_category_id ?? category;
  
    this.$productionService.getItemsBySubCategory(subCategoryId, categoryId).subscribe((res: any) => {
      this.productData[index] = res?.data || [];
   
    });
  }
  getAllActiveProductPromo(subCategory: any, category: any, index: number): void {
    console.log(subCategory);
    console.log(category);
    console.log(index);
  
    const subCategoryId = subCategory?.id ?? subCategory;
    const categoryId = category?.item_category_id ?? category;
  
    this.$productionService.getItemsBySubCategory(subCategoryId, categoryId).subscribe((res: any) => {
     
      this.productDataPromo[index] = res?.data || [];

    });
  }
  getProductData(data: any, index: any) {
    
    console.log(data);
    let currentList = this.CF_1.productDetailListOut.value
        console.log(currentList);
    
        const isDuplicate = currentList?.some((item: any, i: number) =>
        i !== index && 
        data?.asset_id === item?.product_category_id &&
        data?.sub_category_id === item?.product_sub_category_id &&
        data?.id === item?.product_master_id
      );
    
      if (isDuplicate) {
        this.toaster.warning("Item Already Selected");
        this.CF_1.productDetailListOut.at(index)?.patchValue({ product_master_id: null });
        return;
      }
    
        
        
        // this.CF_1.productDetailList.at(index)?.patchValue({
        //   name_product:data?.product_name,
        //   uom_name: data?.MASTER_UOM?.uom_name,
        //   uom_id: data?.uom_id, igst: data?.igst,
        //   product_code: data?.product_code, product_description: data?.product_description, price_per_unit: data?.product_list_price, hsn_code_id: data?.hsn_code_id
        // });
      }

      getProductDatappromo(data: any, index: any) {
        
        console.log(data);
        let currentList = this.CF_1.productDetailPromo.value
            console.log(currentList);
        
            const isDuplicate = currentList?.some((item: any, i: number) =>
            i !== index && 
            data?.asset_id === item?.product_category_id_promo &&
            data?.sub_category_id === item?.product_sub_category_id_promo &&
            data?.id === item?.promo_item
          );
        
          if (isDuplicate) {
            this.toaster.warning("Item Already Selected");
            this.CF_1.productDetailPromo.at(index)?.patchValue({ promo_item: null });
            return;
          }
        
          const controlsPromo = this.regionForm?.get('productDetailPromo') as FormArray;
          const control = controlsPromo.at(index) as FormGroup;
        
          // 🔽 Add 'price_amount' control if it doesn't exist
          if (!control.get('price_amount_promo')) {
            control.addControl('price_amount_promo', new FormControl(null));
          }
        
          // 🔽 Patch the price_amount from selected promo item
          if (data?.product_list_price !== undefined) {
            control.patchValue({ price_amount_promo: data?.product_list_price });
          }
        
          console.log('Updated Promo Control:', control?.value);
            
            // this.CF_1.productDetailList.at(index)?.patchValue({
            //   name_product:data?.product_name,
            //   uom_name: data?.MASTER_UOM?.uom_name,
            //   uom_id: data?.uom_id, igst: data?.igst,
            //   product_code: data?.product_code, product_description: data?.product_description, price_per_unit: data?.product_list_price, hsn_code_id: data?.hsn_code_id
            // });
          }
  cancel(){
    this.route.navigate(['/master/configurational-master/scheme-master/scheme-list'])

  }
  patchData(e: any): FormArray {
  return new FormArray(
      e?.selected_item?.map((x: any, index: any) => {
        
        this.getSubCategory(x?.selected_category_id, index);
        this.getAllActiveProduct(x?.selected_subcat_id, x?.selected_category_id, index);
        const defaultControls:any = {
          product_category_id:x?.selected_category_id,
          // product_master_id: x?.selected_item_id || null,
          qty: x?.selected_qty || null,
         
        
        };
  
        const obj = new FormGroup({});
  
        Object.keys(defaultControls).forEach(key => {
          obj.addControl(key, new FormControl(defaultControls[key]));
        });
  
        obj.addControl('id', new FormControl(x?.id || null));
        obj.addControl(
          'product_sub_category_id',
          new FormControl(x?.selected_subcat_id)
        );
        obj.addControl(
          'product_master_id',
          new FormControl(x?.selected_item_id)
        );
        return obj;
      // }
  
      })
    );
  }

  patchDataPromo(e: any): FormArray {
    return new FormArray(
        e?.promo_item?.map((x: any, index: any) => {
          this.getSubCategoryPromo(x?.promo_category_id, index);
          this.getAllActiveProductPromo(x?.promo_subcat_id, x?.promo_category_id, index);
          const defaultControls:any = {
            product_category_id_promo:x?.promo_category_id,
            // promo_item:x?.promo_item_id,
            promoQty:x?.promo_qty
           
          
          };
    
          const obj = new FormGroup({});
    
          Object.keys(defaultControls).forEach(key => {
            obj.addControl(key, new FormControl(defaultControls[key]));
          });
    
          obj.addControl('id', new FormControl(x?.id || null));
          obj.addControl(
            'product_sub_category_id_promo',
            new FormControl(x?.promo_subcat_id)
          );
          obj.addControl(
            'promo_item',
            new FormControl(x?.promo_item_id)
          );
          return obj;
        // }
    
        })
      );
    }

    deleteRow(i: any, control: any) {

      if (this.CF_1.productDetailListOut.length >= 1) {
        // this.productCalculation();
        const controls = this.regionForm?.get('productDetailListOut') as FormArray;
        console.log(control,'control');
        
        this.CF_1.productDetailListOut.removeAt(i);
          
      } else {
        this.toaster.error('must be one', "Can't Deleted!");
      }
    }

    deleteRowPromo(i: any, control: any) {

      if (this.CF_1.productDetailPromo.length >= 1) {
        // this.productCalculation();
        const controls = this.regionForm?.get('productDetailPromo') as FormArray;
        console.log(control,'control');
        
        this.CF_1.productDetailPromo.removeAt(i);
          
      } else {
        this.toaster.error('must be one', "Can't Deleted!");
      }
    }

    arayEmpty(e:any){
      console.log(e.target.value, "eeeeeeee");
      if(e.target.value === "item"){
this.onItemType=true;
this.onQuontityType=false;
this.onPriceType=false;

      }else if(e?.target?.value === "price"){
        this.onPriceType=true;
        this.onItemType=false;
this.onQuontityType=false;
      }
      else{
this.onQuontityType=true;
this.onItemType=false;
this.onPriceType=false;

      }
    }
    goBack() {
      this.location.back();
    }
}
