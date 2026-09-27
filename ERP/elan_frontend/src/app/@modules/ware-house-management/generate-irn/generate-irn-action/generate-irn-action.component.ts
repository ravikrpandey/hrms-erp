import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { IdEncoderService } from 'src/app/@shared/services/id-encoder.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';

@Component({
  selector: 'app-generate-irn-action',
  templateUrl: './generate-irn-action.component.html',
  styleUrls: ['./generate-irn-action.component.scss']
})
export class GenerateIrnActionComponent {

  employee_complaint_id: any;
  assignAction: any;

  constructor(private route: Router, private recruitservice : RecruitService ,private _rbackService: RbacMasterService,
    public dialog: MatDialog, private toast: ToastrService, private recruitService: RecruitService,private idencrypt:IdEncoderService) {
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }
  public cellValue: any;


  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
  }

  getValueToDisplay(params: ICellRendererParams) {

    return params.data;
  }
  refresh(params: ICellRendererParams): boolean {
    // set value into cell again

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

 

   view(e:any){
    this.route.navigate(['master/warehouse-management/pick-list/invoice-view'],{queryParams:{id:this.cellValue.vehicle_planing_id,action_type:'view',status:'IRN',irnStatus:this.cellValue.irn_status}})
   }

 

}
