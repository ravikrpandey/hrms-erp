import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { AssetListService } from 'src/app/@shared/services/asset-list.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.servralUrl;

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit, OnDestroy {
  leadForm: FormGroup;
  item_id: any;
  selectedFile: string[] = [];
  backendUrl: any;
  
  private destroy$ = new Subject<void>();

  constructor(
    private toast: ToastrService,
    private fb: FormBuilder,
    private activeroute: ActivatedRoute,
    private asset_service: AssetListService,
    private $miscellaneousService: MiscellaneousService
  ) {
    this.leadForm = this.fb.group({
      docs_details: this.fb.array([this.createStakeHolderRow()]),
    });
  }

  ngOnInit(): void {
    this.activeroute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.item_id = params.id;
        if (this.item_id) {
          this.getAllDocsByPO_itemId();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createStakeHolderRow(docVal: string = '', descVal: string = ''): FormGroup {
    return this.fb.group({
      document: new FormControl(docVal, Validators.required),
      description: new FormControl(descVal)
    });
  }

  get stakeHoldersFormArray(): FormArray {
    return this.leadForm.get('docs_details') as FormArray;
  }

  addStakeHoldersRow(): void {
    this.stakeHoldersFormArray.push(this.createStakeHolderRow());
  }

  removeStakeHoldersRow(index: number): void {
    if (this.stakeHoldersFormArray.length > 1) {
      this.stakeHoldersFormArray.removeAt(index);
      this.selectedFile.splice(index, 1);
    } else {
      this.toast.error('You need at least one row.');
    }
  }

  onFileChange(event: any, index: any) {
    try {
      const formData = new FormData();
      if (event.target.files && event.target.files[0]) {
        formData.append('file', event.target.files[0]);
      }
      this.$miscellaneousService.documents(formData).subscribe((response: any) => {
        if (response) {
          this.backendUrl = `/uploaded_files/${response?.url}`;
          this.selectedFile[index] = this.backendUrl;
          this.stakeHoldersFormArray.at(index).get('document')?.setValue(this.backendUrl);
        }
      }, err => {
        console.error('Error uploading file:', err);
        this.toast.error('File upload failed');
      });
    } catch (error) {
      console.error(error);
    }
  }

  clearFileInput(index: number) {
    this.stakeHoldersFormArray.at(index).get('document')?.setValue(null);
    this.selectedFile[index] = '';
  }

  getAllDocsByPO_itemId() {
    if (this.item_id) {
      this.asset_service.getAllDocsByPO_itemId(this.item_id).subscribe((res: any) => {
        if (res.data && res.data.length > 0) {
          this.stakeHoldersFormArray.clear();
          this.selectedFile = [];
          res.data.forEach((doc: any) => {
            const formGroup = this.createStakeHolderRow(doc.attachment, doc.description);
            this.stakeHoldersFormArray.push(formGroup);
            this.selectedFile.push(doc.attachment);
          });
        }
      }, (err: any) => {
        console.error('Error fetching documents:', err);
      });
    }
  }

  Submit() {
    if (this.selectedFile.length < 1) {
      return this.toast.error("Please add at least one document");
    }

    let description: any = [];
    this.stakeHoldersFormArray.controls.forEach((control) => {
      description.push(control.get('description')?.value || '');
    });

    let payload = {
      files: this.selectedFile,
      description: description,
      po_itemId: this.item_id
    };

    this.asset_service.createCompanyDepreciationDocs(payload).subscribe(
      (res: any) => {
        this.toast.success('Documents Saved Successfully');
        this.getAllDocsByPO_itemId();
      },
      (err: any) => {
        this.toast.error(err.error?.message || 'Error saving documents');
      }
    );
  }

  downloadFile(file: any) {
    if (!file?.document) {
      this.toast.error("No file uploaded for this row");
      return;
    }
    const fileUrl = databaseKey + file.document;
    window.open(fileUrl, '_blank');
  }
}

