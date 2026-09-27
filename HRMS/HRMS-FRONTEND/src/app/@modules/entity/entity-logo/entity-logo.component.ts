import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.serverUrl;
@Component({
  selector: 'app-entity-logo',
  templateUrl: './entity-logo.component.html',
  styleUrls: ['./entity-logo.component.scss']
})
export class EntityLogoComponent {
  assignAction: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _rbackService: RbacMasterService
  ) {}

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }
  public cellValue: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.cellValue = databaseKey + '/uploaded_files/' + this.cellValue;
  }

  getValueToDisplay(params: ICellRendererParams) {
    console.log(params.data)
    return params.valueFormatted ? params.valueFormatted : params.data.logo;
  }

  
}
