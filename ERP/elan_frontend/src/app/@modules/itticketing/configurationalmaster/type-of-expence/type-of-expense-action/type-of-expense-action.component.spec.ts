import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeOfExpenseActionComponent } from './type-of-expense-action.component';

describe('TypeOfExpenseActionComponent', () => {
  let component: TypeOfExpenseActionComponent;
  let fixture: ComponentFixture<TypeOfExpenseActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeOfExpenseActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeOfExpenseActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
