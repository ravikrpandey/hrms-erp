import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { BgvService } from 'src/app/@shared/services/service/recruitment/bgv.service';
import { OfferLetterService } from 'src/app/@shared/services/service/recruitment/offer-letter.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-candidate-upload-doc',
  templateUrl: './candidate-upload-doc.component.html',
  styleUrls: ['./candidate-upload-doc.component.scss']
})
export class CandidateUploadDocComponent {
  recordData: any = {};
  dataList: any = [];
  baseUrl: any;

  formObj: any = {
    document_details: [
      { document_name: '', document_number: '', image: null, document_path: null },
    ],
  };
  
  candidate_id: any;
  fileControls : any =[]
  constructor(
    private toast: ToastrService,
    private activeroute: ActivatedRoute,
    private $offerLetter: OfferLetterService,
    private _bgvService : BgvService,
    private $miscellaneousService: MiscellaneousService,
    private $common: CommonService,
  ) {
    this.baseUrl = environment.serverUrl;
  }

  ngOnInit() {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.candidate_id = params.id;
      if (this.candidate_id) {
        this.getCandidateoffer_detailsBYID();
      }
    });
  }

  getCandidateoffer_detailsBYID() {
    try {
      debugger
      this.$offerLetter.getcandiate_detailsBYID(this.candidate_id).subscribe(
        (res) => {
          this.recordData = res?.data[0];
        }
      );
    } catch (err) {
      console.log(err)
    }
  };

  handleSubmit() {
console.log(this.formObj)
   
   try{
    this.formObj.candidate_id = this.candidate_id;
    this._bgvService.upload_candidate_documents(this.formObj).subscribe(
      (res) => {
        this.toast.success(res.message);
        this.formObj = {};
      },(error) => {
        if(error.error.code == 403)
        this.toast.error(error.error.message);
      }
    );
   } catch(err){
    console.log(err)
   }
  }
  uploadedFileUrls: string[] = []
 
  uploadDoc(event: Event, index: number) {
    try {
      const inputElement = event.target as HTMLInputElement;
      if (inputElement.files && inputElement.files[0]) {
        const file = inputElement.files[0];
  
        // Check if the file has a valid extension and size
        let isValidExtension = this.$common.checkForValidFile(event, false, true, false);
        if (!isValidExtension) {
          this.fileControls[index].fileUrl = '';
          return;
        }
  
        const formData = new FormData();
        formData.append('file', file);
  
        // Call service to upload the file
        this.$miscellaneousService.documents(formData).subscribe(
          (response: any) => {
            if (response) {
             
              this.formObj.document_details[index].document_path = `uploaded_files/${response?.url}`;
              
             
              this.uploadedFileUrls.push(this.formObj.document_details[index].document_path);
              console.log('Uploaded file URLs:', this.uploadedFileUrls);
            }
          },
          (err) => {
            console.error('File upload error:', err);
          }
        );
      }
    } catch (error) {
      console.log('Error during file upload:', error);
    }
  }
  
 
  removeFileControl(index: number) {
    this.formObj.document_details.splice(index, 1);
  }
  addFileControl() {
    this.formObj.document_details.push({
      document_name: '',
      document_number: '',
      image: null,
      document_path: null,
    });
  }
}
