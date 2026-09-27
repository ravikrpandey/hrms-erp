import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetPlanningListComponent } from './budget-planning-list.component';

describe('BudgetPlanningListComponent', () => {
  let component: BudgetPlanningListComponent;
  let fixture: ComponentFixture<BudgetPlanningListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetPlanningListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetPlanningListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
