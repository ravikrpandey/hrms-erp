import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

interface ProductService {
  cetegory: string;
  item: string;
  quantity: number;
}

@Component({
  selector: 'app-add-material-item',
  templateUrl: './add-material-item.component.html',
  styleUrls: ['./add-material-item.component.scss']
})
export class AddMaterialItemComponent implements OnInit {
  materialForm: FormGroup;
  cetegory: any;
  item: any=[];

  constructor(private fb: FormBuilder,private toast : ToastrService,private _configurationalMasterService: ConfigurationalmasterService,private router: Router) {
    this.materialForm = this.fb.group({
      // productServiceData: this.fb.array([]) 
      cetegory: new FormControl(null),
      item: new FormControl(null),
      quantity: new FormControl(null),
    });
  }

  ngOnInit(): void {
    // this.addItems();
    this.getCetegory()
  }

  get CF_1(): any {
    return this.materialForm.controls;
  }

  addItems() {
    <FormArray>this.CF_1.productServiceData.push(
      new FormGroup({
        cetegory: new FormControl(null),
        item: new FormControl(null),
        quantity: new FormControl(null),
      })
    );
  }

  deleteRow(i: any, control: any,) {
    if (this.CF_1.productServiceData.length > 1) {

      this.CF_1.productServiceData.removeAt(i);
    } else {
      this.toast.error("Can't Deleted", "must be one");
      console.log("can't delete ");
      
    }
  }
  

  getCetegory(){
    this._configurationalMasterService.getActiveCetegory().subscribe((res:any)=>{
      this.cetegory = res.data
    })
  }
  getItem(e:any){
    // this.item[i]= []
    console.log(e.value);
    this._configurationalMasterService.getItem(e.value).subscribe((res:any)=>{
      let a = res.data
      console.log(a);
      this.item = a;
      console.log(this.item);
      
    })
  }

  navigateToMaterialRequest() {
    const params = {
      category: this.materialForm.value.category,
      item: this.materialForm.value.item,
      quantity: this.materialForm.value.quantity
    };
    
    this.router.navigate(['/master/crm-service/material-request'], { queryParams: params });
  }
  materialArray: any[] = [];

  submit(){
    const formData = this.materialForm.value;
    this.materialArray.push(formData);
    console.log(this.materialArray);
    this.navigateToMaterialRequest();
  }
}
