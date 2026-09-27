import { Component, Inject } from '@angular/core';
import { ActivatedRoute, EventType, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-view-document-dialog',
  templateUrl: './view-document-dialog.component.html',
  styleUrls: ['./view-document-dialog.component.scss']
})
export class ViewDocumentDialogComponent {
  
  constructor(
    public dialog: MatDialogRef<ViewDocumentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }
  ngOnInit() {
  }


}
