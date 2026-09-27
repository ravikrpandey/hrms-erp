import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent {
  employee_complaint_id: any;
  assignAction: any;

  constructor(private route: Router, private recruitservice : RecruitService ,private _rbackService: RbacMasterService,
    public dialog: MatDialog, private toast: ToastrService, private recruitService: RecruitService) {
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }
  public cellValue: any;


  singleData: any;
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.singleData = params.data;
  }

  getValueToDisplay(params: ICellRendererParams) {

    return params.data;
  }
  refresh(params: ICellRendererParams): boolean {
    // set value into cell again

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  edit(e:any) {
    debugger
    e.stopPropagation();
    //
    this.route.navigate(['master/ess/complaint-list/complaint-create'], { queryParams: { complaintId: this.cellValue?.complaint_id,status:'HR' },skipLocationChange: true })
    // edit(e: any) {
    //   e.stopPropagation();
    // }
  }

  delete(e:any){

    const data = {
      employee_complaint_id: this.cellValue
    }
    this.employee_complaint_id = Number(this.cellValue)
    this.recruitService.deleteComplaint(this.employee_complaint_id).subscribe((res:any)=>{

      this.toast.success('Complaint Deleted successfully!');
      window.location.reload();
    })
    e.stopPropagation();


  }



  openDialog() {
    this.route.navigate(['master/ess/complaint-list/complaint-create'], { queryParams: { complaintId: this.cellValue?.complaint_id,status:'view' },skipLocationChange: true })
  }



}

