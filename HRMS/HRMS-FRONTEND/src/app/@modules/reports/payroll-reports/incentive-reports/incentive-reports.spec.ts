import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveReports } from './incentive-reports';

describe('IncentiveReports', () => {
  let component: IncentiveReports;
  let fixture: ComponentFixture<IncentiveReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncentiveReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncentiveReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
