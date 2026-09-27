import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdsReports } from './tds-reports';

describe('TdsReports', () => {
  let component: TdsReports;
  let fixture: ComponentFixture<TdsReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TdsReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TdsReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
