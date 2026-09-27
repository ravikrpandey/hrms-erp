import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/app/environments/environment';
import { ProvideBranchService } from 'src/app/@shared/services/crmService/provide-branch.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { CampaignService } from 'src/app/@shared/services/campaignService/campaign.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AllCampaignToFolderComponent } from '../all-campaign-to-folder/all-campaign-to-folder.component';
import { FolderDialogComponent } from '../folder-dialog/folder-dialog.component';
import { CampaignDialogComponent } from '../campaign-dialog/campaign-dialog.component';
import { MoveToFolderDialogComponent } from '../move-to-folder-dialog/move-to-folder-dialog.component';
import { CampaignToFolderComponent } from '../campaign-to-folder/campaign-to-folder.component';
import { TemplateDialogComponent } from './template-dialog/template-dialog.component';
@Component({
  selector: 'app-template-campaign',
  templateUrl: './template-campaign.component.html',
  styleUrls: ['./template-campaign.component.scss']
})
export class TemplateCampaignComponent {
  campaigns: any[] = [];
  filteredCampaigns: any[] = [];
  paginatedCampaignsAll: any[] = [];
  paginatedSmsCampaignsAll: any[] = [];
  paginatedCampaignsVerified: any[] = [];
  paginatedCampaignsUnverified: any[] = [];
  errorMessage: string | null = null;
  gridApi!: GridApi;
  columnDefs = [];
  defaultColDef = {};
  gridOptions: GridOptions = {};
  filterCondition: string = 'all';
  searchText: any;
  isLoading: boolean = false;
  pageSize: number = 10;
  currentPageAll: number = 0;
  currentSmsPageAll: number = 0;
  currentPageVerified: number = 0;
  currentPageUnverified: number = 0;
  totalCampaignsAll: number = 0;
  totalSmsCampaignsAll: number = 0;
  totalCampaignsVerified: number = 0;
  totalCampaignsUnverified: number = 0;
  filteredData: any[] = [];
  tab_status: string = "My Records";
  panelOpenState = false;
  parentFolderId: any;
  childFolderId: any;
  selectedIndex: number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  filterData: any;
  folderList: any;
  folderDetails: any;
  folderData: any = "folders";
  showFolder: boolean = true;
  getFolderInfo: any;
  isFolderPanelExpanded: any = true;
  parentInformation: any;
  childInformation: any;
  getChildValue: any;
  getParentValue: any;
  backButton: boolean = true;
  contentTypeList: { id: number; type: string; description: string }[] = [
    { id: 1, type: 'Draft', description: 'Campaigns saved as drafts' },
    { id: 2, type: 'Sent', description: 'Campaigns that have been sent' },
    { id: 3, type: 'Scheduled', description: 'Scheduled campaigns' },
    { id: 4, type: 'Archived', description: 'Archived campaigns' },
    { id: 5, type: 'Running', description: 'Currently running campaigns' },
    { id: 6, type: 'Suspended', description: 'Suspended campaigns' }
  ];
  selectedCampaignIds: number[] = []; // Array to store selected campaign IDs
  selectAllChecked: boolean = false;


  constructor(private campaignService: CampaignService, public route: ActivatedRoute,
    public router: Router, private dialog: MatDialog, private branchSend: ProvideBranchService,
    private toster: ToastrService,
  ) { }

  private params: any;
  public value: string;
  id: any;

  agInit(params: any): void {
    this.params = params;
    this.value = this.params.value;
    this.id = this.params.data.id
  }

  refresh(params: any): boolean {
    if (params && params.value !== undefined) {
      this.value = params.value;
      return true;
    }
    return false; // Return false if params or value is not valid
  }

  ngOnInit() {

    this.getFolderInfo = this.campaignService.getFolderInfo();
    this.fetchAllCampaign();
    this.getAllCampaignFolder();
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => this.applyPagination());
  }

  sevralUrl() {
    return environment.serverUrl + '/uploaded_files/';
  }

  tabs = [
    { id: 1, name: 'My Quotations' },
    { id: 2, name: 'All Quotations' }
  ]

  myId: any = 1;
  language: any = 'English';
  onTabChange(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
    if(this.selectedIndex==0){
      this.fetchAllCampaign();
    }
    if(this.selectedIndex==1){
      this.fetchAllSmsCampaign();
    }
    if(this.selectedIndex==2){
      this.fetchAllCampaign();
    }
  }

  onCampaignSelectionChange(campaign: any, isSelected: boolean) {
    if (isSelected === true) {  // If selected
      console.log('Selection changed:', campaign);

      // Add campaign id to the selected list if it's selected
      if (!this.selectedCampaignIds.includes(campaign.id)) {
        this.selectedCampaignIds.push(campaign.id);
      }
    } else {  // If unselected
      console.log('campaign.isSelected = ', isSelected);

      // Remove campaign id from the selected list if it's unselected
      const index = this.selectedCampaignIds.indexOf(campaign.id);
      if (index > -1) {
        this.selectedCampaignIds.splice(index, 1);
      }
    }

    // Optionally, log the selected campaign IDs
    console.log('Selected Campaign IDs:', this.selectedCampaignIds);






  }

  // getSelectedCampaigns(): any[] {
  //   return this.paginatedCampaignsAll.filter(campaign => campaign.isSelected);
  // }

  selectAllCampaigns(event: any) {
    let isSelected = event.checked;

    // Update the selection state of each campaign
    this.paginatedCampaignsAll.forEach(campaign => {
      campaign.isSelected = isSelected;

      // If selected, add the campaign ID to the array
      if (isSelected) {
        if (!this.selectedCampaignIds.includes(campaign.id)) {
          this.selectedCampaignIds.push(campaign.id);
        }
      } else {

        // Reset all checkboxes after dialog is closed
        this.selectAllChecked = false; // Uncheck "Select All"
        this.paginatedCampaignsAll.forEach((campaign) => {
          campaign.isSelected = false; // Uncheck all individual checkboxes
        });
        this.selectedCampaignIds = []; // Clear the selected IDs array

        // If unselected, remove the campaign ID from the array
        const index = this.selectedCampaignIds.indexOf(campaign.id);
        if (index > -1) {
          this.selectedCampaignIds.splice(index, 1);
        }
      }
    });


    if (isSelected === true) {
      Swal.fire({
        // title: 'Are you sure to delete this campaign ?',
        // text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: "#f44336",
        confirmButtonColor: "#3f51b5",
        confirmButtonText: 'Add to folder',
        cancelButtonText: 'Clear selection'
      }).then((result) => {
        if (result.isConfirmed) {
          const dialogRef = this.dialog.open(AllCampaignToFolderComponent, {
            width: '65%',
            // data: this.folderDetails,
            data: this.selectedCampaignIds,
            height: 'auto'
          });

          dialogRef.afterClosed().subscribe((result) => {

            // Reset all checkboxes after dialog is closed
            this.selectAllChecked = false; // Uncheck "Select All"
            this.paginatedCampaignsAll.forEach((campaign) => {
              campaign.isSelected = false; // Uncheck all individual checkboxes
            });
            this.selectedCampaignIds = []; // Clear the selected IDs array


            const selectedFolder = localStorage.getItem('selectedFolder');
            if (selectedFolder !== null) {
              this.campaignService.updateFolderInfo("parent");
              const folderData = JSON.parse(selectedFolder); // Safe to parse
              this.folderCloseDialog(folderData);
            }

            return;
          });

        }
        else {
          debugger
          // Reset all checkboxes after dialog is closed
          this.selectAllChecked = false; // Uncheck "Select All"
          this.paginatedCampaignsAll.forEach((campaign) => {
            campaign.isSelected = false; // Uncheck all individual checkboxes
          });
          this.selectedCampaignIds = []; // Clear the selected IDs array
        }
      });
    }

    // Optionally, log the selected campaign IDs
    console.log('Selected Campaign IDs:', this.selectedCampaignIds);

  }

  changeCategory(event: any) {
    // const selectedCategoryType = event.target?.value
    //   ? event.target?.value
    //   : event;
    // if (selectedCategoryType !== 'All') {
    //   const selectedCategory = this.contentTypeList.find(
    //     (category: any) => category?.type === selectedCategoryType
    //   );
    //   this.filterForm?.get('type_id')?.patchValue(null);
    //   this.filterForm?.get('varification_status')?.patchValue(null);
    //   this.getTypeList(selectedCategory.id);
    // }
    // this.getFilterList();
  }


  getData(data: any) {
    this.myId = data.id
    this.language = data.fullName
    if (data.id == 1) {
      this.branchSend.setTabStatus("My Records")
      this.tab_status = "My Records";
      // this.selectedIndex = 0;
    }
    if (data.id == 2) {
      this.branchSend.setTabStatus("All Records")
      this.tab_status = "All Records";
      // this.selectedIndex = 0;
    }
    this.fetchAllCampaign();
    this.fetchAllSmsCampaign();
  }



  getAllCampaignFolderByFolderId(folder_id: any) {
    const currentFolder = this.campaignService.getFolderValue();

    this.campaignService.getFolderCampaignListByFolderId(folder_id).subscribe(
      (response: any) => {
        if (response) {
          this.campaigns = response?.data;
          this.folderList = response?.data;
          // this.showFolder = response?.data?.length == 0 ? false : true;
          if (response?.data?.length == 0) {
            // this.showFolder = false;
            this.folderData == 'child' ? this.folderData = 'folders' : this.folderData;
          } else {
            // this.showFolder = true;
          }
        }
      },
      (error) => {
        this.errorMessage = "Error fetching folders. Please try again later.";
        console.error("Error fetching folders:", error);
      }
    );
  }

  getAllCampaignFolder() {
    this.campaignService.getFolderCampaignList().subscribe((response: any) => {
      // if (response) {
      this.campaigns = response?.data;
      this.folderList = response?.data;
      // }
      this.campaignService.updateParent('');
      this.campaignService.updateChild('');
      localStorage.removeItem('selectedFolder');
    },
      (error) => {
        this.errorMessage = "Error fetching folders. Please try again later.";
        console.error("Error fetching folders:", error);
      }
    );
  }

  getCampaignFolderByFolderId(folder_id: any) {
    this.campaignService.getFolderCampaignById(folder_id).subscribe(
      (response: any) => {
        if (response) {
          this.folderDetails = response.data
        }
      },
      (error) => {
        this.errorMessage = "Error fetching folders. Please try again later.";
        console.error("Error fetching folders:", error);
      }
    );
  }

  folderClick(folder: any) {

    this.getFolderInfo = this.campaignService.getFolderInfo();
    this.parentFolderId = folder?.id;
    this.childFolderId = folder?.folder_id;
    this.folderData = folder?.folder_id == null ? "child" : "parent";
    this.folderDetails = folder;

    if (this.getFolderInfo === "folder") {
      if (this.backButton === true) {
        this.campaignService.updateFolderInfo("parent");
        this.campaignService.updateParent(folder);
      }

      this.getParentValue = this.campaignService.getParentValue();
      this.getAllEmailCampaignByFolderID(folder?.id)
    }
    else if (this.getFolderInfo === "parent") {
      if (this.backButton === true) {
        this.campaignService.updateFolderInfo("child");
        this.campaignService.updateChild(folder);
      }

      this.getChildValue = this.campaignService.getChildValue();
      this.getAllEmailCampaignByFolderID(folder?.id);
    }
    else {
      // this.campaignService.updateFolderInfo("child");

    }


    this.backButton = true;
    this.getFolderInfo = this.campaignService.getFolderInfo();
    this.getAllCampaignFolderByFolderId(folder?.id);
  }

  folderCloseDialog(folder: any) {

    this.getFolderInfo = this.campaignService.getFolderInfo();
    this.parentFolderId = folder?.id;
    this.childFolderId = folder?.folder_id;
    this.folderData = folder?.folder_id == null ? "child" : "parent";
    this.folderDetails = folder;

    if (this.getFolderInfo === "folder") {
      // this.campaignService.updateParent(folder);
      // this.getParentValue = this.campaignService.getParentValue();
      this.getAllCampaignFolder();
    }
    else if (this.getFolderInfo === "parent") {

      this.campaignService.updateParent(folder);
      this.getAllCampaignFolderByFolderId(folder?.id);
      this.getAllEmailCampaignByFolderID(folder?.id);
      this.getParentValue = this.campaignService.getParentValue();
    }
    else {

      this.campaignService.updateChild(folder);
      this.getAllCampaignFolderByFolderId(folder?.id);
      this.getAllEmailCampaignByFolderID(folder?.id);
      this.getChildValue = this.campaignService.getChildValue();
    }

    // this.getAllCampaignFolderByFolderId(folder?.id);
  }


  resetFolderDetails() {
    this.getFolderInfo = this.campaignService.getFolderInfo();

    if (this.getFolderInfo == 'parent') {
      this.campaignService.updateFolderInfo("folder");
      this.fetchAllCampaign();
      this.fetchAllSmsCampaign();
      this.folderData = 'folders';
      this.getAllCampaignFolder();
      this.campaignService.updateFolder('');
    }
    else if (this.getFolderInfo == 'child') {
      this.campaignService.updateFolderInfo("parent");
      this.getAllCampaignFolderByFolderId(this.folderDetails?.id);
      this.campaignService.updateChild('');
    }
    else {
      this.campaignService.updateFolderInfo("folder");
      this.getAllCampaignFolder();
      this.showFolder = true;
      this.parentFolderId = undefined;
      this.childFolderId = undefined;
      this.folderDetails = undefined;
    }
    this.getFolderInfo = this.campaignService.getFolderInfo();
  }


  resetFolderDetails2() {
    this.getFolderInfo = this.campaignService.getFolderInfo();

    if (this.getFolderInfo == 'child') {
      this.campaignService.updateFolderInfo("parent");
      this.getAllCampaignFolderByFolderId(this.getParentValue?.id);
      this.campaignService.updateChild('');

      this.getAllEmailCampaignByFolderID(this.getParentValue?.id)
    }
    else { }

    this.getFolderInfo = this.campaignService.getFolderInfo();
  }


  fetchAllCampaign() {
    this.isLoading = true;

    this.campaignService.getTemplateCampaignList().subscribe((response: any) => {
      this.isLoading = false;
      if (response) {
        this.campaigns = response?.data;
        this.filterData = response?.data;
        this.filterCampaigns();
        this.applyPagination();
      }
    },
      (error) => {
        this.isLoading = false;
        this.errorMessage = "Error fetching campaigns. Please try again later.";
        console.error("Error fetching campaigns:", error);
      }
    );
  }
  fetchAllSmsCampaign() {
    this.isLoading = true;

    this.campaignService.getSmsCampaignList().subscribe((response: any) => {
      this.isLoading = false;
      if (response) {
        this.campaigns = response?.data;
        this.filterData = response?.data;
        this.filterCampaigns();
        this.applyPagination();
      }
    },
      (error) => {
        this.isLoading = false;
        this.errorMessage = "Error fetching campaigns. Please try again later.";
        console.error("Error fetching campaigns:", error);
      }
    );
  }

  getAllEmailCampaignByFolderID(folder_id: any) {
    this.isLoading = true;
    this.campaignService.getAllEmailCampaignByFolderID(folder_id).subscribe(
      (response: any) => {
        this.isLoading = false;
        if (response) {
          this.campaigns = response?.data;
          this.filterData = response?.data;
          this.filterCampaigns();
          this.applyPagination();
        }
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = "Error fetching campaigns. Please try again later.";
        console.error("Error fetching campaigns:", error);
      }
    );
  }
  getAllSmsCampaignByFolderID(folder_id: any) {
    this.isLoading = true;
    this.campaignService.getAllSmsCampaignByFolderID(folder_id).subscribe(
      (response: any) => {
        this.isLoading = false;
        if (response) {
          this.campaigns = response?.data;
          this.filterData = response?.data;
          this.filterCampaigns();
          this.applyPagination();
        }
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = "Error fetching campaigns. Please try again later.";
        console.error("Error fetching campaigns:", error);
      }
    );
  }

  onEvent(e: any) {
    e.stopPropagation();
  }

  applyPagination() {

    if (this.paginator) {
      this.paginator.pageIndex = this.filterCondition === 'all' ? this.currentPageAll :
        this.filterCondition === 'verified' ? this.currentPageVerified :
          this.currentPageUnverified;
      this.paginator.pageSize = this.pageSize;
    }

    this.paginatedCampaignsAll = this.getPaginatedData('all', this.pageSize, this.currentPageAll);
    this.paginatedCampaignsVerified = this.getPaginatedData('verified', this.pageSize, this.currentPageVerified);
    this.paginatedCampaignsUnverified = this.getPaginatedData('unverified', this.pageSize, this.currentPageUnverified);
  }

  getPaginatedData(condition: string, pageSize: number, currentPage: number) {
    let data = this.filteredCampaigns;

    if (condition === 'all') {
      this.totalCampaignsAll = data.length;
      return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
    } else if (condition === 'verified') {
      data = this.filteredCampaigns.filter(campaign => campaign.is_verified);
      this.totalCampaignsVerified = data.length;
      return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
    } else if (condition === 'unverified') {
      data = this.filteredCampaigns.filter(campaign => !campaign.is_verified);
      this.totalCampaignsUnverified = data.length;
      return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
    }

    return [];
  }

  onPageChange(event: PageEvent, tab: string) {
    this.pageSize = event.pageSize;
    this.currentPageAll = tab === 'All' ? event.pageIndex : this.currentPageAll;
    this.currentPageVerified = tab === 'Verified' ? event.pageIndex : this.currentPageVerified;
    this.currentPageUnverified = tab === 'Unverified' ? event.pageIndex : this.currentPageUnverified;
    this.applyPagination();
  }

  openFolderDialog(param: any): void {

    this.backButton = true;
    this.getFolderInfo = this.campaignService.getFolderInfo();

    // if (this.getFolderInfo === "folder") {
    //   this.parentInformation = this.campaignService.getFolderValue();
    // } 
    if (this.getFolderInfo === "parent") {
      this.parentInformation = this.campaignService.getParentValue();
    }
    else if (this.getFolderInfo === "child") {
      this.childInformation = this.campaignService.getChildValue();
    }
    else {
      // this.getFolderInfo = this.campaignService.getFolderValue();
    }


    const dialogRef = this.dialog.open(FolderDialogComponent, {
      width: '40%',
      // data: this.getFolderInfo === "child" ? this.childInformation : this.parentInformation ,
      data: {
        folderInfo: this.getFolderInfo === 'child' ? this.childInformation : this.parentInformation,
        pageUse: param
      },
      height: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {

      this.backButton = false;
      if (this.getFolderInfo === "parent") {
        this.folderClick(this.parentInformation);
      }
      if (this.getFolderInfo === "child") {
        this.folderClick(this.childInformation);
      }
      if (this.getFolderInfo === "folder") {
        this.getAllCampaignFolder();
      }

      this.backButton = true;
      return;
    });
  }


  renameFolderDialog(param: any, folderDetails: any): void {
    this.backButton = true;
    this.getFolderInfo = this.campaignService.getFolderInfo();

    // if (this.getFolderInfo === "folder") {
    //   this.parentInformation = this.campaignService.getFolderValue();
    // } 
    if (this.getFolderInfo === "parent") {
      this.parentInformation = this.campaignService.getParentValue();
    }
    else if (this.getFolderInfo === "child") {
      this.childInformation = this.campaignService.getChildValue();
    }
    else {
      // this.getFolderInfo = this.campaignService.getFolderValue();
    }


    const dialogRef = this.dialog.open(FolderDialogComponent, {
      width: '40%',
      // data: this.getFolderInfo === "child" ? this.childInformation : this.parentInformation ,
      data: {
        folderInfo: folderDetails,
        pageUse: 'rename'
      },
      height: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {

      const selectedFolder = localStorage.getItem('selectedFolder');


      if (this.getFolderInfo === "parent") {
        this.parentInformation = this.campaignService.getParentValue();
        this.folderCloseDialog(this.parentInformation);

        // this.folderClick(this.parentInformation);
      }
      if (this.getFolderInfo === "child") {
        this.childInformation = this.campaignService.getChildValue();
        this.folderCloseDialog(this.childInformation);

        // this.folderClick(this.childInformation);
      }
      if (this.getFolderInfo === "folder") {
        this.getAllCampaignFolder();
      }

      return;
    });
  }



  renameFolderDialog2(param: any): void {
    this.backButton = true;
    this.getFolderInfo = this.campaignService.getFolderInfo();

    if (this.getFolderInfo === "parent") {
      this.parentInformation = this.campaignService.getParentValue();
    }
    else if (this.getFolderInfo === "child") {
      this.childInformation = this.campaignService.getChildValue();
    }
    else { }

    const dialogRef = this.dialog.open(FolderDialogComponent, {
      width: '40%',
      data: {
        folderInfo: this.getFolderInfo === "child" ? this.childInformation : this.parentInformation,
        pageUse: param
      },
      height: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {

      this.campaignService.updateFolderInfo("folder");
      this.getFolderInfo = this.campaignService.getFolderInfo();

      this.campaignService.updateParent('');
      this.campaignService.updateChild('');
      this.getAllCampaignFolder();

      return;
    });
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(TemplateDialogComponent, {
      width: '40%',
      height: 'auto',
      // data: { addLeave: 'add_leave', selectedTab: this.selectedTab },
      id: '11Modal'

    });

    dialogRef.afterClosed().subscribe((result) => {
      return;
    });
  }


  moveToFolderDialog(): void {
    const dialogRef = this.dialog.open(MoveToFolderDialogComponent, {
      width: '65%',
      data: this.folderDetails,
      height: 'auto'
    });

    dialogRef.afterClosed().subscribe((result) => {

      const selectedFolder = localStorage.getItem('selectedFolder');
      if (selectedFolder !== null) {
        this.campaignService.updateFolderInfo("parent");
        const folderData = JSON.parse(selectedFolder); // Safe to parse
        this.folderCloseDialog(folderData);
      }

      return;
    });
  }





  moveToMainListHeader(): void {

    if (this.getFolderInfo === "child") {
      this.getChildValue = this.campaignService.getChildValue();
    }

    this.campaignService.moveToMainList(this.getChildValue.id).subscribe(
      (response: any) => {

        this.campaignService.updateFolderInfo("folder");
        this.folderCloseDialog(this.getChildValue);

        this.toster.success(`${response.message}`);
      },
      (error) => {
        this.toster.error(`${error.message}`);
      }
    );

  }


  moveToMainList(folderData: any): void {
    this.campaignService.moveToMainList(folderData.id).subscribe(
      (response: any) => {

        this.campaignService.updateFolderInfo("folder");
        this.folderCloseDialog(folderData);

        this.toster.success(`${response.message}`);
      },
      (error) => {
        this.toster.error(`${error.message}`);
      }
    );

  }


  moveToFolderDialog2(folderData: any): void {
    const dialogRef = this.dialog.open(MoveToFolderDialogComponent, {
      width: '65%',
      // data: this.folderDetails,
      data: folderData,
      height: 'auto'
    });

    dialogRef.afterClosed().subscribe((result) => {

      const selectedFolder = localStorage.getItem('selectedFolder');
      if (selectedFolder !== null) {
        this.campaignService.updateFolderInfo("parent");
        const folderData = JSON.parse(selectedFolder); // Safe to parse
        this.folderCloseDialog(folderData);
      }

      return;
    });
  }

  moveCampaignToFolder(folderData: any): void {

    const dialogRef = this.dialog.open(CampaignToFolderComponent, {
      width: '65%',
      // data: this.folderDetails,
      data: folderData,
      height: 'auto'
    });

    dialogRef.afterClosed().subscribe((result) => {

      this.fetchAllCampaign();
      this.fetchAllSmsCampaign();

    });
  }


  deleteFolderByID(folder_id: any) {

    Swal.fire({
      title: 'Delete this folder?',
      text: `The folder ${folder_id.folder_name} and its subfolders will be deleted.
      The campaigns they contain will still be available in the main campaigns list.`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.campaignService.deleteFolderCampaign(folder_id.id, folder_id).subscribe(
          (response: any) => {
            if (response) {

              if (this.getFolderInfo === "folder") {
                this.getAllCampaignFolder();
              }
              if (this.getFolderInfo === "parent") {
                // this.folderClick(this.parentInformation);
                this.resetFolderDetails();
              }
              if (this.getFolderInfo === "child") {
                // this.folderClick(this.childInformation);
                this.resetFolderDetails2();
              }

            }
            this.backButton = true;
            this.toster.success(`${response.message}`);
          },
          (error) => {
            // this.backButton = true;
            this.toster.error(`${error.message}`);
          }
        );
      }
    });


  }

  deleteFolderByID2() {
    let folder_id: any;

    if (this.getFolderInfo === "parent") {
      this.parentInformation = this.campaignService.getParentValue();
      folder_id = this.parentInformation;
    }
    if (this.getFolderInfo === "child") {
      this.childInformation = this.campaignService.getChildValue();
      folder_id = this.childInformation;
    }

    Swal.fire({
      title: 'Delete this folder?',
      text: `The folder ${folder_id.folder_name} and its subfolders will be deleted.
      The campaigns they contain will still be available in the main campaigns list.`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.campaignService.deleteFolderCampaign(folder_id.id, folder_id).subscribe(
          (response: any) => {
            if (response) {

              if (this.getFolderInfo === "folder") {
                this.getAllCampaignFolder();
              }
              if (this.getFolderInfo === "parent") {
                // this.folderClick(this.parentInformation);
                this.resetFolderDetails();
              }
              if (this.getFolderInfo === "child") {
                // this.folderClick(this.childInformation);
                this.resetFolderDetails2();
              }

            }
            this.backButton = true;
            this.toster.success(`${response.message}`);
          },
          (error) => {
            // this.backButton = true;
            this.toster.error(`${error.message}`);
          }
        );
      }
    });

  }



  setFilter(condition: string) {
    this.filterCondition = condition;
    this.filterCampaigns();
    this.applyPagination();
  }

  filterCampaigns() {
    if (this.filterCondition === 'all') {
      this.filteredCampaigns = this.campaigns;
    } else if (this.filterCondition === 'verified') {
      this.filteredCampaigns = this.campaigns.filter(campaign => campaign.is_verified);
    } else if (this.filterCondition === 'unverified') {
      this.filteredCampaigns = this.campaigns.filter(campaign => !campaign.is_verified);
    }
    this.applyPagination();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  filterSupplier(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.toLowerCase();
    if (value) {
      this.paginatedCampaignsAll = this.filterData?.filter((elem: any) =>
        elem?.title?.toLowerCase().includes(value)
      ) || [];
      this.paginatedCampaignsVerified = this.filterData?.filter((elem: any) =>
        elem?.title?.toLowerCase().includes(value)
      ) || [];
      this.paginatedCampaignsUnverified = this.filterData?.filter((elem: any) =>
        elem?.title?.toLowerCase().includes(value)
      ) || [];
    } else {
      this.paginatedCampaignsAll = [...this.filterData];
      this.paginatedCampaignsVerified = [...this.filterData];
      this.paginatedCampaignsUnverified = [...this.filterData];
    }
  }


  // onSearchClick() {
  //   this.isLoading = true;
  //   let filteredByTab = [];


  //   if (this.filterCondition === 'all') {
  //     filteredByTab = this.campaigns;
  //   } else if (this.filterCondition === 'verified') {
  //     filteredByTab = this.campaigns.filter(campaign => campaign.is_verified);
  //   } else if (this.filterCondition === 'unverified') {
  //     filteredByTab = this.campaigns.filter(campaign => !campaign.is_verified);
  //   }


  //   if (this.searchText.trim()) {
  //     const searchValue = this.searchText.toLowerCase();
  //     this.filteredCampaigns = filteredByTab.filter(campaign =>
  //       campaign.title.toLowerCase().includes(searchValue) ||
  //       (campaign.location && campaign.location.toLowerCase().includes(searchValue))
  //     );
  //   } else {
  //     this.filteredCampaigns = filteredByTab;
  //   }

  //   this.applyPagination();
  //   this.isLoading = false;
  // }

  gotoSetting(id: any) {
    this.router.navigate(["master/crm/campaigns/settings"], {
      queryParams: {
        id: id,
      }
    });
  }


  editCampaign(campaign: any) {

    this.router.navigate(['master/campaign/campaign/templates/setup'],
      { queryParams: { id: campaign?.id, campaign_name: campaign?.template_name } }
    );
  }

  editSmsCampaign(campaign: any) {

    this.router.navigate(['master/campaign/campaign/templates/setup'],
      { queryParams: { id: campaign?.id, campaign_name: campaign?.template_name } }
    );
  }

  editWhatsAppCampaign(campaign: any) {

    this.router.navigate(['master/campaign/campaign/whatsapp'],
      { queryParams: { id: campaign?.id, campaign_name: campaign?.template_name } }
    );
  }


  deleteCampaign(campaign: any) {

    Swal.fire({
      title: 'Are you sure to delete this campaign ?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'Not Now'
    }).then((result) => {
      if (result.isConfirmed) {
        this.campaignService.deleteCampaign(campaign.id).subscribe(
          (response: any) => {
            if (response) {
              if (this.getFolderInfo === "folder") {
                this.fetchAllCampaign();
                this.fetchAllSmsCampaign();
              }
              if (this.getFolderInfo === "parent") {
                // this.folderClick(this.parentInformation);
                this.getAllEmailCampaignByFolderID(campaign?.folder?.id);
              }
              if (this.getFolderInfo === "child") {
                // this.folderClick(this.childInformation);
                this.getAllEmailCampaignByFolderID(campaign?.folder?.id);
              }
            }

            this.toster.success(`${response.message}`);
          },
          (error) => {
            // this.backButton = true;
            this.toster.error(`${error.message}`);
          }
        );
      }
    });

  }

  deleteSmsCampaign(campaign: any) {

    Swal.fire({
      title: 'Are you sure to delete this campaign ?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'Not Now'
    }).then((result) => {
      if (result.isConfirmed) {
        this.campaignService.deleteSmsCampaign(campaign.id).subscribe(
          (response: any) => {
            if (response) {
              if (this.getFolderInfo === "folder") {
                this.fetchAllCampaign();
                this.fetchAllSmsCampaign();
              }
              if (this.getFolderInfo === "parent") {
                // this.folderClick(this.parentInformation);
                this.getAllEmailCampaignByFolderID(campaign?.folder?.id);
              }
              if (this.getFolderInfo === "child") {
                // this.folderClick(this.childInformation);
                this.getAllEmailCampaignByFolderID(campaign?.folder?.id);
              }
            }

            this.toster.success(`${response.message}`);
          },
          (error) => {
            // this.backButton = true;
            this.toster.error(`${error.message}`);
          }
        );
      }
    });

  }


  applyFilters(filters: any): void {
    this.isLoading = true;
    let filteredByTab = [];

    if (this.filterCondition === 'all') {
      filteredByTab = this.campaigns;
    } else if (this.filterCondition === 'verified') {
      filteredByTab = this.campaigns.filter(campaign => campaign.is_verified);
    } else if (this.filterCondition === 'unverified') {
      filteredByTab = this.campaigns.filter(campaign => !campaign.is_verified);
    }

    if (filters) {
      const result = filters.filterNames[0];

      if (result) {

        const searchValue = result.toLowerCase();
        filteredByTab = filteredByTab.filter(campaign =>
          campaign.pax_type_name.toLowerCase().includes(searchValue)
        );
      }


      if (filters.minDuration && filters.maxDuration) {
        filteredByTab = filteredByTab.filter(campaign =>
          campaign.day_count >= filters.minDuration && campaign.day_count <= filters.maxDuration
        );
      }

    }
    this.filteredCampaigns = filteredByTab;
    this.applyPagination();
    this.isLoading = false;
  }
}
