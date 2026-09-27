import { Component,OnDestroy,OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/@auth/auth-material/auth.service';
import { HeadService } from 'src/app/@shared/services/head.service';
import { LeadService } from 'src/app/@shared/services/lead.service';



@Component({
  selector: 'app-itticketing',
  templateUrl: './itticketing.component.html',
  styleUrls: ['./itticketing.component.scss']
})
export class ItticketingComponent implements OnInit, OnDestroy{
  clicked: boolean = false;
  suSupModule:any;
  constructor(private head:HeadService, private router:Router, private lead: LeadService, private _authservice:AuthService){

  }
  leftMenuData:any = [
    {id:1, module:'itticketing', menuName:'Configurational Master',menuLink:'configurational-master',menuIcon:'center_focus_weak'},
    {id:2, module:'itticketing', menuName:'Ticket Management',menuLink:'ticket-management',menuIcon:'flight'},
    // {id:3, module:'itticketing', menuName:'Expense Management',menuLink:'expense-management',menuIcon:'attach_money'},
    {id:3, module:'itticketing', menuName:'Export Data',menuLink:'export-data',menuIcon:' import_export'},
    
    {id:4, module:'itticketing', menuName:'Purchase & Inventory',menuLink:'purchase-inventory' ,menuIcon:'input'},
    {id:5, module:'itticketing', menuName:'Admin Settings',menuLink:null ,menuIcon:'widgets'},
     ]
    ngOnInit(): void {
      this.head.clicked.subscribe(data=>{
        this.clicked = data;
      })
      
      // if(this.router.url){
      //   this.lead.setModule(this.leftMenuData)
      // }

      let lg: any = localStorage.getItem('signInUser')
    let loginUser = JSON.parse(lg);

    let role_master_id = localStorage.getItem("role_master_id")
    let entity_id = localStorage.getItem("selectedEntityId")
    let req = {
      employee_id: loginUser?.employee_id,
      role_master_id: role_master_id,
      entity_id: entity_id,
    }
      let sub = this._authservice.getAllAccess_Modules(req).subscribe(
        (res) => {
          // 
           this.suSupModule = this._authservice.getSubSuperModules().subscribe(
            (res: any) => {
              
              if(this.router?.url){
                this.lead.setModule(res)
              }
              if (this.router.url === '/master/itticket') {
                if (res) {
                  this.router.navigate([`master/itticket/${res[0]?.menuLink}`]);
                };
              };
      
              this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
                if (this.router.url === '/master/itticket') {
                  if (res) {
                    this.router.navigate([`master/itticket/${res[0]?.menuLink}`]);
                  };
                };
              });
            }
          )
          sub.unsubscribe();
        }
        
      )
    }
    
    ngOnDestroy(): void {
      this.suSupModule?.unsubscribe();
    }
}
