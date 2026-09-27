import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { RemarkDialogeComponent } from '../../remark-dialoge/remark-dialoge.component';

@Component({
  selector: 'app-assigned-action',
  templateUrl: './assigned-action.component.html',
  styleUrls: ['./assigned-action.component.scss']
})
export class AssignedActionComponent {
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
    this.route.navigate(['/master/project-management/update-status'], {
      queryParams: { id: this.cellValue,view:'edit' ,project_id: this.project_id},
    });
  } 

  
  view(e: any) {
    e.stopPropagation();
    this.route.navigate(['/master/project-management/create-task'], {
      queryParams: { id: this.cellValue ,view:'view'},
    });
  }
  openDialog() {
    const dialogRef = this.dialog.open(RemarkDialogeComponent, {
      width: '800px',
      data: {
        id: this.cellValue,          
        project_id: this.project_id, 
      },
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }
  remark(e:any){
    e.stopPropagation();
    this.route.navigate(['/master/project-management/remarks'], {
      queryParams: { id: this.cellValue ,view:'view'},
    });
    this.toast.info("This feature will be available soon!!")
  }
  getValueToDisplay(params: ICellRendererParams) {
    if (params.data.id) {
      this.project_id = params.data.id;
      this.assignAction = this._rbackService.accessAssignAction();
      return params.data.id;
    }
}
}
