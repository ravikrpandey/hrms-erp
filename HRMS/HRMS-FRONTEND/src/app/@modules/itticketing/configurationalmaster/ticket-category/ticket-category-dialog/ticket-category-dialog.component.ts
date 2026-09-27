import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { HelpdeskService } from 'src/app/@shared/services/HelpDeskService/helpdesk.service';

@Component({
  selector: 'app-ticket-category-dialog',
  templateUrl: './ticket-category-dialog.component.html',
  styleUrls: ['./ticket-category-dialog.component.scss'],
})
export class TicketCategoryDialogComponent {
  id: any;
  singleCountryData: any;
  ticketCategory: FormGroup;
  displayStyle: any = 'none';
  rowData: any[] = [];
  columnDefs: any[];
  departmentname: any;
  isActive: boolean = false;
  categorycode: string | null = null;
  view: any;
  formData: any;
  editDesignation: any;
  addDesignation: any;
  visibility: any;


  constructor(
    private dialog: MatDialogRef<TicketCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _helpDeskService: HelpdeskService,
    public fb: FormBuilder,
    public toaster: ToastrService,
    public route: Router,
    public _commonService: CommonService
  ) {
    this.id = data?.id;
    this.view = data?.actionType;
    this.ticketCategory = this.fb.group({
      categoryCode: [null, Validators.required],
      categoryName: [null, Validators.required],
      dept_id: [null, Validators.required],
      status: [false, Validators.required],
    });

    if (this.id) {
      this._helpDeskService
        .getTheSingleDatabasedOnid(this.id)
        .subscribe((res: any) => {
          this.formData = res.data;
          this.ticketCategory.patchValue({
            categoryCode: this.formData.categoryCode,
            categoryName: this.formData.categoryName,
            dept_id: this.formData.dept_id,
            status: this.formData.status,
          });
          console.log(    res.data,"this.formData.department_name")
        });
    }
  }


  ngOnInit() {
    if (this.id) {
      this.getByIdDesignation();
    }
    this.addDesignation = this.data.data;
    this.editDesignation = this.data.edit;
    this.visibility = this.data.view;
    this.getDepartmentData();
    this._helpDeskService.getUniquecategoryCode().subscribe((res: any) => {
      this.ticketCategory.patchValue({
        categoryCode: res.data.categoryCode,
      });
    });
  }

  getDepartmentData() {
    this._helpDeskService.getDepertmentdata().subscribe((res: any) => {
      this.departmentname = res.data;
    });
  }

  getByIdDesignation() {
    this._helpDeskService
      .getTheSingleDatabasedOnid(this.id)
      .subscribe((res: any) => {
        this.singleCountryData = res.data;
        if (this.id) {
          this.ticketCategory.patchValue({
          
          });
        }
      });
  }


  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }


  onSubmitForm() {
    this._commonService?.showLoader();
    this._helpDeskService
      .saveDataTicketcategoryMaster(this.ticketCategory.value)
      .subscribe(
        (res: any) => {
          console.log('res', res);
          this.toaster.success('Tikcet Category Saved Successfully');
          this.dialog.close();
        },
        (error: any) => {
          this.toaster.error('Something went Wrong!');
        }
      );
    window.location.reload();
  }


  onUpdateForm() {
    this._helpDeskService
      .TicketCategoryUpdate(this.id, this.ticketCategory.value)
      .subscribe(
        (res: any) => {
          console.log('res', res);
          this.toaster.success('Tikcet Category Saved Successfully');
          this.dialog.close();
        },
        (error: any) => {
          this.toaster.error('Something went Wrong!');
        }
      );
    window.location.reload();
  }
  
}
