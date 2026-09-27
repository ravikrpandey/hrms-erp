import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestForCashbookComponent } from './request-for-cashbook.component';

describe('RequestForCashbookComponent', () => {
  let component: RequestForCashbookComponent;
  let fixture: ComponentFixture<RequestForCashbookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestForCashbookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestForCashbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
