import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-issue-create',
  templateUrl: './issue-create.component.html',
  styleUrls: ['./issue-create.component.scss']
})
export class IssueCreateComponent implements OnInit {
visibility: any;
singleProductData: any;
IssueForm:FormGroup;
financial_year_id:any;
entity_id:any;
  constructor(
    private dialog: MatDialogRef<IssueCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _fb: FormBuilder, public toaster: ToastrService,
      private _configurationalmasterService: ConfigurationalmasterService
  ) {
  this.IssueForm = this._fb.group({
      issue_Type: new FormControl(null, [Validators.required]),
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
    if (this.IssueForm.invalid) {
      this.IssueForm.markAllAsTouched();
      this.toaster.error('Required fields should not be empty.', 'Error Occurred!');

      return
    }
    else{
      data.value.entity_id=this.entity_id;
      data.value.financial_year_id=this.financial_year_id;
      data.value.issue_Type=data.value.issue_Type.trim()
      if(this.data?.id)
      {
        this._configurationalmasterService.update_Issue(this.data?.id,data.value).subscribe((res:any)=>{
          if (res) {
            if (res.message === "Issue Type is Already Exits!") {
              this.toaster.warning('Issue Type is Already Exits!');
            }
            else {
              this.toaster.success('Issue Type updated successfully!');
              this.dialog.close();
              location.reload()
            }
          }
        },(err:any)=>{

        })
      }else{
        this._configurationalmasterService.createIssue(data.value).subscribe((res:any)=>{
          if (res) {
            if (res.message === "Issue Type is Already Exits!") {
              this.toaster.warning('Issue Type is Already Exits!');
            }
            else {
              this.toaster.success('Issue Type is created successfully!');
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
    this._configurationalmasterService.getIssueby_Id(this.data?.id).subscribe((res:any)=>{
      if(res){
        this.singleProductData=res.data[0];
        this.IssueForm.patchValue({
          issue_Type:this.singleProductData.issue_type
        })
      }
    },(err:any)=>{

    })
  }
}
