import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitAndLossClearanceComponent } from './profit-and-loss-clearance.component';

describe('ProfitAndLossClearanceComponent', () => {
  let component: ProfitAndLossClearanceComponent;
  let fixture: ComponentFixture<ProfitAndLossClearanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfitAndLossClearanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfitAndLossClearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
