import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseCategoryStatusComponent } from './expense-category-status.component';

describe('ExpenseCategoryStatusComponent', () => {
  let component: ExpenseCategoryStatusComponent;
  let fixture: ComponentFixture<ExpenseCategoryStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseCategoryStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseCategoryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
