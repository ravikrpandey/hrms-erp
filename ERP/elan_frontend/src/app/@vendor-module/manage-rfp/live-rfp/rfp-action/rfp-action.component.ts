import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-rfp-action',
  templateUrl: './rfp-action.component.html',
  styleUrls: ['./rfp-action.component.scss']
})
export class RfpActionComponent {
  paramsVal: any;
  singleData: any;
  cellValue: any;
  idJob: any;
  enviremnet: string;
  baseHref: any;
  assignAction: any;

  constructor(
    private route: Router,

  ) {

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
  editRfp() {
    this.route.navigate(
      ['vendor/manage-rfp/live-rfp/rfp-details'],
      { queryParams: { type: this.singleData?.procurement_type, Rfp_Number: this.singleData?.Rfp_Number } }
  );

}


}

