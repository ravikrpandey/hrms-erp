import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { environment } from 'src/app/environments/environment';
import { Clipboard } from '@angular/cdk/clipboard';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-job-action',
  templateUrl: './job-action.component.html',
  styleUrls: ['./job-action.component.scss']
})
export class JobActionComponent {
  paramsVal: any;
  singleData: any;
  cellValue: any;
  idJob: any;
  enviremnet: string;
  baseHref: any;
  assignAction: any; 

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private toaster: ToastrService,
    private recruitService: RecruitService,
    private clipboard: Clipboard,
    private _rbackService: RbacMasterService,
  ) {
    // this.data = localStorage.getItem("jobId");
    // 
  }

  ngOnInit(): void {
    this.enviremnet = environment.serverUrl;
    this.baseHref = environment.baseHref;
    this.assignAction = this._rbackService.accessAssignAction();
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {

    this.singleData = params.data;
    this.paramsVal = params.data.id;
    this.cellValue = this.getValueToDisplay(params);
    this.idJob = params.data.id;
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted
      ? params.valueFormatted
      : params.data.type_of_vendor_id;
  }
  refresh(params: ICellRendererParams): boolean {

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
  navigateToPO() {
    this.route.navigate(['master/recruitment/job-discription-main/job-create'], { queryParams: { id: this.idJob, actionType: 'jd_from_request' } })
  }
  generateIcon() {
    let url = `${this.baseHref}form-candidate/${this.idJob}`;
    this.clipboard.copy(url);
    this.toaster.success("JD Link Copied");
  }
  
  viewJD(e: any) {
    console.log(this.singleData)
    if (!this.singleData?.isApproved) {
      this.route.navigate(['master/ess/manpower-request/new-request-create'], { queryParams: { id: this.idJob, type: 'view' } })
    }
    else {
      this.route.navigate(['master/recruitment/job-discription-main/job-create'], { queryParams: { id: this.idJob, view: 'view' } })
    }
  }

  editJd(e: any) {
    if (this.idJob) {
      this.route.navigate(['master/recruitment/job-discription-main/job-create'], { queryParams: { id: this.idJob, view: 'update' } })
    }
  }

}
