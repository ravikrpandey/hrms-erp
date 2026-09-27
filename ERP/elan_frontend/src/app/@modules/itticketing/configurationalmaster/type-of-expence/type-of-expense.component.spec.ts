import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeOfExpenseComponent } from './type-of-expense.component';

describe('TypeOfExpenseComponent', () => {
  let component: TypeOfExpenseComponent;
  let fixture: ComponentFixture<TypeOfExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeOfExpenseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeOfExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
