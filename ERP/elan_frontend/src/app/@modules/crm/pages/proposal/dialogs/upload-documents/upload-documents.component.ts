import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.scss']
})
export class UploadDocumentsComponent {
  @ViewChild('fileInput') fileInput: any;

  loading: boolean=false;
  newFiles: any[] = [];
  dbFiles: any[] = [];
  uploadedFiles: any[] = [];
  apiBase = environment.servralUrl+'/';

  allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  constructor(
      public dialogRef: MatDialogRef<UploadDocumentsComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private cdr: ChangeDetectorRef, private $proposal: ProposalService, private toast: ToastrService, private router: Router,
  
  ) {
    this.getBindData();
    this.uploadedFiles = [...this.data.files];
  }

  getBindData(){
    if(this.data.proposalId && this.data.versionId){
      this.$proposal.getProposalDocumentsList(this.data.proposalId, this.data.versionId).subscribe((res: any) => {
          if (res) {
            this.dbFiles = res.data.map((x: any) => ({
              ...x,
              name: x.documents_name,
              isNew: false
            }));

            this.uploadedFiles = [...this.newFiles,...this.dbFiles];
          }
      });
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;

    if (files.length > 5) {
      this.toast.error('You can select a maximum of 5 files at a time.');
      event.target.value = "";  // reset file input
      return;
    }

    for (let file of files) {
      if (!this.allowedTypes.includes(file.type)) {
        this.toast.error("Invalid format: " + file.name);
        continue;
      }
      // Add custom flag
      const newFileObj = {
        id: null,
        file: file,      // actual file
        name: file.name, // show name
        isNew: true      // for UI label
      };

      this.newFiles.push(newFileObj);
      this.uploadedFiles = [...this.newFiles,...this.dbFiles];
    }
  }

  viewFile(i: number) {
    const file = this.uploadedFiles[i];

    // If newly added (not yet uploaded)
    if (file.isNew) {
      const fileURL = URL.createObjectURL(file.file); // file is File object
      window.open(fileURL, "_blank");
      return;
    }

    // If file is from DB (string path)
    const serverURL = this.apiBase + file.documents;  
    window.open(serverURL, "_blank");
  }

  downloadFile(i: number) {
    const file = this.uploadedFiles[i];
    // --- NEW FILE (Local File) ---
    if (file.isNew) {
      const url = URL.createObjectURL(file.file);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.file.name;
      a.click();
      return;
    }

    // --- EXISTING FILE (DB FILE) ---
    const fileUrl = this.apiBase + file.documents;

    fetch(fileUrl, { method: 'GET' })
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // always download with original name
      a.download = file.documents_name || "file";

      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);
    })
    .catch(err => {
      console.error("Download error:", err);
    });
  }

  deleteFile(i: number, data: any) {

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this document?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel"
    }).then((result) => {

      if (!result.isConfirmed) return;

      // ------------------------------
      // CASE 1: isNew = true (Local delete)
      // ------------------------------
      if (data.isNew) {
        this.uploadedFiles.splice(i, 1);
        this.newFiles.splice(i, 1);

        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Document removed successfully from list",
          timer: 1500,
          showConfirmButton: false
        });

        return;
      }

      // ------------------------------
      // CASE 2: isNew = false (File from DB → API call)
      // ------------------------------

      this.$proposal.deleteProposalDocument(data.id).subscribe({
        next: (res:any) => {
          // remove from UI list after success
          this.uploadedFiles.splice(i, 1);
          this.getBindData();

          Swal.fire({
            icon: "success",
            title: "Deleted",
            text: "Document deleted successfully from list",
            timer: 1500,
            showConfirmButton: false
          });
        },
        error: (err:any) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Unable to delete file. Try again.",
          });
        }
      });

    });
  }

  closeDialog() {
    this.dialogRef.close(this.uploadedFiles);
  }

  getSaveFiles(){
    if(this.newFiles.length > 0){
      this.loading=true;
      const formData = new FormData();

      formData.append("proposal_id", this.data.proposalId);
      formData.append("version_id", this.data.versionId);

      this.newFiles.forEach(file => {
        formData.append("files", file.file, file.file.name);
      });

      this.$proposal.uploadProposalDocuments(formData).subscribe(res => {
        console.log("Uploaded Successfully", res);
        this.toast.success('Uploaded Successfully');
        this.loading=false;
        this.resetFiles();
      },
      (err) => {
          console.log(err);
          this.loading=false;
      });
    }else{
      this.toast.error('Please select at least one file.');
    }
  }

  resetFiles(){
    this.newFiles = [];                     
    this.fileInput.nativeElement.value = "";
    this.getBindData();
  }

}
