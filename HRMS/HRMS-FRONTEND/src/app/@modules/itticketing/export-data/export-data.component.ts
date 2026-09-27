import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/@auth/auth-material/auth.service';

@Component({
  selector: 'app-export-data',
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.scss']
})
export class ExportDataComponent implements OnInit, OnDestroy {
  subModules: any;
  subM: any;
  constructor(private route: Router, private _authServie: AuthService) { }

  ngOnInit(): void {
    this.subM = this._authServie.getSubModules().subscribe(
      (res: any) => {
        
        this.subModules = res;
      });
  };

  goInToPage(m:any){
    let lg: any = localStorage.getItem('signInUser');
    let loginUser = JSON.parse(lg);


    let role_master_id = localStorage.getItem('role_master_id');
    let entity_id = localStorage.getItem('selectedEntityId');
    let req = {
      employee_id: loginUser?.employee_id,
      role_master_id: role_master_id,
      entity_id: entity_id,
    };
    this._authServie.getModuleActions(req,m).subscribe(
      (res)=>{
        console.log(res.data.options, ' < --module assign action');
      },
      (err)=>{
        console.log(err);
      }
    )
  }

  ngOnDestroy(): void {
    this.subM.unsubscribe();
  };

  img() {
    this.route.navigate(['master/itticket/export-data/export-data-open']);
  }
}
