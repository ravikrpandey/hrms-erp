import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrApprovalDialogComponent } from './pr-approval-dialog.component';

describe('PrApprovalDialogComponent', () => {
  let component: PrApprovalDialogComponent;
  let fixture: ComponentFixture<PrApprovalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrApprovalDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrApprovalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
