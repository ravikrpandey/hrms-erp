import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalLevelCreateComponent } from './approval-level-create.component';

describe('ApprovalLevelCreateComponent', () => {
  let component: ApprovalLevelCreateComponent;
  let fixture: ComponentFixture<ApprovalLevelCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalLevelCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalLevelCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
