import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';
// import { EntityMasterService } from '../../../@shared/services/entity-master/entity-master.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { UpdatedSalesBookComponent } from '../updated-sales-book/updated-sales-book.component';
import { data } from 'jquery';
import { ViewProposalVersionDialogComponent } from '../../proposal/dialogs/view-proposal-version-dialog/view-proposal-version-dialog.component';
import { ProposalStatusDialogComponent } from '../../proposal/dialogs/proposal-status-dialog/proposal-status-dialog.component';

@Component({
  selector: 'app-sales-booking-action',
  templateUrl: './sales-booking-action.component.html',
  styleUrls: ['./sales-booking-action.component.scss']
})
export class SalesBookingActionComponent {
assignAction: any;
    dataAll:any;
    isValidDate:any;
  financial_year_id:any;
  entityId: any;
  userLoginId: any;
  userData:any;
  role_id:any;
    constructor(
      private route: Router,
      public dialog: MatDialog,
      private router: Router,
      private toaster: ToastrService,
      private _configurationalMasterService: ConfigurationalmasterService,
      private _rbackService: RbacMasterService,
      private entityService: EntityMasterService,
      private _commonService : CommonService,
    private $proposal: ProposalService,

    ) {}
  
    ngOnInit(): void {
      this.entityId = localStorage.getItem('selectedEntityId');
      this.financial_year_id = localStorage.getItem('financial_id');
      this.userLoginId = localStorage.getItem('EmpMainId');
      this.role_id = localStorage.getItem('role_master_id');

      let loginUser: any = localStorage.getItem('signInUser');
    this.userData = JSON.parse(loginUser);
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
      this.dataAll=params;
this.isNotExpired(this.dataAll?.data?.expiry_date)
    }
  isNotExpired(expiryDate:any) {
    const currentDate = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(expiryDate);
    expDate.setHours(0, 0, 0, 0);
    const isValid = expDate > today;
     console.log(isValid,"isValid<<<<<<<<<<");
     this.isValidDate=isValid
}
    getValueToDisplay(params: ICellRendererParams) {
      return params.valueFormatted ? params.valueFormatted : params.data.entity_id;
    }
  
    refresh(params: ICellRendererParams): boolean {
      this.cellValue = this.getValueToDisplay(params);
      return true;
    }
    // openDialog() { 
    //   const dialogRef = this.dialog.open(ViewComponent, {
    //     width: '35%',
    //     // maxWidth: '100vw',
    //     // maxHeight: '100vh',
    //     // height: '100%',
    //     // panelClass: 'full-screen-modal',
    //     data: { id: this.cellValue },
    //   });
  
    //   dialogRef.afterClosed().subscribe((result) => {});
    // }
  
    edit(e: any) {
      e.stopPropagation();
      this.router.navigate(["master/sales/create-proposal"], { queryParams: { proposalId: this.dataAll?.data?.proposal_id , version_id:this.dataAll?.data?.version_id,idPI:this.dataAll?.data?.id,status:'Edit SB',client_id:this.dataAll?.data?.customer_id,type:'existing_client',actionType:'create',quotationType:true} })

    }
    // view(e: any) {
    //   e.stopPropagation();
    //   this.router.navigate(["master/sales/create-proposal"], { queryParams: { proposalId: this.dataAll?.data?.proposal_id , version_id:this.dataAll?.data?.version_id,idPI:this.dataAll?.data?.id,status:'proformaAdd',type:"WithPO"} })

    // }
    viewProposalVersion() {
      
      let singleData:any={};
      singleData.id= this.dataAll?.data?.proposal_id;
      const dialogRef = this.dialog.open(ViewProposalVersionDialogComponent, {
        width: '90%',
        data: { id: singleData,isSalesBooking:true },
      });
      dialogRef.afterClosed().subscribe((result: any) => {
  
      });
    }
     statusCellClicked() {
      let singleData: any = {};

      if (this.dataAll && this.dataAll.data) {
       
        this.dataAll.data.id = this.dataAll.data.proposal_id;
      
        singleData = { ...this.dataAll.data };
      } else {
        console.warn("dataAll ya data undefined hai");
      }
      
             const dialogRef = this.dialog.open(ProposalStatusDialogComponent, { width: '800px', data: singleData });
             dialogRef.afterClosed().subscribe(result => {
    
             })
           }
        
    delete(e: any) {
      e.stopPropagation();
      Swal.fire({
        title: 'Are you sure you want to Remove it?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: "#f44336",
        confirmButtonColor: "#3f51b5",
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          this._commonService?.showLoader()
          this.entityService.deleteEntity(this.cellValue).subscribe(
            (res) => { 
              this._commonService?.hideLoader()
              this.toaster.success('Deleted successfully ');
              this.reloadCurrentRoute();
            },
            (err) => {
              this._commonService?.hideLoader()
              this.toaster.error("Somthing went wrong Please try agin", "Error Message")
            }
          )
        }
      });
    } 

    addPO(e:any){
     console.log(this.dataAll);
      
      this.router.navigate(["master/sales/create-proposal"], { queryParams: { proposalId: this.dataAll?.data?.proposal_id , version_id:this.dataAll?.data?.version_id,idPI:this.dataAll?.data?.id,status:'proformaAdd',type:"WithPO"} })

    }

    
    addPOWithout(e:any){
      console.log(this.dataAll);
       
       this.router.navigate(["master/sales/create-proposal"], { queryParams: { proposalId: this.dataAll?.data?.proposal_id , version_id:this.dataAll?.data?.version_id,idPI:this.dataAll?.data?.id,status:'proformaAdd',type:"WithoutPO"} })
 
     }

    reMail(e:any){
      
      if(this.dataAll?.data?.email_status === "ACCEPTED"){
        this.toaster.warning("Not Send Email", this.entityId,)
        return
      }
      const proposalId = Number(this.dataAll?.data?.proposal_id);
      const versionId = Number(this.dataAll?.data?.version_id);
      const idPI = Number(this.dataAll?.data?.version_id);
      
      let data = {
        
        login_id: this.userLoginId,
        request_type: 'normal',
        
        employee_id: this.userData?.employee_id,
        
        version_id: versionId,
        proposal_id: proposalId,
       
        is_so_created: true,
        entity_id:this.entityId,
        contact_person_name:this.dataAll?.data?.contact_person_name,
        mail_id:this.dataAll?.data?.mail_id,
       
        // version_id:versionId,
        status:"proformaAddMail",
        idPI:idPI,
        // send_pi_link:true
        send_pi_link: `${window.origin}/send-pi-link?proposalId=${proposalId}&version_id=${versionId}&status=proformaAddMail&idPI=${idPI}&pageMode=piLink&type=edit`,
        // `http://localhost:4200/send-pi-link?proposalId=${proposalId}&version_id=${versionId}&status=proformaAddMail&idPI=${idPI}`
      };
      
      this.$proposal.createproforma(data).subscribe(
        (res: any) => {
          if (res) {
            this.toaster.success(res.message);
           
          }
         
        },
        ((err:any) => {
         
        })
      );
    }

    comercialApproved(e:any){
      
      // if(this.role_id == 1 || this.role_id == 7){
        this.router.navigate(["master/sales/create-proposal"], { queryParams: { proposalId: this.dataAll?.data?.proposal_id , version_id:this.dataAll?.data?.version_id,idPI:this.dataAll?.data?.id,status:'approvalPI'} })

      // }else{
      //   return this.toaster.warning("Only Access For Back Office Team");
      // }

    }
  

    updatedSales(e:any){
      e.stopPropagation();
      // this.prService.procurementProductId.next(this.cellValue.data.purchase_request_id)
      const dialogRef = this.dialog.open(UpdatedSalesBookComponent, {width: '450px', data: {cellData: this.dataAll?.data,status:"customerReject"}});
      dialogRef.afterClosed().subscribe(result => {

      })
    }
  }



