import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-annoncement-image-model',
  templateUrl: './annoncement-image-model.component.html',
  styleUrls: ['./annoncement-image-model.component.scss']
})
export class AnnoncementImageModelComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { image: string, description: string, title: string },
    private dialogRef: MatDialogRef<AnnoncementImageModelComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }
}
