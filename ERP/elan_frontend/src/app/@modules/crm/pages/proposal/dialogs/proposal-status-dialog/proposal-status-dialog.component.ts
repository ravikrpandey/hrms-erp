import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';

@Component({
  selector: 'app-proposal-status-dialog',
  templateUrl: './proposal-status-dialog.component.html',
  styleUrls: ['./proposal-status-dialog.component.scss']
})
export class ProposalStatusDialogComponent {
  cellData:any;
constructor(public dialog: MatDialogRef<ProposalStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,  private toast: ToastrService,
        private $crm: CrmService,
        private $proposal: ProposalService,
    private _commonService : CommonService, 
    private route: Router,) {
    this.cellData = this.data;
    console.log(data,'dataa');
    
  }
  getdataCopy:any;
  remarkshow: any;
  notCreatedFlow:boolean=false;

  ngOnInit(): void {
    
    this.approveLeavel();
  }
  approveLeavel() {
    
      let dep_id=this.cellData?.department_id;
     let  id=this.cellData?.id;
      let workflow_type='Quotation';
    
    this._commonService?.showLoader()
    
this.$proposal.getAllApprovalLevelProposal(dep_id,workflow_type,id,this.cellData?.version_id).subscribe((res:any)=>{
  this.getdataCopy=res.data
  this._commonService?.hideLoader()
},
((err:any)=>{
  this._commonService?.hideLoader()
  if(err.status==400){
this.notCreatedFlow=true;
  }
})
)
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }


  view(e:any){
    console.log(e,'eeeee');
    this.remarkshow=e.remark || "No Remark Available";
  }
  getFormattedRemark(remark: string): string {
    if (!remark) return '';
  
    return remark
      .split(',')
      .map(part => {
        const firstWord = part.trim().split(' ')[0];
        if (!firstWord) return '';
        return firstWord.substring(0, 5) + '...';
      })
      .filter(Boolean) // remove empty strings
      .join(', ');
  }
  
  
}
