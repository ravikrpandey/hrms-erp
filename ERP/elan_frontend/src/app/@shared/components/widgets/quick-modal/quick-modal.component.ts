import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface QuickModalData {
  component: any;
  componentData: any;
  title: string;
}

@Component({
  selector: 'app-quick-modal',
  templateUrl: './quick-modal.component.html',
  styleUrls: ['./quick-modal.component.scss']
})
export class QuickModalComponent implements OnInit {
  componentClass: any;
  innerInjector: Injector;

  constructor(
    public dialogRef: MatDialogRef<QuickModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QuickModalData,
    private parentInjector: Injector
  ) {
    this.componentClass = data.component;

    // Create a child injector that overrides MAT_DIALOG_DATA and MatDialogRef
    this.innerInjector = Injector.create({
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: data.componentData },
        { provide: MatDialogRef, useValue: dialogRef }
      ],
      parent: parentInjector
    });
  }

  ngOnInit(): void {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
