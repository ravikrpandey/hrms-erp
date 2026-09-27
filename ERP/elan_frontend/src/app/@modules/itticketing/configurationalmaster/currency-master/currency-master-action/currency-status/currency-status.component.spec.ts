import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyStatusComponent } from './currency-status.component';

describe('CurrencyStatusComponent', () => {
  let component: CurrencyStatusComponent;
  let fixture: ComponentFixture<CurrencyStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencyStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
