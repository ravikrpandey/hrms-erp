import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { environment } from 'src/app/environments/environment';
const databaseKey: any = environment.servralUrl;
@Component({
  selector: 'app-asset-logo',
  templateUrl: './asset-logo.component.html',
  styleUrls: ['./asset-logo.component.scss']
})
export class AssetLogoComponent {
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
    this.cellValue = params.data.image;
    this.cellValue = databaseKey + '/' + this.cellValue;
  }

}
