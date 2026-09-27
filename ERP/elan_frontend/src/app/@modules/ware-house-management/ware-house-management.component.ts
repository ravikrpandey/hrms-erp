import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/@auth/auth-material/auth.service';
import { LeadService } from 'src/app/@shared/services/lead.service';

@Component({
  selector: 'app-ware-house-management',
  templateUrl: './ware-house-management.component.html',
  styleUrls: ['./ware-house-management.component.scss'],
})
export class WareHouseManagementComponent {
  clicked: boolean = false;
  
  ngOnInit(): void {}
}
