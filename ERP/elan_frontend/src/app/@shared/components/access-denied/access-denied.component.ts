import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss']
})
export class AccessDeniedComponent {
  constructor(private router: Router,private location:Location) { }

  goBack() {
    
    const previousRoute = sessionStorage.getItem('previousRoute');

    if (previousRoute) {
      const decodedRoute = decodeURIComponent(previousRoute);
      window.location.href = decodedRoute
      sessionStorage.removeItem('previousRoute'); 
    } else {
      // If no previous route is found, redirect to the home page or a default route
      this.router.navigate(['master/ess/dashboard']);
    }
  }
  
}
