import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { BgvService } from 'src/app/@shared/services/service/recruitment/bgv.service';
import { OfferLetterService } from 'src/app/@shared/services/service/recruitment/offer-letter.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-bgv-send-on-mail-action',
  templateUrl: './bgv-send-on-mail-action.component.html',
  styleUrls: ['./bgv-send-on-mail-action.component.scss'],
})
export class BgvSendOnMailActionComponent implements OnInit {
  assignAction: any;
  baseHref: any;
  databaseKey : any

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private _rbackService: RbacMasterService,
    private _bgvService: BgvService,
    private toast: ToastrService,
  ) {
    this.databaseKey = environment.serverUrl;
    this.baseHref = environment.baseHref;
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }

  public cellValue: any;
  public paramsVal: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
  
    this.paramsVal = params.data;
    this.cellValue = this.getValueToDisplay(params);
  }

  getValueToDisplay(params: ICellRendererParams) {

    return params.data.candidate_id;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  bgvSendOnMailOpen() {
   
    this.route.navigate(['master/recruitment/bgv/bgv-send-on-mail'], { queryParams: { id: this.paramsVal?.id } })
  }

  companyReviewsView() {
    
    this.route.navigate(['master/recruitment/bgv/view-company-remarks'], { queryParams: { id: this.paramsVal?.id } })
  }

  viewBgvMailDetail() {
   
    this.route.navigate(['master/recruitment/bgv/view-company-remarks'], { queryParams: { id: this.paramsVal?.id, actionType:'view' } })
  }

  sendLink() {
    try {
      let entity_id = localStorage.getItem("selectedEntityId");
      let req = {
        candidate_id: this.paramsVal?.id,
        entityId: entity_id,
        email_url: this.baseHref + 'candidate-upload-document',
      }
      this._bgvService.candidate_update_doc_mail(req).subscribe((res: any) => {
        if (res) {
          this.toast.success(res?.message);
          try {
            navigator.clipboard.writeText(res.data).then(() => {
              this.toast.success(`link:- ${res.data} copied successfully`);
            }).catch(err => {
              console.error('Failed to copy the link:', err);
              this.toast.error('Failed to copy link');
            });
          } catch (err) {
            console.error('Clipboard API not supported:', err);
            this.toast.error('Clipboard API not supported');
          }

        }
      })
    } catch (err) {
      console.log(err)
    }
  }


}
