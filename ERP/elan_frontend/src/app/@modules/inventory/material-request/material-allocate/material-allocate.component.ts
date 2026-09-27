import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-material-allocate',
  templateUrl: './material-allocate.component.html',
  styleUrls: ['./material-allocate.component.scss']
})
export class MaterialAllocateComponent {
  AddNewForm: FormGroup;
  viewDetails: any
  material_request_detail_id: any;

  constructor(private fb: FormBuilder, private activateRoute: ActivatedRoute,private _configurationalMasterService: ConfigurationalmasterService,
    private toaster: ToastrService,private route:Router
  ) {
    this.AddNewForm = fb.group({
      item_name: new FormControl(null, [Validators.required]),
      quantity: new FormControl(null, [Validators.required]),
      allocate_quantity: new FormControl(null, [Validators.required]),
      lifo_fifo: new FormControl(null, [Validators.required]),
      awb_mup: new FormControl(null, [Validators.required]),
      Total_inventory: new FormControl(null, [Validators.required]),
    })
  }
  ngOnInit() {
    
    this.activateRoute.queryParams.subscribe((params: any) => {
      console.log(params);
      this.material_request_detail_id = params.id
      console.log(this.material_request_detail_id);
      this.AddNewForm.patchValue({
        item_name : params?.itemName,
        Total_inventory: params?.Total_inventory,
        quantity:params.quantity
      })
      
    })
  }

  goBack() {
    window.history.back()
  }

  submit(){
    
    console.log(this.AddNewForm);
    if(this.AddNewForm.invalid){
      this.toaster.error('please fill all required fields')
      return;
    }
    this.AddNewForm.value.material_request_detail_id = this.material_request_detail_id
    let data = this.AddNewForm.value
    console.log(data);
    
    this._configurationalMasterService.allocateMaterial(data).subscribe((res: any) => {
      if (res) {
        this.toaster.success(res.message);
        this.route.navigate(['/master/inventory-management/material-request-list'])
        this.AddNewForm.reset();
      }
    }, (err: any) => {
      this.toaster.error(err.error.message)
    })
    
  }
}
