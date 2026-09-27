import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from '../../service/sales.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-view-return',
  templateUrl: './view-return.component.html',
  styleUrls: ['./view-return.component.scss']
})
export class ViewReturnComponent implements OnInit{

   currencySign: any
  grossTotal: any
  grossDiscountArray: any = [];
  gstTotal: any
  totalAMTAfterDiscount: any
  discountAmt: any
  grant_total: any
  amountInWords: any
  resData: any;
  ruleMst: any;
  chargeSummary: any;
  setFormData: any = [];
    responseData: any = [];
    items: any = [];
 
  constructor(
    private router: Router,
    private _active : ActivatedRoute,
    private toast: ToastrService,
    private _sales: SalesService,public location: Location
  ) {}
ngOnInit(): void {
   this._active.queryParams.subscribe({
      next: (res: any) => {
        if (res?.id) {
        
          this.getSalesReturn(res?.id)
        }
      },
      error: (err) => {
        this.toast.error(err.error.message);
      },
    });
}
  getSalesReturn(id:any){
      this._sales.getSalesReturn(id).subscribe({
    next:(res)=> {
      this.responseData = res.data;
       this.items = this.buildTree(this.responseData?.items);


        this.calculation(this.items);
      console.log('ppppppppppppppppp',res);
    },error(err) {
      console.log('ssssssssssssssssss',err)
    },
  })
  }

    buildTree(data: any[]) {
    const map = new Map<number, any>();
    const roots: any[] = [];

    // Create all nodes first
    for (const item of data) {
     

        map.set(Number(item.so_item_id), {
          ...item,
          children: [],
          level: 0
        });
      
    }
    for (const item of data) {
      let nodes1:any;
      
         nodes1 = map.get(Number(item.so_item_id));
       

      const parentId =
        item.parent_item_id === null ||
          item.parent_item_id === undefined ||
          item.parent_item_id === ''
          ? null
          : Number(item.parent_item_id);

      // Root node
      if (parentId === null || !map.has(parentId)) {
        roots.push(nodes1);
        continue;
      }

      const parent = map.get(parentId);

        if (!parent.children.some((x: any) => Number(x.so_item_id) === Number(nodes1.so_item_id))) {
          parent.children.push(nodes1);
        }
      
    }

    // Set levels recursively
    const setLevels = (nodes: any[], level = 0) => {
      for (const node of nodes) {
        node.level = level;

        if (node.children?.length) {
          setLevels(node.children, level + 1);
        }
      }
    };

    setLevels(roots);

    return roots;
  }


  calculation(itemList: any[]) {

    console.log("ITEM LIST =>", itemList);
    this.grossTotal = 0;
    this.gstTotal = 0;
    this.totalAMTAfterDiscount = 0;
    this.grant_total = 0;
    this.discountAmt = 0;
    let totalDiscount = 0;

    // RECURSIVE FUNCTION
    const calculateRecursive = (items: any[]) => {

      items.forEach((item: any) => {

        let qty;
        
          qty = Number(item.return_qty || 0);
        

        const price = Number(item.rate || 0);

        const discount = Number(item.discount_per_unit || 0);

        const gst = Number(item.gst || 0);

        // BASIC AMOUNT
        const itemTotal = qty * price;

        // DISCOUNT AMOUNT
        const discountTotal = qty * discount;

        // TAXABLE
        const taxableAmount = itemTotal - discountTotal;

        // GST VALUE
        const gstAmount = taxableAmount * gst / 100;

        // ADD TOTALS
        this.grossTotal += taxableAmount;

        totalDiscount += discountTotal;
        this.discountAmt = totalDiscount;
        this.gstTotal += gstAmount;

        // CHILD CALCULATION
        if (item.children && item.children.length > 0) {
          calculateRecursive(item.children);
        }

      });

    };

    // START RECURSION
    calculateRecursive(itemList);

    // NET AMOUNT
    this.totalAMTAfterDiscount = this.grossTotal;

    // SUB TOTAL BEFORE CHARGES
    this.grant_total =
      this.totalAMTAfterDiscount + this.gstTotal;

    console.log("Grant Total Before Charges =>", this.grant_total);

   
    console.log("Charge Summary =>", this.chargeSummary);

    // FINAL GRAND TOTAL AFTER CHARGES
    this.grant_total =
      this.grant_total +
      Number(this.chargeSummary?.totalCharges || 0);

    console.log("Final Grand Total =>", this.grant_total);



  }
}
