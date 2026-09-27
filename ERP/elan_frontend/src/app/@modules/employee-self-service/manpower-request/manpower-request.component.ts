import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-manpower-request',
  templateUrl: './manpower-request.component.html',
  styleUrls: ['./manpower-request.component.scss']
})
export class ManpowerRequestComponent {
  currentUrl: any;
  showBtn: boolean=false;
  assignAction: any;
  constructor(private route: Router,
    private _rbackService:RbacMasterService,
    ) {
      this.currentUrl = this.route.url;
      console.log('Current URL:', this.currentUrl);
  
      if(this.currentUrl == '/master/ess/manpower-request/my-request-manpower'){
  this.showBtn=true
      }else{
        this.showBtn=false

      }
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  
  }
  navigate() {
    this.route.navigate(['master/ess/manpower-request/new-request-create'])
  }
}

