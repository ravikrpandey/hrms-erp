import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-action-store',
  templateUrl: './action-store.component.html',
  styleUrls: ['./action-store.component.scss']
})
export class ActionStoreComponent implements OnInit {
  assignAction: any;
  public cellValue: any;
  constructor(private route: Router ,private _rbackService: RbacMasterService,
    public dialog: MatDialog) {
  }
  ngOnInit(): void {
    
    this.assignAction = this._rbackService.accessAssignAction();    
  }
  openDialog(e:any) {
    e.stopPropagation();
    this.route.navigate(['/master/store-management/store/create-warehouse'], { queryParams: { id: this.cellValue,action_type:'view' }})

  }
  edit(e:any) {
    e.stopPropagation();
    // 
    this.route.navigate(['master/store-management/store/create-warehouse'], { queryParams: { id: this.cellValue,action_type:'edit' }})
    // edit(e: any) {
    //   e.stopPropagation();
    // }
  }
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);

  }
  getValueToDisplay(params: ICellRendererParams) {
    
    return params.data.id;
  }
  refresh(params: ICellRendererParams): boolean {
    // set value into cell again
    
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

}
