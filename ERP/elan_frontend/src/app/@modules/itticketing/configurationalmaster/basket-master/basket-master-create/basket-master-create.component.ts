import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';


@Component({
  selector: 'app-basket-master-create',
  templateUrl: './basket-master-create.component.html',
  styleUrls: ['./basket-master-create.component.scss']
})
export class BasketMasterCreateComponent {
  createPrItemForm: FormGroup;

  entity_id: any;
  LocationForm: FormGroup;
  id: any;
  action_type: any;
  data: any = [];
  uomList: any =[];

  cities1: any;
  constructor(
    private fb: FormBuilder,
    private _commonService: CommonService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private activeroute: ActivatedRoute,
    private toaster: ToastrService,
    public $common: CommonService,
    private route: Router,
    private _empRegistration: EmpRegistrationService,
  ) {
    this.LocationForm = this.fb.group({
    //  baskets:new FormControl(null),
    type_of_basket:new FormControl(null,[Validators.required]),
    no_of_partition:new FormControl(null,[Validators.required]),
    basket_qty:new FormControl(0),
    price_per_unit:new FormControl(null,[Validators.required]),
    hsn_code_id:new FormControl(null,[Validators.required]),
    igst:new FormControl(null,[Validators.required]),
    uom_id:new FormControl(null,[Validators.required])
    });
  }

  ngOnInit() {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this._empRegistration.setEmpTitle('PERSONAL DETAILS');
     this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      this.action_type = params.action_type;
      this.getByData(this.id)
    });
      this.getHSNCodeList(this.entity_id);

    // Call UOM List API
    this._configurationalMasterService.getActiveUOMList().subscribe((res: any) => {
      this.uomList = res.data;
    });
    
  }

  getByData(id:any){
    this._configurationalMasterService.getById_basketMaster(id).subscribe((res:any)=>{
      // console.log(res,"resss");
      this.LocationForm.patchValue({
        type_of_basket:res.data?.type_of_basket,
        no_of_partition:res.data?.no_of_partition,
        basket_qty:res.data?.basket_qty,
       price_per_unit:res.data?.price_per_unit,
       hsn_code_id:res.data?.hsn_code_id,
       igst:res.data?.value,
       uom_id:res.data?.uom_id
      })
    })
  }

  hsnCodeList:any[]=[];
  searchListHSN: any;
  getHSNCodeList(id:any){
    this._configurationalMasterService.getHSNCode(id).subscribe((res:any)=>{
      this.hsnCodeList = res?.data;
      this.searchListHSN = this.hsnCodeList.map((value: any) => value.hsn_sac_code);
    })
  }

  searchFilterHSN(e: any) {
    const aa = e;
    let filteredVariable = this.hsnCodeList.filter((item: any) =>
      aa.includes(item.hsn_sac_code)
    );
    this.hsnCodeList = filteredVariable;
  }
  
  onHSNCodeChange(data:any){
  this.LocationForm.get('igst')?.patchValue(data?.value);
  }

  onSubmit() {
    if (this.LocationForm.invalid) {
      this.LocationForm.markAllAsTouched();
      return;
    }

    let val=this.LocationForm.value;
    const payload = {
      // present_country_id: this.LocationForm.value.present_country_id,
      // present_state_id: this.LocationForm.value.present_state_id,
      // city_id: this.LocationForm.value.city_id,
      // location_code: this.LocationForm.value.location_code,
      // location_name: this.LocationForm.value.location_name,
      // baskets:val?.baskets,
      type_of_basket:val?.type_of_basket,
      no_of_partition:val?.no_of_partition,
      basket_qty:val?.basket_qty,
      price_per_unit:val?.price_per_unit,
      hsn_code_id:val?.hsn_code_id,
      igst:val?.igst,
      entity_id:this.entity_id,
      uom_id:val?.uom_id
    };

    console.log("checked here all data ****", payload);

    if(this.id){
  this._configurationalMasterService.updateBasketMaster(this.id,payload).subscribe({
      next: (res: any) => {
        if (res) {
          this.toaster.success("Basket Data Update successfully!");
          this.route.navigate(['master/configurational-master/basket-master']);
        } 
        // else {
        //   this.toaster.error("Something went wrong while saving!");
        // }
      },
      error: (err: any) => {
        console.error("Error saving location:", err);
        this.toaster.error("Failed to save Basket!");
      }
    });
    }else{
  this._configurationalMasterService.createBasket(payload).subscribe({
      next: (res: any) => {
        if (res) {
          this.toaster.success("Basket saved successfully!");
          this.route.navigate(['master/configurational-master/basket-master']);
        } 
        
      },
      error: (err: any) => {
        console.error("Error saving location:", err);
        this.toaster.error("Failed to save Basket!");
      }
    });
    }
  
  }





  onBack = () => {
    this.route.navigate(['master/configurational-master/basket-master']);
  }




}
