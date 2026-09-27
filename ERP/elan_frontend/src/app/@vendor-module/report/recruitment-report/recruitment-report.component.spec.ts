import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentReportComponent } from './recruitment-report.component';

describe('RecruitmentReportComponent', () => {
  let component: RecruitmentReportComponent;
  let fixture: ComponentFixture<RecruitmentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruitmentReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruitmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
