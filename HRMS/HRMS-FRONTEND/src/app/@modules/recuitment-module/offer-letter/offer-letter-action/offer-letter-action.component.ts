import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-offer-letter-action',
  templateUrl: './offer-letter-action.component.html',
  styleUrls: ['./offer-letter-action.component.scss']
})
export class OfferLetterActionComponent {
  paramsVal: any;
  singleData: any;
  cellValue: any;
  idJob: any;
  enviremnet: string;
  baseHref: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.enviremnet = environment.serverUrl;
    this.baseHref = environment.baseHref;
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
  viewJD(e: any) {
    this.route.navigate(['master/recruitment/shortlisted-candidate/create-candidate-offer-letter'], { queryParams: { offer_id: this.singleData?.id, actionType: this.singleData?.approval_status, actionFor: this.singleData?.actionFor } })
  }
}
