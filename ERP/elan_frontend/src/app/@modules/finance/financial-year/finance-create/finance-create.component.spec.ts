import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceCreateComponent } from './finance-create.component';

describe('FinanceCreateComponent', () => {
  let component: FinanceCreateComponent;
  let fixture: ComponentFixture<FinanceCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
