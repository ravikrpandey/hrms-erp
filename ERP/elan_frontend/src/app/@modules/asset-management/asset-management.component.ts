import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd,Router } from '@angular/router';
import { AuthService } from 'src/app/@auth/auth-material/auth.service';
import { LeadService } from 'src/app/@shared/services/lead.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-asset-management',
  templateUrl: './asset-management.component.html',
  styleUrls: ['./asset-management.component.scss']
})
export class AssetManagementComponent implements OnInit {
  subModules: any;
  filteredmodules: any;
  subM: any;
  clicked: boolean = false;
  suSupModule: any;
  rowData:any = [];
  constructor(private router: Router, private lead: LeadService, private _authservice: AuthService) { }

  ngOnInit(): void {
    // this.subM = this._authservice.getSubModules().subscribe(
    //   (res: any) => {

    //     this.subModules = res;
    //     this.filteredmodules = this.subModules;
    // })
    
      let lg: any = localStorage.getItem('signInUser')
      let loginUser = JSON.parse(lg);
  
      let role_master_id = localStorage.getItem("role_master_id")
      let entity_id = localStorage.getItem("selectedEntityId")
      let req = {
        employee_id: loginUser?.employee_id,
        role_master_id: role_master_id,
        entity_id: entity_id,
      }
    // let sub = this._authservice.getAllAccess_Modules(req).subscribe(
    //   (res) => {
    //     // 

    //     this.suSupModule = this._authservice.getSubSuperModules().subscribe(
    //       (res: any) => {

    //         if (this.router?.url) {
    //           this.lead.setModule(res);
    //         };

    //         if (this.router.url === '/master/configurational-master') {
    //           if (res) {
    //             this.router.navigate([`master/configurational-master/${res[0]?.menuLink}`]);
    //           };
    //         };

    //         this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
    //           if (this.router.url === '/master/configurational-master') {
    //             if (res) {
    //               this.router.navigate([`master/configurational-master/${res[0]?.menuLink}`]);
    //             };
    //           };
    //         });

    //       })
    //     sub.unsubscribe();
    // });
  }

  goInToPage(m: any) {
    let loginUser: any = localStorage.getItem('signInUser');
    let role_id: any = JSON.parse(loginUser).role_id;
    this._authservice.getModuleActions(role_id, m).subscribe(
      (res) => {
      },
      (err) => {
        console.log(err);
      }
    )
  }

  // ngOnDestroy(): void {
  //   this.subM.unsubscribe();
  // }

  redirect = ( yr: any) => {

  }

  filterMasterData(event: any) {
    let filterValue = event.target.value
    filterValue = filterValue.trim().toLowerCase();
    this.filteredmodules = this.subModules.filter((module: any) =>
      module.menuName.toLowerCase().includes(filterValue)
    );
  }
}

