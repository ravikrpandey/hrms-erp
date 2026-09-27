import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QueryEncryptService } from 'src/app/@shared/services/transport-management/query-encrypt.service';

@Component({
  selector: 'app-vh-transporter-response',
  templateUrl: './vh-transporter-response.component.html',
  styleUrls: ['./vh-transporter-response.component.scss']
})
export class VhTransporterResponseComponent {
  status: any;
  inActive:boolean=false;
  type:any;
  constructor(
    private route: ActivatedRoute,
    private encryptService:QueryEncryptService
  ) { }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {

      const statusParam = params['status']
        ? this.encryptService.decrypt(params['status'])
        : null;

      const typeParam = params['type']
        ? this.encryptService.decrypt(params['type'])
        : null;

      if (statusParam === 'a') {
        this.status = 'Accepted';
        this.type = 'Accepted';
        this.inActive = false;
        return;
      }

      if (statusParam === 'r') {
        this.status = 'Rejected';
        this.type = 'Rejected';
        this.inActive = false;
        return;
      }

      if (typeParam) {
        this.inActive = true;
        this.type = typeParam === 'HOLD' ? 'Rejected' : 'Accepted';
        this.status = 'This planning request has already been processed.';
        return;
      }

     
      this.inActive = true;
      this.type = 'Cancelled';
      this.status = 'Please be informed that this planning has been cancelled by the administrator.';
    });
  }
}
