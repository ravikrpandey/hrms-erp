import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-search-profile-action',
  templateUrl: './search-profile-action.component.html',
  styleUrls: ['./search-profile-action.component.scss']
})
export class SearchProfileActionComponent {
  assignAction: any;
  baseUrl: any;

  constructor(
    private route: Router,
    public dialog: MatDialog,

  ) {

    this.baseUrl ='https://eliteerpapi.elitetraveltech.in';
    // this.data = localStorage.getItem("jobId");
    //
  }

  ngOnInit(): void {
  }
  public cellValue: any;
  public paramsVal: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
    this.paramsVal = params.data;
    this.cellValue = this.getValueToDisplay(params);
  }

  getValueToDisplay(params: ICellRendererParams) {

    return params.data.candidate_id;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }



}

