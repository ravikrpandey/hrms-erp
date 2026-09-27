import { Component } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/environments/environment';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-candidate-action',
  templateUrl: './candidate-action.component.html',
  styleUrls: ['./candidate-action.component.scss']
})
export class CandidateActionComponent {
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

generateIcon() {
  let url = `${this.baseHref}form-candidate/${this.idJob}`;
  this.clipboard.copy(url);
  this.toaster.success(`${url}`);
}
viewJD(e: any) {
  this.route.navigate(['vendor/recruitment/job-discription/job-view'], { queryParams: { id: this.idJob, view: 'view' } })
}

openProfile() {

  this.route.navigate(['vendor/recruitment/candidate-profile/profile-request'], { queryParams: { id: this.idJob, view: 'request' } })
}
}

