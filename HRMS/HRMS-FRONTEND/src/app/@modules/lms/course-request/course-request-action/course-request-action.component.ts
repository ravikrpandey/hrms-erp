import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-course-request-action',
  templateUrl: './course-request-action.component.html',
  styleUrls: ['./course-request-action.component.scss'],
})
export class CourseRequestActionComponent {
  singleId: any;
  cellValue1: any;
  assignAction: any;
  entity_id: any;
  constructor(private route: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
  }
  public cellValue: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.cellValue1 = params.data;    
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params?.data?.req_id;
  }
  view(e: any) {
    this.route.navigate(['master/lms/course-request/course-request-allocate'], {
      queryParams: { req_id: this.cellValue },
    });
  }
  view2(e: any) {
    this.route.navigate(['master/lms/course-request/course-request-allocate'], {
      queryParams: { req_id: this.cellValue1.id },
    });
  }
}
