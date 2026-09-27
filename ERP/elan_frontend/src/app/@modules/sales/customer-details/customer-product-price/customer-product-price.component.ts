import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { SalesService } from '../../service/sales.service';

@Component({
  selector: 'app-customer-product-price',
  templateUrl: './customer-product-price.component.html',
  styleUrls: ['./customer-product-price.component.scss']
})
export class CustomerProductPriceComponent {
  rowClass: string;
  entity_id: any;
  financial_year_id:any;
  rowData: any;
  assignAction: any;
  productForm:any;
  customer_id:any;
  action_type:any;
  productAmount:any;
  itemData:any;
  constructor(private empMaster: EmpMasterService, private _configurationalMasterService: ConfigurationalmasterService, private _rbackService: RbacMasterService,
    private shortcutService: ShortcutService,
    private route: Router,
    private _finaceservice: FinaceService,
    private toaster: ToastrService,
    private fb:FormBuilder,
    private activeroute: ActivatedRoute,
    private salesService: SalesService,
    
    public dialog: MatDialog) {
    this.rowClass = 'rowClass';
    this.productForm = this.fb.group({
      products: this.fb.array([])
     
    });
  }
  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params:any) => {
      this.customer_id = params['id'];
      this.action_type = params['action_type'];
     
    });
    this.entity_id = localStorage.getItem('selectedEntityId');

    this.financial_year_id = localStorage.getItem('financial_id');;

    this._configurationalMasterService.getDuplicateProductMasterList().subscribe((res: any) => {
      const aa = res.data
      const newArray = aa.map((item: any, index: any) => ({ ...item, index: index + 1 }));
      this.rowData = newArray
      this.initProductForm();
 this.getById();

    }, (err: any) => {
      this.rowData = []
    })
 this.getAllCustomerItemList()

    this.assignAction = this._rbackService.accessAssignAction();

  }
  amountDscount(e:any,i:any){
    console.log(e,"eeeeeee");
    const control = this.productForm?.get('products') as FormArray;
    console.log(control,'control');
    let list = control.value;
    for (let a = 0; a <= i; a++) {
      
      list[i].finalAmount = (list[i]?.productAmount * list[i]?.amountDiscount) / 100;
    }
    this.productForm.patchValue({
      products: list,
    })
  }

  getById(){
    this.salesService.getByProductAmount(this.customer_id).subscribe((res:any)=>{
      this.productAmount=res.data;
      if (this.productAmount?.length) {
        const formArray = this.productArray;
  
        this.productAmount.forEach((item: any, index: number) => {
          if (formArray.at(index)) {
            formArray.at(index).patchValue({
              productAmount: Number(item?.product_price),
              amountDiscount:Number(item?.discount_amount),
              finalAmount:Number(item?.final_amount)
            });
          }
        });
      }
    })
  }
  get productArray(): FormArray {
    return this.productForm.get('products') as FormArray;
  }
  initProductForm() {
    const formArray = this.productArray;
    formArray.clear();
  
    this.rowData.forEach(() => {
      formArray.push(this.fb.group({
        productAmount: [null],
        amountDiscount:[null],
        finalAmount:[null]
      }));
    });
  }

  mesShow:any;
  getAllCustomerItemList(){
    this.salesService.getAllCustomerItemList(this.customer_id).subscribe((res:any)=>{
      this.itemData=res.data;
    },
    ((err:any)=>{
        if(err?.error?.code  === 404){
          this.mesShow=err?.error?.message
        }
    })
    )
  }

  serialCounter = 0;

getSerialNumber(data: any, j: number): number {
  // Recalculate serial every time it's called
  let count = 0;
  for (let i = 0; i < this.itemData.length; i++) {
    const d = this.itemData[i];
    if (d === data) {
      return count + j + 1;
    }
    count += d.disList.length;
  }
  return count + j + 1;
}
  onSubmitForm() {
    this.route.navigate(['/master/sales/customer-list'])
//     const productAmounts = this.productForm.value.products;
  
//     const payload = this.rowData.map((item: any, index: number) => ({
//       product_id: item.id,
//       product_price: productAmounts[index]?.productAmount,
//       discount_amount:productAmounts[index]?.amountDiscount,
//       final_amount:productAmounts[index]?.finalAmount,
//       customer_id:this.customer_id
//     }));
  
//     console.log('Payload >>>', payload);
//     let data={
//       product_data:payload
//     }
//     this.salesService.addProductAmount(data).subscribe((res:any)=>{
//       console.log(res);
//       this.toaster.success(`${res.message}`)
     
//     },
//     ((err:any)=>{
// this.toaster.error(`${err.error?.message || "Internal Server Error"}`)
//     })
//     )
  }

  cancel(){
    this.route.navigate(['/master/sales/customer-list'])
    
  }
}
