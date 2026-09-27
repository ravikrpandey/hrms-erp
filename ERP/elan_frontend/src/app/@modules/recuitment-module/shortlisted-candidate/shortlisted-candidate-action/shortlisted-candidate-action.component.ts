import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { OfferLetterService } from 'src/app/@shared/services/service/recruitment/offer-letter.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-shortlisted-candidate-action',
  templateUrl: './shortlisted-candidate-action.component.html',
  styleUrls: ['./shortlisted-candidate-action.component.scss'],
})
export class ShortlistedCandidateActionComponent implements OnInit {
  assignAction: any;
  databaseKey: any;
  baseHref: any;

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private _rbackService: RbacMasterService,
    private $offerLetter: OfferLetterService,
    private toast: ToastrService,
    private clipboard: Clipboard
  ) {
    this.databaseKey = environment.servralUrl;
    this.baseHref = environment.servralUrl;
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

  params: any;
  agInit(params: ICellRendererParams): void {
    this.paramsVal = params.data;
    console.log(this.paramsVal,"}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}")
    this.cellValue = this.getValueToDisplay(params);
    this.params = params;
  }

  getValueToDisplay(params: ICellRendererParams) {

    return params.data.id;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  offerLetterOpen() {
    this.route.navigate(['master/recruitment/shortlisted-candidate/create-candidate-offer-letter'], { queryParams: { id: this.paramsVal?.id } })
  }

  generatePdf() {
    let entity_id = localStorage.getItem("selectedEntityId");
    Swal.fire({
      title: 'Are you sure?',
      text: "You want be generate offer letter !",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#be0000',
      cancelButtonColor: '#858586',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        let req = {
          candidate_id: this.paramsVal?.id,
          entity_id: entity_id,
          jd_id: this.paramsVal?.job_descripition_id,
        }
        this.$offerLetter.generate_pdf(req).subscribe((res: any) => {
          if (res) {
            this.toast.success(res?.message);
            this.params.onActionPerform({ status: true });
          }
        })
      };
    })
  }

  download_offer_letter() {
    let url = `${this.databaseKey}/api/WL/download_offer_letter/${this.paramsVal?.id}`;
    if (url) {
      window.open(url, '_blank');
    }
  }

  copyLink() {
    let link_url = this.baseHref + '/candidate-offer-letter' + '/?id=' + String(this.paramsVal?.id);
    this.clipboard.copy(link_url);
  }
  sendLink() {
    console.log(this.cellValue)
    try {
      let entity_id = localStorage.getItem("selectedEntityId");
      let req = {
        candidate_id: this.paramsVal?.id,
        entityId: entity_id,
        link_url: this.baseHref + '/candidate-offer-letter' + '/?id=' + String(this.paramsVal?.id),
      }
      this.$offerLetter.sendCandidate_offer_letter_link(req).subscribe((res: any) => {
        if (res) {
          this.toast.success(res?.message);
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

}
