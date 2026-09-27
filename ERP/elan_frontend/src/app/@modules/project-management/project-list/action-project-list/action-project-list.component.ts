import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-action-project-list',
  templateUrl: './action-project-list.component.html',
  styleUrls: ['./action-project-list.component.scss']
})
export class ActionProjectListComponent {
  project_id: any;
  assignAction: any;
  constructor(
    private route: Router,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    public dialog: MatDialog,
  ){}
  ngOnInit(): void {}
  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
  }
  edit(e: any) {
    e.stopPropagation();
    this.route.navigate(['/master/project-management/add-project'], {
      queryParams: { id: this.cellValue,view:'edit' },
    });
  } 

  
  view(e: any) {
    e.stopPropagation();
    this.route.navigate(['/master/project-management/add-project'], {
      queryParams: { id: this.cellValue ,view:'view'},
    });
  }
  getValueToDisplay(params: ICellRendererParams) {
    if (params.data.id) {
      this.project_id = params.data.id;
      this.assignAction = this._rbackService.accessAssignAction();
      return params.data.id;
    }
}
}
