import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-driver-master',
  templateUrl: './create-driver-master.component.html',
  styleUrls: ['./create-driver-master.component.scss']
})
export class CreateDriverMasterComponent {
  active: boolean = false;
  id: any;
  driver_id: any;
  data: any;
  urll: any;
  urll2: any
  title: string = 'BASIC-DRIVER'

  edited_ID: any;
  action_type: any;

  constructor( private activeroute: ActivatedRoute, private route: Router) { }

  ngOnInit(): void {


    this.activeroute.queryParams.subscribe(params => {
      this.id = params;
      this.action_type = this.id?.action_type;
      this.driver_id = this.id.driver_id

    })


  }



  goToBasicDetails(title: string) {
    console.log(this.edited_ID, "this.edited_ID")
    this.title = title
    if (this.action_type) {
    this.route.navigate(['/master/transport-management/driver-master/create-driver/basic-driver'], { queryParams: { driver_id: this.driver_id, action_type: 'view' } })
    }
    else {
    this.route.navigate(['/master/transport-management/driver-master/create-driver/basic-driver'],{ queryParams: { driver_id: this.driver_id}})
    }
  };

  goToContactDetails(title: string) {
    
    console.log(this.edited_ID, "this.edited_ID")
    this.title = title
    if (this.action_type) {
      this.route.navigate(['/master/transport-management/driver-master/create-driver/contact-address'], { queryParams: { driver_id: this.driver_id, action_type: 'view' } })
    }
    else {
      this.route.navigate(['/master/transport-management/driver-master/create-driver/contact-address'],{ queryParams: { driver_id: this.driver_id}})
    }
  };

  goToLicenseDetails(title: string) {
    console.log(this.edited_ID, "this.edited_ID")
    this.title = title
    if (this.action_type) {
      this.route.navigate(['/master/transport-management/driver-master/create-driver/license-compliance'], { queryParams: { driver_id: this.driver_id, action_type: 'view' } })
    }
    else {
      this.route.navigate(['/master/transport-management/driver-master/create-driver/license-compliance'],{ queryParams: { driver_id: this.driver_id}})
    }
  };

  goToEmployementDetails(title: string) {
    console.log(this.edited_ID, "this.edited_ID")
    this.title = title
    if (this.action_type) {
      this.route.navigate(['/master/transport-management/driver-master/create-driver/employment-assignment'], { queryParams: { driver_id: this.driver_id, action_type: 'view' } })
    }
    else {
      this.route.navigate(['/master/transport-management/driver-master/create-driver/employment-assignment'],{ queryParams: { driver_id: this.driver_id}})
    }
  };

  goToDocumentDetails(title: string) {
    console.log(this.edited_ID, "this.edited_ID")
    this.title = title
    if (this.action_type) {
      this.route.navigate(['/master/transport-management/driver-master/create-driver/attachments-Documents'], { queryParams: { driver_id: this.driver_id, action_type: 'view' } })
    }
    else {
      this.route.navigate(['/master/transport-management/driver-master/create-driver/attachments-Documents'],{ queryParams: { driver_id: this.driver_id}})
    }
  };



  goBack() {

  }

}

