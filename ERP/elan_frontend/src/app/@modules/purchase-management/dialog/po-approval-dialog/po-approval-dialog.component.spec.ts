import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoApprovalDialogComponent } from './po-approval-dialog.component';

describe('PoApprovalDialogComponent', () => {
  let component: PoApprovalDialogComponent;
  let fixture: ComponentFixture<PoApprovalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoApprovalDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoApprovalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
