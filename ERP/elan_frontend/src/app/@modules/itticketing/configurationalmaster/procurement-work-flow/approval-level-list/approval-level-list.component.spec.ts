import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalLevelListComponent } from './approval-level-list.component';

describe('ApprovalLevelListComponent', () => {
  let component: ApprovalLevelListComponent;
  let fixture: ComponentFixture<ApprovalLevelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalLevelListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalLevelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
