import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetCategoryDialogComponent } from './budget-category-dialog.component';

describe('LeaveTypeDialogComponent', () => {
  let component: BudgetCategoryDialogComponent;
  let fixture: ComponentFixture<BudgetCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetCategoryDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
