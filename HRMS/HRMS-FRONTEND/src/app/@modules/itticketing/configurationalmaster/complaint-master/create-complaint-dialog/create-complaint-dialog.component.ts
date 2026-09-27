import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-create-complaint-dialog',
  templateUrl: './create-complaint-dialog.component.html',
  styleUrls: ['./create-complaint-dialog.component.scss']
})
export class CreateComplaintDialogComponent {
  visibility: any;
  singleProductData: any;
  complaintForm:FormGroup;
  financial_year_id:any;
  entity_id:any;
    constructor(
      private dialog: MatDialogRef<CreateComplaintDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public _fb: FormBuilder, public toaster: ToastrService,
        private _configurationalmasterService: ConfigurationalmasterService
    ) {
    this.complaintForm = this._fb.group({
      complaint_type: new FormControl(null, [Validators.required]),
        entity_id: new FormControl(null),
        financial_year_id: new FormControl(null),
      })

    }
    ngOnInit(): void {
      this.entity_id = localStorage.getItem('selectedEntityId');
      this.financial_year_id = localStorage.getItem('financial_id');
      this.visibility = this.data.view;
        this.getIssue_ById();
    }

    SubmitProductCategory(data: any) {
      if (this.complaintForm.invalid) {
        this.complaintForm.markAllAsTouched();
        this.toaster.error('Required fields should not be empty.', 'Error Occurred!');

        return
      }
      else{
        data.value.entity_id=this.entity_id;
        data.value.financial_year_id=this.financial_year_id;
        data.value.id=this.data?.id
        if(this.data?.id)
        {
          this._configurationalmasterService.update_complaint_type(data.value).subscribe((res:any)=>{
            if (res) {

                this.toaster.success('Complaint Type  Updated successfully!');
                this.dialog.close();
                location.reload()

            }
          },(err:any)=>{

          })
        }else{
          this._configurationalmasterService.create_complaint_type(data.value).subscribe((res:any)=>{
            if (res) {
              if (res.message === "Complaint Type is Already Exits!") {
                this.toaster.warning('Complaint Type is Already Exits!');
              }
              else {
                this.toaster.success('Complaint Type is created successfully!');
                this.dialog.close();
                location.reload()
              }
            }
          },(err:any)=>{

          })
        }

      }
    }

    getIssue_ById(){
      this._configurationalmasterService.get_complaint_type_byId(this.data?.id).subscribe((res:any)=>{
        if(res){
          this.singleProductData=res.data[0];
           this.complaintForm.patchValue({
            complaint_type:this.singleProductData?.complaint_type
           })
        }
      },(err:any)=>{

      })
    }
  }


