import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpsReports } from './nps-reports';

describe('NpsReports', () => {
  let component: NpsReports;
  let fixture: ComponentFixture<NpsReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NpsReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NpsReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
