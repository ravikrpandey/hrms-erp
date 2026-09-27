import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/@auth/auth-material/auth.service';

@Component({
  selector: 'app-vendor-sidebar-menu',
  templateUrl: './vendor-sidebar-menu.component.html',
  styleUrls: ['./vendor-sidebar-menu.component.scss']
})
export class VendorSidebarMenuComponent {
 // public collapsed: boolean = false;
 public collapsed: boolean = true;
 public farward: boolean = false;
 MenuData: any;
 sidebarList: any;
 handleSidebarData: boolean = true;
 dashboardActive: boolean = true;
 // navIndexvalue: any = null;
 activeModuleIndex: number | null = null;
 activeSubModuleIndex: number | null = null;
 menuSubscription: Subscription;
 @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  loginUserDetails: any;
 constructor(
   private router: Router,
   private route: ActivatedRoute,
   private _auth_service:AuthService
  ) {

 }

 config: any;


 ngOnInit() {
  this.loginUserDetails = localStorage.getItem("signInUser");
  this.loginUserDetails = JSON.parse(this.loginUserDetails)
  this.getAll_vendorMenu();
 }

 ngOnDestroy(): void {
  //  this.menuSubscription.unsubscribe();
 }
 fun() {
   this.farward = false;
 }

 getAll_vendorMenu(){
  this._auth_service.getAll_vendorMenu(this.loginUserDetails?.vendor_type_id).subscribe((res:any)=>{
    if(res){
      this.sidebarList=res.data
    }
  },(err:any)=>{

  })
 }
 openMenu(nav: any) {
  this.dashboardActive = false;

  this.sidebarList?.map((menu: any) => {
    if (nav?.id === menu?.id) {
      menu.isActive = !menu.isActive;

      if (!menu.isActive) {
        menu.submenuData = null;
      } else {
        this._auth_service.getAll_vendor_SubMenu(nav?.id).subscribe(
          (res: any) => {
            if (res) {
              menu.submenuData = res.data;
            }
          },
          (err: any) => {
            console.error(err);
          }
        );
      }
    } else {
      menu.isActive = false;
      menu.submenuData = null;
    }
  });
}
openSubMenu(sub:any){
  this.sidebarList?.map((menu: any) => {
    menu?.submenuData?.map((subMenu: any) => {
      if (subMenu?.vendor_menu_id == sub?.vendor_menu_id) {
        subMenu.isActive = !subMenu.isActive;
      } else {
        subMenu.isActive = false;
      }
        const url = `${menu?.module_master_link}/${sub?.menu_master_link}`;
        this.router.navigateByUrl(`vendor/${url}`);

  });
});
}
}
