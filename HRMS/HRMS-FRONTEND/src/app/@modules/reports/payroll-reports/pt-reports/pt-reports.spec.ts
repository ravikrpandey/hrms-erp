import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtReports } from './pt-reports';

describe('PtReports', () => {
  let component: PtReports;
  let fixture: ComponentFixture<PtReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PtReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PtReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
