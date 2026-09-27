import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingApprovalSaleryComponent } from './pending-approval-salery.component';

describe('PendingApprovalSaleryComponent', () => {
  let component: PendingApprovalSaleryComponent;
  let fixture: ComponentFixture<PendingApprovalSaleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingApprovalSaleryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingApprovalSaleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
