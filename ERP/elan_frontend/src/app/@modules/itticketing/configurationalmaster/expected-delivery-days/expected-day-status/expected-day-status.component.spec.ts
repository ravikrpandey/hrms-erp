import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectedDayStatusComponent } from './expected-day-status.component';

describe('ExpectedDayStatusComponent', () => {
  let component: ExpectedDayStatusComponent;
  let fixture: ComponentFixture<ExpectedDayStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpectedDayStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpectedDayStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
