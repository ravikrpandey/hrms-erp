import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrRfpStatusDialogComponent } from './pr-rfp-status-dialog.component';

describe('PrRfpStatusDialogComponent', () => {
  let component: PrRfpStatusDialogComponent;
  let fixture: ComponentFixture<PrRfpStatusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrRfpStatusDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrRfpStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
