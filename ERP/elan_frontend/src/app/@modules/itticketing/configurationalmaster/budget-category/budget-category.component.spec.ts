import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetCategoryComponent } from './budget-category.component';

describe('BudgetCategoryComponent', () => {
  let component: BudgetCategoryComponent;
  let fixture: ComponentFixture<BudgetCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
