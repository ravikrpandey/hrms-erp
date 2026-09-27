import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetCategoryStatusComponent } from './budget-category-status.component';

describe('BudgetCategoryStatusComponent', () => {
  let component: BudgetCategoryStatusComponent;
  let fixture: ComponentFixture<BudgetCategoryStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetCategoryStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetCategoryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
