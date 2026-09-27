import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-asset-qr-code',
  templateUrl: './asset-qr-code.component.html',
  styleUrls: ['./asset-qr-code.component.scss']
})

export class AssetQRCodeComponent {
  qrImageUrl: string = '';
  itemName: string = '';

  constructor(
    private dialog: MatDialogRef<AssetQRCodeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.qrImageUrl = data.qrImageUrl;
    this.itemName = data.itemName;
  }

  close() {
    this.dialog.close();
  }

  download() {
  const link = document.createElement('a');
  link.href = this.qrImageUrl;
  link.download = `${this.itemName || 'qr-code'}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

}

