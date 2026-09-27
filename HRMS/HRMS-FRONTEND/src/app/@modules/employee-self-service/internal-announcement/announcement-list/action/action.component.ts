import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { AnnouncementViewComponent } from '../../announcement-view/announcement-view.component';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { ToastrService } from 'ngx-toastr';
// import { EmpListDialogComponent } from '../emp-list-dialog/emp-list-dialog.component';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {

  constructor(private route: Router,
    public dialog: MatDialog, private _empMasterService:EmpMasterService, private toast:ToastrService) {
  }

  ngOnInit(): void {
  }
  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    
  }
  getValueToDisplay(params: ICellRendererParams) {
    
    return params.valueFormatted ? params.valueFormatted : params.data.email_id;
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again
    
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  edit(e:any) {
    e.stopPropagation();
    // 
    this.route.navigate(['master/ess/announcement-create'], { queryParams: { email_id: this.cellValue } })
    
  }

  delete(e:any){
    // e.stopPropagation();
    
    const data = {
      email_id: Number(this.cellValue)
    }
    
    const emilId=data.email_id
    this._empMasterService.deleteAnnounce(emilId, data).subscribe((res:any)=>{
      
       this.toast.success(" Deleted successfully..");
      window.location.reload();
    })
  e.stopPropagation();

  }

  openDialog() {
    const dialogRef
      = this.dialog.open(AnnouncementViewComponent, {
        width: '100%',
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        panelClass: 'full-screen-modal',
        data: { id: this.cellValue }
      });
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
}
