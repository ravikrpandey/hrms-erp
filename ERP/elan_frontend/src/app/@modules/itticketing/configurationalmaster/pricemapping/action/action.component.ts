import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { LmsServiceService } from 'src/app/@shared/services/lms-service.service';
import { ToastrService } from 'ngx-toastr';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import Swal from 'sweetalert2';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent {
  docID: any
  getFormData: any
  downloadData: any
  params_1: any
  achieveId: any;
  training_id: number;
  scheduled_dateGet: any;
  status_dataGet: any;
  current_Date: string;
  returnDate: string;
  user_status: any;
  params: ICellRendererParams<any, any>;
  Add_user_status: any;
  Login_user_id: any = localStorage.getItem('signInUser');
  loginUserId: any = JSON.parse(this.Login_user_id).employee_id
  loginUserName: any = JSON.parse(this.Login_user_id).first_name
  paramss: any;
  paramss1: any;
  paramss1Re: any;
  maping_id: any;
  maping_id_non: any;
  Maping_ids: any;
  productName: any;
  constructor(private route: Router,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _lmsService: LmsServiceService,
    private router: Router,
    public dialog: MatDialog, private toast: ToastrService, private recruitService: RecruitService) {
  }


  ngOnInit(): void {
  }
  public cellValue: any;
  agInit(params: ICellRendererParams): void {
    this.params_1 = params
    this.maping_id = params.data.cert_price_mapping_id
    this.maping_id_non = params.data.noncert_price_mapping_id
    this.productName = params.data.product_master_name

 this.Maping_ids= this.maping_id ||  this.maping_id_non
    this.cellValue = this.getValueToDisplay(params);
    this.params = params;
  }
  getValueToDisplay(params: ICellRendererParams) {
  this.training_id=params.data.traning_id
  this.paramss=params.data.employee_id
  this.paramss1=params.data.author_course_id
  console.log(this.params,"paramsss");
  this.paramss1Re=params.data.result
    return params.data.content_id;
  }
  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
  edit(e:any){
    e.stopPropagation();
    this.route.navigate(['master/itticket/configurational-master/price-master'],
    { queryParams: { id: this.Maping_ids}})
    console.log(this.maping_id,"maping");
   
  }

  delete(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: `Delete`,
      text: 'Do you want to delete product price?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#858586",
      confirmButtonColor: "#f44336",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, Skip'
    }).then((result: any) => {
      if (result.isConfirmed) {
        console.log(this.maping_id,'map_id');
        this._configurationalMasterService.deletePrice(this.productName).subscribe((res:any)=>{
          this.toast.success("Delete Successfully..")
         this.reloadCurrentRoute();
        },
        (err:any)=>{
          this.toast.error("Somthing wents wrong")

        }
        )
        
    
      }
      else {
      }
    })
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  }

