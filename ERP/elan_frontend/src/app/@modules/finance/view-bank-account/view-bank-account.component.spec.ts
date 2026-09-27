import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBankAccountComponent } from './view-bank-account.component';

describe('ViewBankAccountComponent', () => {
  let component: ViewBankAccountComponent;
  let fixture: ComponentFixture<ViewBankAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBankAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBankAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
