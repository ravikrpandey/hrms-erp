import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { environment } from 'src/app/environments/environment';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AssignUserService } from 'src/app/@shared/services/crm/assign-user.service';
import { ToastrService } from 'ngx-toastr';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { RecruitService } from 'src/app/@service/recruitment.service';
@Component({
  selector: 'app-close-deal-dialog',
  templateUrl: './close-deal-dialog.component.html',
  styleUrls: ['./close-deal-dialog.component.scss'],
})
export class CloseDealDialogComponent {
  dataList: any = [];

  userLoginId: any;
  loading: boolean = false;
  leadId: any;
  proposalId: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastrService,
    private $proposal: ProposalService,
    public dialog: MatDialogRef<CloseDealDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.userLoginId = localStorage.getItem('EmpMainId');
    this.route.queryParams.subscribe((params: any) => {
      this.leadId = params?.id;
      if (this.leadId) {
        this.dealCloseVersionByLeadId();
      }
    });
  }

  // Get version
  dealCloseVersionByLeadId() {
    
    try {
      this.$proposal
        .dealCloseVersionByLeadId(this.leadId, this.userLoginId)
        .subscribe(
          (response: any) => {
            if (response) {
              if (response?.data?.length) {
                this.dataList = response?.data;
              } else {
                return this.toast.error(
                  'Please create at least one proposal for lead close',
                  'Fields Error'
                );
              }
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } catch (error) {
      console.log(error);
    }
  }
  // Get version

  closeProposal(data: any) {
    this.dataList?.map((item: any) => {
      if (item?.version == data?.version) {
        item.isClosed = true;
      } else {
        item.isClosed = false;
      }
    });
  }

  closeLeadCreate() {
    let closedProposal = this.dataList.find(
      (elem: any) => elem?.isClosed == true
    );
    if (
      !(
        closedProposal?.proposal_id ||
        closedProposal?.version_id ||
        closedProposal?.version
      )
    ) {
      return this.toast.error(
        'Please create at least one proposal for lead close',
        'Fields Error'
      );
    } else {
      this.dialog.close(closedProposal);
    }
  }

  // viewProposal(data: any) {
  //   this.dialog.close();
  //   this.router.navigate(['master/crm/create-proposal'], {
  //     queryParams: {
  //       version_id: data?.version_id,
  //       proposalId: data?.proposal_id,
  //       actionType: 'view',
  //     },
  //   });
  // }
  viewProposal(data: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['master/crm/create-proposal'], {
        queryParams: {
          version_id: data?.version_id,
          proposalId: data?.proposal_id,
          actionType: 'view',
        },
      })
    );
    window.open(url, '_blank');
  }
  
}
