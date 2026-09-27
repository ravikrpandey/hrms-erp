import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-add-uses',
  templateUrl: './add-uses.component.html',
  styleUrls: ['./add-uses.component.scss']
})
export class AddUsesComponent {
  id : any;
  userForm :FormGroup;
  mode: any;
  getData: any;
  entity_id: any;
  constructor(
    private dialog: MatDialogRef<''>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private financeService : FinaceService,
    private _configurationalmasterService: ConfigurationalmasterService,private _fb:FormBuilder,private route:Router,private toaster:ToastrService
  ) {
    this.id = data.id;
    this.mode = data.mode;
    this.userForm =this._fb.group({
      name:new FormControl('',[Validators.required,noLeadingSpaces()]),
      
    })
  }

  ngOnInit() {
    if(this.id){
      this.getSealTypeById();
    }
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  getVal(event:any){
  }
  submitData(data:any){
    if(this.userForm .invalid){
      return
    }
    if(this.id){
      this._configurationalmasterService.updateUsesByid(this.id, data).subscribe(
        (res: any) => {
          if(res.code == 200){
            this.toaster.success('Usage Updated Successfully');
            this.reloadCurrentRoute();
            this.dialog.close();
            this.userForm .reset();
          }
          else{
            this.toaster.error(res.message);
          }
        }, (err: any) => {
          this.toaster.error(err.error.message)
        }
      );
    }
    else{
      this._configurationalmasterService.createUses(data).subscribe(
        (res: any) => {
          this.toaster.success('Usage Added Successfully');
          this.reloadCurrentRoute();
          this.dialog.close();
          this.userForm .reset();
        },
          (err: any) => {
            this.toaster.error(err.error.message)
            // if (err.status == 400) {
            //   this.toaster.error('Something went Wrong!');
            // } else if (err.status == 201) {
            //   this.toaster.error('Budget Category already Exits!');
            // } else {
            //   this.toaster.error('Error in submission!');
            // }
          }
        );
      }
  }
  getSealTypeById() {
    this._configurationalmasterService
      .getUsestByIdDD(this.id)
      .subscribe((res: any) => {
        this.getData = res.data;
        this.userForm .patchValue({
          name:this.getData.name,
           
        })
      });
  }
}
