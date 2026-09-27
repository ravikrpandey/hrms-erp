import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-new-role-dialog',
  templateUrl: './new-role-dialog.component.html',
  styleUrls: ['./new-role-dialog.component.scss']
})
export class NewRoleDialogComponent {
  role_id: any;
  roleGetByData: any;

  constructor(private _rbacMasterService:RbacMasterService,  public dialog: MatDialogRef<NewRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){
this.role_id=data.role_master_id;

}
  ngOnInit(){
this.getByIdRole()
  }

  getByIdRole() {
    this._rbacMasterService.getByIdRole(this.role_id).subscribe((res: any) => {
      this.roleGetByData = res.data;
      
     
    })
  }
}
