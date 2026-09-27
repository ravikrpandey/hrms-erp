import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherExpenseListComponent } from './other-expense-list.component';

describe('OtherExpenseListComponent', () => {
  let component: OtherExpenseListComponent;
  let fixture: ComponentFixture<OtherExpenseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherExpenseListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherExpenseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
