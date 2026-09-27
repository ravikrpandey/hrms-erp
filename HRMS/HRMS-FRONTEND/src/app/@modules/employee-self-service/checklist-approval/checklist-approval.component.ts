import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checklist-approval',
  templateUrl: './checklist-approval.component.html',
  styleUrls: ['./checklist-approval.component.scss']
})
export class ChecklistApprovalComponent {

  currentUrl: any;
  showBtn: boolean=false;
  resignation: boolean=false;
 
  constructor(private route: Router
    ) {
      this.currentUrl = this.route.url;
      console.log('Current URL:', this.currentUrl);
  
      if(this.currentUrl == '/master/ess/resignation/my-list-resignation'){
  this.showBtn=true
      }else{
        this.showBtn=false

      }

      
    
           
  }

  ngOnInit(): void {
    if(this.currentUrl == '/master/ess/resignation/my-request-resignation' ){
        this.resignation=true
            }
  }
  navigate() {
    this.route.navigate(['/master/ess/resignation/new-request-create'])
  }


}
