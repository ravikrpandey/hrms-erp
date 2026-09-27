import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyLeaveDialogComponent } from './apply-leave-dialog.component';

describe('ApplyLeaveDialogComponent', () => {
  let component: ApplyLeaveDialogComponent;
  let fixture: ComponentFixture<ApplyLeaveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyLeaveDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyLeaveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
