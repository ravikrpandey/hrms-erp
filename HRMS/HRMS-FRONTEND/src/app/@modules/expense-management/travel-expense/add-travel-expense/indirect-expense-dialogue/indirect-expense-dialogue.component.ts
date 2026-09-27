import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { environment } from 'src/app/environments/environment';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-indirect-expense-dialogue',
  templateUrl: './indirect-expense-dialogue.component.html',
  styleUrls: ['./indirect-expense-dialogue.component.scss']
})
export class IndirectExpenseDialogueComponent {
  view: boolean = false;
  formModel: FormGroup;
  expenseType: any;
  fileArray: any[] = [];
  journeyBifurcation: any[] = [];
  expenseType2: any;
  expenses: any;

  constructor(
    public dialog: MatDialogRef<IndirectExpenseDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private travelRequest: TravelRequestService,
    private renderer: Renderer2,
    private elRef: ElementRef
  ) {
    this.formInitialization();
    console.log("Data received in IndirectExpenseDialogueComponent:", this.data);
    
    if (this.data?.view) {
      this.view = this.data.view;
    }
    if (this.data?.id) {
      this.formModel.patchValue(this.data.tableData);
      this.journeyBifurcation = this.data.travelData.journeyBifurcation;
    }
    if (this.data?.travelData) {
      this.journeyBifurcation = this.data.travelData.journeyBifurcation;

    }
    this.fileArray.push({ imagePath: null, url: null });
  }

  formInitialization() {
    this.formModel = this.fb.group({
      exp_category_id: [null, Validators.required],
      exp_category_id_name: [null],
      exp_name: [null, Validators.required],
      exp_date: [null, Validators.required],
      exp_amount: [null, Validators.required],
      remarks: [null, Validators.required],
      journey_id: [null],
    });
    this.formModel.get('journey_id')?.valueChanges.subscribe((value: any) => {
      if (value) {
        const selectedJourney = this.journeyBifurcation.find(journey => journey.id === value);
        if (selectedJourney) {
          this.formModel.patchValue({
            exp_date: selectedJourney.from_date,
          });
        }
      }
    });
  }

  ngOnInit() {
    this.getAll_active_expenseType();
    if (this.data?.id) {
      const tableData = this.data.tableData;
      this.formModel.patchValue(tableData);
      this.patchFileArray(tableData.exp_documents);
    }
  }

  ngAfterViewInit() {
    if (this.view) {
      this.disableInteraction();
    }
  }

  getAll_active_expenseType() {
    this.travelRequest.getAll_active_expenseType().subscribe((res: any) => {
      this.expenseType = res.data;
      this.expenseType2 = res.data;
      this.expenses = this.expenseType.map((value:any) => value.expense_type)
    });
  }

  disableInteraction() {
    const formElements = this.elRef.nativeElement.querySelectorAll('.form_set .row *');

    formElements.forEach((element: HTMLElement) => {
      this.renderer.addClass(element, 'disable-interaction');
      this.renderer.setAttribute(element, 'tabindex', '-1');
      element.addEventListener('focus', (event) => {
        (event.target as HTMLElement).blur();
      });
    });
  }

  FindExpenseName(e: any) {
    this.formModel.get('exp_category_id_name')?.setValue(this.expenseType.find((expense: any) => expense.id === e.value)?.expense_type || '');
  }

  onSubmit(): void {
    console.log(this.formModel.value);
    
    Object.values(this.formModel.controls).forEach(control => {
      control.markAsTouched();
    });

    if (this.formModel.invalid) {
      this.toaster.error('Please fill in all required fields');
      return;
    }

    const exp_documents = this.fileArray
      .map((file, index) => ({ [`data${index + 1}`]: file.url }))
      .filter(fileObj => Object.values(fileObj)[0]);

    const payload = {
      ...this.formModel.value,
      exp_documents: exp_documents
    };

    this.dialog.close(payload);
  }

  sevralUrl() {
    return environment.serverUrl + '/uploaded_files/';
  }

  addFileInput(index: number) {
    this.fileArray.splice(index + 1, 0, { imagePath: null, url: null });
  }

  removeFileInput(index: number) {
    if (this.fileArray.length > 1) {
      this.fileArray.splice(index, 1);
    } else {
      this.toaster.warning("At least one file input must be present.");
    }
  }

  expenseFilter(e: any) {
    const aa = e
    let filteredVariable = this.expenseType2.filter((item: any) => aa.includes(item.expense_type));
    this.expenseType = filteredVariable
  }

  onChange(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imagePath = file.type === 'application/pdf' ? "/assets/icons/pdfimg.png" : e.target.result;
        this.fileArray[index].imagePath = imagePath;
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file);

      this.travelRequest.documents(formData).subscribe((res: any) => {
        this.toaster.success("File Uploaded Successfully");
        this.fileArray[index].url = res?.url;
      }, (err: any) => {
        this.toaster.error(`${err?.error?.message}`);
      });
    }
  }

  openFileInNewTab(url: string) {
    window.open(this.sevralUrl() + url, '_blank');
  }

  patchFileArray(exp_documents: any[]) {
    this.fileArray = exp_documents.map((doc, index) => ({
      imagePath: this.getImagePathFromUrl(doc[`data${index + 1}`]),
      url: doc[`data${index + 1}`]
    }));
    if (this.fileArray.length === 0) {
      this.fileArray.push({ imagePath: null, url: null });
    }
  }

  getImagePathFromUrl(url: string) {
    if (url) {
      const extension = url.split('.').pop();
      if (extension === 'pdf') {
        return "/assets/icons/pdfimg.png";
      }
      return this.sevralUrl() + url;
    }
    return null;
  }
}

