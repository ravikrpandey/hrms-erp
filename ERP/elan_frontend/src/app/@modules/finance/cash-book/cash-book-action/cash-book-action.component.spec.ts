import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashBookActionComponent } from './cash-book-action.component';

describe('CashBookActionComponent', () => {
  let component: CashBookActionComponent;
  let fixture: ComponentFixture<CashBookActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashBookActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashBookActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
