import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruimentReportComponent } from './recruiment-report.component';

describe('RecruimentReportComponent', () => {
  let component: RecruimentReportComponent;
  let fixture: ComponentFixture<RecruimentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruimentReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruimentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
