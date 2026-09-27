import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalManagerComponent } from './approval-manager.component';

describe('ApprovalManagerComponent', () => {
  let component: ApprovalManagerComponent;
  let fixture: ComponentFixture<ApprovalManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
