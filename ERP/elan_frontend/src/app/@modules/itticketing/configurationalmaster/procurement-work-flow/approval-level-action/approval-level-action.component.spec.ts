import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalLevelActionComponent } from './approval-level-action.component';

describe('ApprovalLevelActionComponent', () => {
  let component: ApprovalLevelActionComponent;
  let fixture: ComponentFixture<ApprovalLevelActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalLevelActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalLevelActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
