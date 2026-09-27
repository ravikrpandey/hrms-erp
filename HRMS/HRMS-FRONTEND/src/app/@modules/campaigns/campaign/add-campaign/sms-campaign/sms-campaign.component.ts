import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormArray,
  FormControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CampaignService } from 'src/app/@shared/services/campaignService/campaign.service';
import { ToastrService } from 'ngx-toastr';
import { CampaingContactService } from 'src/app/@shared/services/campaignService/campaing-contact.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/app/environments/environment';
@Component({
  selector: 'app-sms-campaign',
  templateUrl: './sms-campaign.component.html',
  styleUrls: ['./sms-campaign.component.scss']
})
export class SmsCampaignComponent {
  sender: boolean = false;
  recipient: boolean = false;
  campaign_history: any = [];
  campaignForm: FormGroup;
  editCampaign: Boolean = false;
  campaign_name: any;
  campaign_id: any;
  selectedItems: any[] = [];
  isAllSelected: boolean = false;
  navigationStack: any[] = [];
  currentFolder: any = null;
  folderData: any[] = [];
  subscription: Subscription;
  lastSegment: any;
  serverUrl: any;
  constructor(
    private fb: FormBuilder,
    public router: Router,
    private activateRoute: ActivatedRoute,
    private _campaign: CampaignService,
    private toaster: ToastrService,
    private contactService: CampaingContactService,
  ) {
    this.campaignForm = this.fb.group({
      campaign_name: new FormControl(null)
    });
  }

  ngOnInit(): void {
    const segments = this.router.url.split('/');
    this.lastSegment = segments[segments.length - 1].split('?')[0];
    let lg: any = localStorage.getItem('signInUser');
    let full_name: any = localStorage.getItem('full_name');
    // this.loginUser = JSON.parse(lg);
    // this.full_name = JSON.parse(full_name);
    this.contactService.fetchFolderData1();
    this.serverUrl = environment.serverUrl +'/uploaded_files/';
    this.subscription = this.contactService.foldersData$.subscribe((response) => {
      this.folderData = response?.data;
    })
    this.activateRoute.queryParams.subscribe((params: any) => {
      this.campaign_id = params?.id;
      this.campaign_name = params?.campaign_name;
      if (params?.id) {
        this.campaignForm.patchValue({
          campaign_name: params?.campaign_name
        });
        this.getSenderById();
        this.getByCampaignIdRecipients();
        this.getMessageById();
        // this.getContactCount();
      }
    });



  }

  senderClick() {
    this.sender = !this.sender
  };
  recipientClick() {
    this.recipient = !this.recipient
  };
  createMsgContent() {
    this.router.navigate(['master/campaign/campaign/design'], { queryParams: { id: this.campaign_id, campaign_name: this.campaign_name } })
  };
  backRoute() {
    this.router.navigate(["master/campaign/campaign/list"]);
    this._campaign.updateFolderInfo("folder");
    this._campaign.updateParent('');
    this._campaign.updateChild('');
    localStorage.removeItem('selectedFolder');
  }
  onEditCampaign() {

    let val: any = this.campaignForm.value;
    let req = {
      ...val
    };

    if (this.campaign_id) {
      this._campaign.updateSmsCampaign(this.campaign_id, req).subscribe((res: any) => {
        this.editCampaign = false;
        this.campaign_name = res?.data?.campaign_name
      });
    }
  }
  getSmsCampaignById() {

    this._campaign.getSmsCampaignById(this.campaign_id).subscribe((response: any) => {
      console.log("====================>", response);
      this.campaign_history = response.data.campaign_history;
    },
      (error) => {
        console.error("Error fetching folders:", error);

      }
    );
  }

  openFolder(folder: any): void {
    if (folder?.list_count) {
      this.navigationStack.push(this.currentFolder);
      this.currentFolder = folder;
      this.updateSelectAllState();
    }
  }

  updateSelectAllState(): void {
    const items = this.currentFolder?.contactList || this.folderData;
    this.isAllSelected = items.every((item: any) => item.selected);
    const totalContacts = this.selectedItems.reduce(
      (sum: number, item: any) => sum + (item.total_contacts || 0),
      0
    );
    // this.value = totalContacts;
    console.log(totalContacts, "totalContacts");
    console.warn(items, "items");
    console.warn(this.selectedItems, "selectedItems");
  }

  goBack(): void {
    this.currentFolder = this.navigationStack.pop() || null;
    this.updateSelectAllState();
  }

  toggleAllSelection(event: any): void {
    const isChecked = event.checked;
    const items = this.currentFolder?.contactList || this.folderData;

    items.forEach((item: any) => {
      item.selected = isChecked;
      if (isChecked && !this.selectedItems.includes(item)) {
        this.selectedItems.push(item);
      } else if (!isChecked) {
        this.selectedItems = this.selectedItems.filter(selected => selected !== item);
      }
    });

    this.updateSelectAllState();
    const selectedItemsIds = this.selectedItems.map((item) => item.id);
    this.getContactCount(selectedItemsIds);
  }

  removeChip(index: number): void {
    const itemToRemove = this.selectedItems[index];

    this.selectedItems.splice(index, 1);

    this.unselectItemInFolders(itemToRemove);
    this.updateSelectAllState();


    const selectedItemsIds = this.selectedItems.map((item) => item.id);
    if (this.selectedItems.length > 0) {
      this.getContactCount(selectedItemsIds);
    } else {
      this.value = 0;
    }

  }
  private unselectItemInFolders(itemToRemove: any): void {
    if (this.currentFolder) {
      const item = this.currentFolder.contactList.find(
        (contact: any) => ((contact.id === itemToRemove.id && contact.folderId === itemToRemove.folderId))
      );
      if (item) {
        item.selected = false;
      }
    }
    const allItems = this.folderData.flatMap((folder: any) => folder.contactList || []);
    const matchingItem = allItems.find((contact: any) => ((contact.id === itemToRemove.id && contact.folderId === itemToRemove.folderId)));
    if (matchingItem) {
      matchingItem.selected = false;
    }
  }
  value: number = 40;
  getContactCount(ids: any) {

    this._campaign.getcontactCount(ids).subscribe((response: any) => {
      console.log("====================>", response);
      this.value = response.data;
    },
      (error) => {
        console.error("Error fetching folders:", error);

      }
    );
  }
  onItemSelectionChange(item: any, event: any): void {
    item.selected = event.checked;

    // if (event.checked) {
    //   if (!this.selectedItems.includes(item)) {
    //     this.selectedItems.push(item);
    //   }
    // } else {
    //   this.selectedItems = this.selectedItems.filter(selected => (selected.id !== item.id && selected.folderId !== item.folderId));
    //   this.isAllSelected = false;
    // }

    if (event.checked) {
      if (!this.selectedItems.some(selected => selected.id === item.id && selected.folderId === item.folderId)) {
        this.selectedItems.push(item);
      }
    } else {
      this.selectedItems = this.selectedItems.filter(
        selected => !(selected.id === item.id && selected.folderId === item.folderId)
      );
    }

    this.updateSelectAllState();
    const selectedItemsIds = this.selectedItems.map((item) => item.id);
    this.getContactCount(selectedItemsIds);
  }
  entryTypeRecipients: any = 'Add';
  subject_text = '';
  addSender() {

    let payload = {
      name: this.subject_text,
      campaign_id: this.campaign_id
    };


    this._campaign.saveSmsSenderDetails(payload).subscribe((response) => {
      window.location.reload();
    },
      (error) => {
        console.error('Error Sender', error);
      });

  }
  updateSender() {

    let payload = {
      name: this.subject_text,
      campaign_id: this.campaign_id
    };


    this._campaign.updateSmsSenderDetails(this.campaign_id, payload).subscribe((response) => {
      // window.location.reload();
    },
      (error) => {
        console.error('Error Sender', error);
      });

  }
  addRecipients() {
    let data = {
      campaign_id: this.campaign_id,
      list_ids: this.selectedItems
    }
    if (this.entryTypeRecipients == "Add") {
      this._campaign.addRecipientsSmsCampaign(data).subscribe(
        (response) => {
          console.log('Recipents save successfully!', response);
          window.location.reload();
        },
        (error) => {
          console.error('Error recipients email', error);
        }
      );
    }
    if (this.entryTypeRecipients == "Update") {
      this._campaign.updateRecipientsSmsCampaign(this.campaign_id, data).subscribe(
        (response) => {
          console.log('Recipents update successfully!', response);
          window.location.reload();
        },
        (error) => {
          console.error('Error recipients email', error);
        }
      );
    }
  }
  patchSelectedItems(): void {
    const items = this.currentFolder?.contactList || this.folderData;

    if (!items || items.length === 0) {
      console.warn('No items to patch.');
      return;
    }
    debugger
    items.forEach((item: any) => {
      item?.contactList.forEach((list: any) => {
        const isSelected = this.selectedItems.some((selected) => selected.id === list.id);
        list.selected = isSelected;
      })
    });

    console.log('Patched items:', items);
    this.updateSelectAllState();

  }
  getByCampaignIdRecipients(): void {
    this._campaign.getRecipientsSmsCampaign(this.campaign_id).subscribe(
      (response: any) => {
        if (response?.data?.length !== 0) {
          this.entryTypeRecipients = 'Update'
          this.selectedItems = response?.data?.map((item: any) => ({
            ...item,
            selected: true,
          }));
          debugger
          const selectedItemsIds = this.selectedItems.map((item) => item.id);
          if (this.selectedItems.length > 0) {
            this.getContactCount(selectedItemsIds);
          } else {
            this.value = 0;
          }

          this.patchSelectedItems();
        } else {
          this.entryTypeRecipients = 'Add'
        }

        console.log('Recipients fetched successfully!', response);
      },
      (error: any) => {
        console.error('Error fetching recipients:', error);
      }
    );
  }
  entryTypeSender: any = 'Add';
  getSenderById() {
    this._campaign.getSmsSenderDetailsById(this.campaign_id).subscribe((response: any) => {
      if (response?.data) {
        this.entryTypeSender = 'Update';
        this.subject_text = response?.data?.sender
      }
      else {
        this.entryTypeSender = 'Add'
      }

    },
      (error) => {
        console.error('Error Sender', error);
      });
  }
  previewUrl: any = null;
  message = "";
  entryTypeMessage: any = 'Add';
  getMessageById() {
    this._campaign.getSmsMessageCampaign(this.campaign_id).subscribe((response: any) => {
      if (response?.data?.message) {
        this.entryTypeMessage = 'Update';
        this.message = response?.data?.message;
        this.previewUrl = response?.data?.file;
      }
      else {
        this.entryTypeMessage = 'Add'
      }

    },
      (error) => {
        console.error('Error Sender', error);
      });
  }
}
