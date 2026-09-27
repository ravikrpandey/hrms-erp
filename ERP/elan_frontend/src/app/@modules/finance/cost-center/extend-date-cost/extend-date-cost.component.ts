import { Component } from '@angular/core';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { CostCenterDilogComponent } from '../cost-center-dilog/cost-center-dilog.component';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/@shared/services/common.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';

@Component({
  selector: 'app-extend-date-cost',
  templateUrl: './extend-date-cost.component.html',
  styleUrls: ['./extend-date-cost.component.scss']
})
export class ExtendDateCostComponent {
  id: any;
  getData: any;
  costCenterForm:any;
  entity_id: string | null;
  mode: any;
  logData: any;
  finacialYear: any;
  remaining_cost_amount:any

constructor(private finance:FinaceService,private fb: FormBuilder, public dialog: MatDialog, private _configurationalMasterService: ConfigurationalmasterService, private prService: PurchaseRequestService, private activeroute: ActivatedRoute,
  private toaster: ToastrService,
  private $common: CommonService,

  private route: Router
) {
  this.costCenterForm = this.fb.group({
    // department_id: new FormControl(null, [Validators.required]),
    // region_id: new FormControl(null, [Validators.required]),
    // cost_center_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
    // cost_center_code: new FormControl(null, [Validators.required, noLeadingSpaces()]),
    // type:new FormControl(null,Validators.required),
    // amount_bgt:new FormControl(null,Validators.required),
    // finacial_year:new FormControl(null)
  })
}
ngOnInit() {
  this.entity_id = localStorage.getItem('selectedEntityId');
  this.activeroute.queryParams.subscribe((params: any) => {
    this.id = params.id;
    this.mode = params.mode;
  });
this.getByIdCostCenter();
}
  getByIdCostCenter = () => {
    setTimeout(() => {
      this.finance.getCostCenterById(this.id).subscribe((res: any) => {
        this.getData = res.data;
        this.finacialYear=res.data?.financial_year;
        
       this.logData=res?.data?.cost_center_map;
        this.costCenterForm.patchValue({
          finacial_year:this.getData?.financial_year,

          department_id: this.getData?.dept_id,
          region_id: this.getData?.region_id,
          cost_center_name: this.getData?.cost_center_name,
          cost_center_code: this.getData?.cost_center_code,
          cost_center_type:this.getData?.cost_center_type,
          // extend_type:val?.type,
          amount_bgt:this.getData?.amount
        })
      })
    }, 500)
  }

  openDialog(){
    const dialogRef = this.dialog.open(CostCenterDilogComponent, {
      data: {data:this.getData, id:this.id,status:"revised"},

      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      
    });
  }
}
