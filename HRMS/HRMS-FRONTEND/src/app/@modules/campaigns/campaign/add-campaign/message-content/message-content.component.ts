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
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-message-content',
  templateUrl: './message-content.component.html',
  styleUrls: ['./message-content.component.scss']
})
export class MessageContentComponent {
  sender: boolean = false;
  recipient: boolean = false;
  campaign_history: any = [];
  messageForm: FormGroup;
  editCampaign: Boolean = false;
  campaign_name: any;
  campaign_id: any;
  subject_text = '';
  showEmojiPicker = false;
  showEmojiPickerPreview = false;
  subjectLines: any[] = [];
  serverUrl: any;
  constructor(
    private fb: FormBuilder,
    public router: Router,
    private activateRoute: ActivatedRoute,
    private _campaign: CampaignService,
    private toaster: ToastrService,
  ) {
    this.messageForm = this.fb.group({
      message: new FormControl(null),
      file: new FormControl(null),
    });
  }
  ngOnInit(): void {
    this.serverUrl = environment.serverUrl +'/uploaded_files/';
    this.activateRoute.queryParams.subscribe((params: any) => {
      this.campaign_id = params?.id;
      this.campaign_name = params?.campaign_name;
      if(params?.id){
        this.getMessageById();
      }
    });
  }
  backRoute() {
    this.router.navigate(["master/campaign/campaign/sms"],{ queryParams: { id: this.campaign_id, campaign_name: this.campaign_name }});
    this._campaign.updateFolderInfo("folder");
    this._campaign.updateParent('');
    this._campaign.updateChild('');
    localStorage.removeItem('selectedFolder');
  }
  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;

    // Reset height to ensure proper recalculation
    textarea.style.height = 'auto';

    // Fetch the computed line height of the textarea
    const lineHeight = parseFloat(window.getComputedStyle(textarea).lineHeight);

    // Calculate the number of lines the content currently occupies
    const linesRequired = Math.ceil(textarea.scrollHeight / lineHeight);

    // Add one extra line of space
    textarea.style.height = `${(linesRequired + 0) * lineHeight}px`;
  }
  onBlur() {
    console.log('onblur')
  }
  onFocus() {
    this.showEmojiPicker = false;
  }
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }
  addEmoji(event: any) {
    const emoji = event.emoji.native || '';
    this.subject_text += emoji;
  }

  previewUrl: string | ArrayBuffer | null = null;
  fileName: string = '';
  fileSize: string = '';
  messageFile: any;
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.messageFile = input.files?.[0]

    if (file) {
      const maxSizeInKB = 850;
      const fileSizeInKB = file.size / 1024;

      if (fileSizeInKB > maxSizeInKB) {
        this.toaster.error('File size should be 850 KB or less.');
        input.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);

      this.fileName = file.name;
      this.fileSize = fileSizeInKB.toFixed(2);
    }
  }

  clearFile(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    this.previewUrl = null;
    this.fileName = '';
    this.fileSize = '';
  }
  entryTypeMessage: any = 'Add';
  addSmsMessage() {
    let data = {
      campaign_id: this.campaign_id,
      file: this.messageFile,
      message: this.subject_text,
      file_size: this.fileSize
    }
    if(this.entryTypeMessage=="Add"){
    this._campaign.addSmsMessageCampaign(data).subscribe(
      (response) => {
        console.log('Recipents save successfully!', response);
        window.location.reload();
      },
      (error) => {
        console.error('Error recipients email', error);
      }
    );
    }
    if(this.entryTypeMessage == "Update"){
      this._campaign.updateSmsMessageCampaign(this.campaign_id, data).subscribe(
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

  getMessageById() {
    this._campaign.getSmsMessageCampaign(this.campaign_id).subscribe((response: any) => {
      if (response?.data?.message) {
        this.entryTypeMessage = 'Update';
        this.subject_text = response?.data?.message;
        this.previewUrl = this.serverUrl+response?.data?.file;
        this.fileName = response?.data?.file;
        this.fileSize = response?.data?.file_size;
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
