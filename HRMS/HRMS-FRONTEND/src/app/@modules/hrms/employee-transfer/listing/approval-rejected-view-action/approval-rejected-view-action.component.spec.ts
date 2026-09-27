import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalRejectedViewActionComponent } from './approval-rejected-view-action.component';

describe('ApprovalRejectedViewActionComponent', () => {
  let component: ApprovalRejectedViewActionComponent;
  let fixture: ComponentFixture<ApprovalRejectedViewActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalRejectedViewActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalRejectedViewActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
