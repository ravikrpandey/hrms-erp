import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentReportsComponent } from './recruitment-reports.component';

describe('RecruitmentReportsComponent', () => {
  let component: RecruitmentReportsComponent;
  let fixture: ComponentFixture<RecruitmentReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruitmentReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruitmentReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
