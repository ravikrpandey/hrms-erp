import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';

@Component({
  selector: 'app-create-vehical-category',
  templateUrl: './create-vehical-category.component.html',
  styleUrls: ['./create-vehical-category.component.scss']
})
export class CreateVehicalCategoryComponent {
  visibility: any;
  singleProductData: any;
  vehicalCategoryForm:FormGroup;
  financial_year_id:any;
  entity_id:any;
    constructor(
      private dialog: MatDialogRef<CreateVehicalCategoryComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public _fb: FormBuilder, public toaster: ToastrService,
      private transport_service:TransportManagementService
    ) {
    this.vehicalCategoryForm = this._fb.group({
      vehical_category_name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      entity_id: new FormControl(null),
      financial_year_id: new FormControl(null),
      })

    }
    ngOnInit(): void {
      this.entity_id = localStorage.getItem('selectedEntityId');
      this.financial_year_id = localStorage.getItem('financial_id');
      this.visibility = this.data.view;
      if(this.data?.id){
       this.get_vehical_category_byId();
      }
    }

    SubmitProductCategory(data: any) {
      if (this.vehicalCategoryForm.invalid) {
        this.vehicalCategoryForm.markAllAsTouched();
        this.toaster.error('Required fields should not be empty.', 'Error Occurred!');

        return
      }
      else{
        data.value.entity_id=this.entity_id;
        data.value.financial_year_id=this.financial_year_id;
        data.value.id=this.data?.id;

        if(this.data?.id)
        {
         this.transport_service.update_vehical_category(data.value).subscribe((res:any)=>{
          if(res){
            this.toaster.success('Vehical Category Updated Successfully');
            this.dialog.close();
            location.reload();
          }
         },(err:any)=>{

         })
        }else{
           this.transport_service.create_vehical_category(data.value).subscribe((res:any)=>{
             if(res){
              this.toaster.success('Vehical Category Create Successfully');
              this.dialog.close();
              location.reload();
             }
           },(err:any)=>{

           })
        }

      }
    }
    get_vehical_category_byId(){
      this.transport_service.get_vehical_category_byId(this.data?.id).subscribe((res:any)=>{
         if(res){
          let data=res.data[0];
          this.singleProductData=data;
          this.vehicalCategoryForm.patchValue({
            description:data?.description,
            vehical_category_name:data?.vehical_category_name
          })
         }
      },(err:any)=>{

      })
    }

  }



