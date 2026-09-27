import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActionCellRenderer } from '../action-cell-renderer/action-cell-renderer.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelpdeskService } from 'src/app/@shared/services/HelpDeskService/helpdesk.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-modal-content-component',
  templateUrl: './modal-content-component.component.html',
  styleUrls: ['./modal-content-component.component.scss'],
})
export class ModalContentComponentComponent {
  TicketManagement: FormGroup;

  Status: any = ['OPEN', 'CLOSE']
  employeList: any = []

  constructor(
    public dialogRef: MatDialogRef<ActionCellRenderer>,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private $helpdeskService: HelpdeskService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.TicketManagement = this.fb.group({
      status_type: [null, Validators.required],
      allocate_id: [null, Validators.required],
      remark: [null, Validators.required],
    })
  }

  ngOnInit(): void {
    this.employeData();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  employeData() {
    let entity_id = localStorage.getItem("selectedEntityId");
    this.$helpdeskService.employeList(entity_id).subscribe((res: any) => {
      this.employeList = res.data;
    })
  }

  handleSubmit() {
    debugger
    try {
      if (this.TicketManagement.invalid) {
        return this.toaster.error('Required fields should not be empty', 'Fields Error');
      }
      let value = this.TicketManagement.value;
      let req = {
        status_type: value.status_type,
        allocate_id: value.allocate_id ? value.allocate_id : null,
        remark: value?.remark ? value?.remark : null,
        ticket_id: this.data.value.id,
      }
      console.log(this.data)
      this.$helpdeskService.create_allocated_ticket(req).subscribe((res: any) => {
        if (res) {
          this.toaster.success(res.message);
          this.onNoClick()
        }
      }, (error) => {
        if (error.error.code == 403)
          this.toaster.error(error.error.message);
      }
      )
    } catch (err) {
      console.log(err)
      // this.toaster.error(err?.error.message);
    }
  }

  selectStatus(event: any) {
    debugger
    let statusValue = event?.value;
    const allocateIdControl: any = this.TicketManagement.get('allocate_id');
    const remarkControl: any = this.TicketManagement.get('remark');
    if (statusValue == 'CLOSE') {
      remarkControl.setValidators([Validators.required]);
      allocateIdControl.clearValidators();
      this.TicketManagement.patchValue({ allocate_id: null })
    }
    if (statusValue == 'OPEN') {
      allocateIdControl.setValidators([Validators.required]);
      remarkControl.clearValidators();
      this.TicketManagement.patchValue({ remark: null })
    }
    allocateIdControl.updateValueAndValidity();
    remarkControl.updateValueAndValidity();
  }

}
