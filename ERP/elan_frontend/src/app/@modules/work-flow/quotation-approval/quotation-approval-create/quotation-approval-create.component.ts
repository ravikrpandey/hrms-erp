import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-quotation-approval-create',
  templateUrl: './quotation-approval-create.component.html',
  styleUrls: ['./quotation-approval-create.component.scss']
})
export class QuotationApprovalCreateComponent {
  submitted = false;
  quotationForm: FormGroup;

  subCategoryFilterCtrl: FormControl = new FormControl();
  filteredSubCategories: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  allSubCategories: any[] = [];

  mode: any;
  id: any;
  viewMode: any;
  apiLevels: { id: number; level_type: string }[] = [];

  constructor(
    public dialog: MatDialog,
    private toaster: ToastrService,
    private route: Router,
    private router: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private service: ConfigurationalmasterService,

  ) {
    this.quotationForm = this.fb.group({
      sub_category_ids: [[], Validators.required],
      levels: this.fb.array([this.createLevelRow()])
    });
  }


  ngOnInit() {
    this.router.queryParams.subscribe((params: any) => {
      this.id = params['id'] || null;
      this.viewMode = params.mode;
      this.mode = this.id ? 'edit' : 'create';
      this.loadSubCategories();
      this.getLevels();
      if (this.id) {
        this.getQuotationApprovalById(this.id);
      }
    });
  }

  get levels(): FormArray {
    return this.quotationForm.get('levels') as FormArray;
  }

  createLevelRow(): FormGroup {
    return this.fb.group({
      level: ['', Validators.required],
      discount: ['',
        [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern(/^(0|[1-9][0-9]?|100)$/)]
      ]
    });
  }

  addLevelRow() {
    this.levels.push(this.createLevelRow());
  }

  removeLevelRow(index: number) {
    this.levels.removeAt(index);
  }




  availableLevels(currentIndex: number): { id: number; level_type: string }[] {
    const selectedLevelIds = this.levels.controls
      .map((ctrl, i) => (i !== currentIndex ? ctrl.get('level')?.value : null))
      .filter(v => v !== null);
    return this.apiLevels.filter(lvl => !selectedLevelIds.includes(lvl.id));
  }

  getLevels() {
    const entityId = localStorage.getItem('selectedEntityId');
    this.service.getLevelType(entityId).subscribe((res: any) => {
      if (res && res.data) {
        this.apiLevels = res.data;
      }
    });
  }

  loadSubCategories() {
    this.service.getAllSub_Category().subscribe((res: any) => {
      if (res && res.data) {
        this.allSubCategories = res.data;
        this.filteredSubCategories.next(this.allSubCategories.slice());

        this.subCategoryFilterCtrl.valueChanges.subscribe(() => {
          this.filterSubCategories();
        });
      }
    });
  }

  filterSubCategories() {
    if (!this.allSubCategories) return;
    let search = this.subCategoryFilterCtrl.value;
    if (!search) {
      this.filteredSubCategories.next(this.allSubCategories.slice());
      return;
    }
    search = search.toLowerCase();

    this.filteredSubCategories.next(
      this.allSubCategories.filter(sc =>
        sc.sub_category_name.toLowerCase().includes(search)
      )
    );
  }

  getQuotationApprovalById(id: string) {
    this.service.get_quotationApprovalById(id).subscribe((response: any) => {
      if (response && response.data) {
        const data = response.data;

        this.quotationForm.patchValue({
          sub_category_ids: [
            ...new Set(data.details.map((d: any) => d.sub_category_id))
          ]
        });

        this.levels.clear();

        const levelMap: { [key: number]: any } = {};
        data.details.forEach((d: any) => {
          if (!levelMap[d.level_id]) {
            levelMap[d.level_id] = {
              level: d.level_id,
              discount: d.discount
            };
          }
        });

        Object.values(levelMap).forEach((lvl: any) => {
          this.levels.push(this.fb.group({
            level: [lvl.level, Validators.required],
            discount: [lvl.discount, [
              Validators.required,
              Validators.min(0),
              Validators.max(100),
              Validators.pattern(/^\d+$/)
            ]]
          }));
        });
      }
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.quotationForm.valid) {
      const formValue = this.quotationForm.value;
      const payload = {
        sub_category_ids: formValue.sub_category_ids,
        levels: formValue.levels.map((lvl: any) => ({
          level: lvl.level,
          discount: lvl.discount
        }))
      };

      if (this.mode === 'edit' && this.id) {
        this.service.updateQuotationApprovalById(this.id, payload).subscribe({
          next: () => {
            this.toaster.success('Quotation Approval updated successfully');
            this.location.back();
          },
          error: (err) => {
            console.error("Update Error:", err);
            this.toaster.error('Error while updating Quotation Approval');
          }
        });
      } else {
        this.service.saveQuotationApproval(payload).subscribe({
          next: () => {
            this.toaster.success('Quotation Approval created successfully');
            this.location.back();
          },
          error: (err) => {
            console.error("Create Error:", err);
            this.toaster.error('Error while creating Quotation Approval');
          }
        });
      }

    } else {
      this.toaster.error('Please fill all required fields');
    }
  }

  goBack() {
    this.location.back();
  }

  getLevelTypeName(id: number): string {
    const found = this.apiLevels.find(l => l.id === id);
    return found ? found.level_type : '';
  }

  preventDecimal(event: KeyboardEvent) {
  if (event.key === '.' || event.key === 'Decimal') {
    event.preventDefault(); 
  }
}


}
