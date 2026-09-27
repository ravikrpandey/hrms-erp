import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { environment } from 'src/app/environments/environment';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-profile-request-action',
  templateUrl: './profile-request-action.component.html',
  styleUrls: ['./profile-request-action.component.scss']
})
export class ProfileRequestActionComponent {
  paramsVal: any;
  cellValue: any;
  idJob: any;
  enviremnet: string;
  baseHref: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private toaster: ToastrService,
    private recruitService: RecruitService,
    private clipboard: Clipboard
  ) {
    // this.data = localStorage.getItem("jobId");
    // 
  }

  ngOnInit(): void {
    this.enviremnet = environment.servralUrl;
    this.baseHref = environment.servralUrl;
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
   
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
    this.toaster.success(`${url}`);
  }
  viewJD(e: any) {

    this.route.navigate(['master/recruitment/job-discription-main/job-create'], { queryParams: { id: this.idJob, view: 'view' } })
  }
}
