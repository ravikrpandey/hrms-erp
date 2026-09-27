import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetPlanningCreateComponent } from './budget-planning-create.component';

describe('CostCenterCreateComponent', () => {
  let component: BudgetPlanningCreateComponent;
  let fixture: ComponentFixture<BudgetPlanningCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetPlanningCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetPlanningCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
