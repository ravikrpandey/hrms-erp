import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusReports } from './bonus-reports';

describe('BonusReports', () => {
  let component: BonusReports;
  let fixture: ComponentFixture<BonusReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonusReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonusReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
