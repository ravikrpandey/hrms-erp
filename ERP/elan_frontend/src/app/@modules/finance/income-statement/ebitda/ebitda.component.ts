import { Location } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray,AbstractControl,ValidatorFn } from '@angular/forms';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { environment } from 'src/app/environments/environment';
import { FinaceService } from 'src/app/@shared/services/finace.service';

const databaseKey: any = environment.servralUrl;
function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      // Return an error object to indicate validation failure
      return { leadingSpaces: true };
    }
    // Return null if validation passes
    return null;
  };
}
@Component({
  selector: 'app-ebitda',
  templateUrl: './ebitda.component.html',
  styleUrls: ['./ebitda.component.scss']
})
export class EbitdaComponent {
  array : any = [];
  ebitdaForm: any = [];
  type:any;
  fid:any;
  entity_id:any;
  constructor(private fb: FormBuilder,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private toast: ToastrService,
    private locatin: Location,
    private location: Location,
    private _rbackMasterService : RbacMasterService,
    private config: ConfigurationalmasterService,
    private toaster:ToastrService,
    private entityService: EntityMasterService,
    private finace : FinaceService
  ) {
    // shiftMasterForm
    this.ebitdaForm = this.fb.group({
      ebitdaTotal: new FormControl(null),
    })
  }

  ngOnInit(): void {
    this.apiOnLoad();
    this.activetedRoute.queryParams.subscribe((params: any) => {
      this.fid = params.fid;
      this.type = params.type;
      this.entity_id = params.entity_id
    })
    this.array = [[0,0,0,0],[0,0,0,0]]
    this.populate()
  }

  populate = () => {
    for ( let i = 0 ; i < 13 ; i++ ) {
      this.array[i] = [0,0,0,0,0]
    }
    this.array[0][0] = 'January'
    this.array[1][0] = 'Feburary'
    this.array[2][0] = 'March'
    this.array[3][0] = 'April'
    this.array[4][0] = 'May'
    this.array[5][0] = 'June'
    this.array[6][0] = 'July'
    this.array[7][0] = 'August'
    this.array[8][0] = 'September'
    this.array[9][0] = 'October'
    this.array[10][0] = 'November'
    this.array[11][0] = 'December'
    this.array[12][0] = 'Total'
  }

  apiOnLoad(){
    // /api/v1/getAllRoleMaster/Super%20Admin
  }

  close(){
    this.router.navigate([`master/finance/income-statement/generate-income-statement`],{queryParams:{entity_id:this.entity_id,fid:this.fid,type:this.type}});
  }
}
