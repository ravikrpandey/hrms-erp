import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { CondidateProfileService } from 'src/app/@shared/services/service/recruitment/condidate-profile.service';
import { ShortlistedCandidateService } from 'src/app/@shared/services/service/recruitment/shortlisted-candidate.service';
import {SearchProfileActionComponent} from 'src/app/@modules/recuitment-module/condidate-profile/search-profile/search-profile-action/search-profile-action.component';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-search-profile',
  templateUrl: './search-profile.component.html',
  styleUrls: ['./search-profile.component.scss']
})
export class SearchProfileComponent implements OnInit {
  job_id: any;
  id: any;
  profileDetails: any = {};
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowDataJob:any=[];
  keyword:any;
  emp:any;
  getAllSuperviserData:any=[];
  title:any;
  constructor(
    private activeroute: ActivatedRoute,
    private $condidateProfile: CondidateProfileService,
    private _empService: EmpRegistrationService,
    private toast:ToastrService
  ) {
      this.rowClass = 'rowClass'
}
  ngOnInit(): void {
    let loginUser: any = localStorage.getItem('signInUser');
    this.emp = JSON.parse(loginUser)
    this.getAllSuperviser();
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
      this.job_id = this.id.job_id;
    });
    this.getAllJobDescription('All')
    this.getAll_profile();
  }

 onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  getAllJobDescription(selection_status: any) {

    let query = {
      selection_status: selection_status,
      jd_id: this.job_id,
    }
    this.$condidateProfile.getAll_candidate_BY_JD_id(query).subscribe((res: any) => {
      this.profileDetails = res?.data[0];
      this.keyword=res?.skills[0]?.job_title +', '+res?.skills[0]?.skill_Name;
  this.title=res?.skills[0]?.job_title;

  })
}
 public columnDefs = [
    {
      headerName: 'S. No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    {
      headerName: 'Candidate Name',
      field: 'username',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'Contact No',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
      valueGetter: (params: any) => `${params.data.contact_number}`
    },

    {
      headerName: 'Email ID',
      field: 'email',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
          headerName: 'CV',
          field: 'id',
          flex: 1,
          minWidth: 150,
          cellRenderer: SearchProfileActionComponent,
          cellRendererParams: {
            className: 'mat-blue',
            hideRequestButton: true,
            hideDetailsButton: false,
            hideDownloadIcon: false,
            showCustomIcon: false, // Hide attachment icon
          },
          cellClass: "grid-cell-centered"
        }

  ];
  selectedProfile: any = [];
  onSelectionChanged(event: any): void {
    this.selectedProfile = [];
    let selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows?.length) {
      this.selectedProfile = [...selectedRows];
    }
  }
  handleSearch() {
    this.$condidateProfile.solr_search(this.keyword).subscribe((res: any) => {
      if (res.data.length > 0) {
        let data = res.data;
        let filteredData = data.filter((job: any) =>
          !this.getAllSuperviserData.some((supervisor: any) =>
            supervisor.emp_personal_email === job.email || supervisor.contact_number === job.contact_number
          )
        );

        let new_data = filteredData.filter((res: any) => {
          return !this.getAlljdProfile.some((jd: any) =>
            jd.email === res.email || jd.contact_number === res.contact_number
          );
        });
        // start code by ritik for demo 17/02/25
        // this.rowDataJob = new_data;
        this.rowDataJob = filteredData;
        // end code by ritik for demo 17/02/25


        if (this.rowDataJob.length === 0) {
          this.toast.error('No Record Found!');
        }
      } else {
        this.toast.error('No Record Found!');
      }
    }, (err: any) => {
      console.error(err);
    });
  }

  getAllSuperviser() {
    let entity_id = localStorage.getItem("selectedEntityId");
    this._empService.grtEmployeeList(entity_id, this.emp?.role).subscribe((res: any) => {

      this.getAllSuperviserData = res.data;

    });
  }
  getAlljdProfile:any=[];
  getAll_profile() {
    let entity_id = localStorage.getItem("selectedEntityId");
    this.$condidateProfile.getAll_profile(entity_id).subscribe((res: any) => {

      this.getAlljdProfile = res.data;

    });
  }
  handleSubmit(){
     if(this.selectedProfile.length>0){
       let data={
        profile_type:'EMPLOYEE',
        created_by:this.emp?.employee_id,
        jd_id:this.job_id,
        bulkprofile:this.selectedProfile
       }
      this.$condidateProfile.create_new_candidate(data).subscribe((res:any)=>{
        if(res){
          this.toast.success('Profile Create Successfully');
          window.history.back();
        }
      },(err:any)=>{

      })
     }else{
       this.toast.error('please select at least one!')
     }
  }
  goBack() {
    window.history.back();
  }

}
