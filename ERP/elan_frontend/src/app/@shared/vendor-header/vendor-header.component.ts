import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/@auth/auth-material/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-header',
  templateUrl: './vendor-header.component.html',
  styleUrls: ['./vendor-header.component.scss']
})
export class VendorHeaderComponent implements OnInit {


  constructor(private _authservice:AuthService,private route: Router,) {


  }
ngOnInit(): void {
  this.loginUserDetails = localStorage.getItem("signInUser");
    this.loginUserDetails = JSON.parse(this.loginUserDetails)
}
currentLanguage: any;
rating: any;
last_name: any;
parse: any;
imagePath: any;
setLanguage(arg0: string) {
throw new Error('Method not implemented.');
}
seeProfile(arg0: any) {
throw new Error('Method not implemented.');
}
loginUserDetails: any;
baseUrl: any;
  onLogout() {
    Swal.fire({
      title: 'Are you sure want to Logout?',
      icon: 'warning',
      showCancelButton: true,

      cancelButtonColor: "#858586",
      confirmButtonColor: "#f44336",
      confirmButtonText: 'Log out',
      cancelButtonText: 'Not Now'
    }).then((result:any) => {
      if (result.value) {
        this._authservice.vendorlogout();

        localStorage.removeItem('token');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }
rowDataOther: any;
lengths: any;
rowDataNotifications: any;
show: any;
condition: any;

 changePassword(){
    //this.route.navigate(['master/hrms/employee-master/change-password']);
  }

}
