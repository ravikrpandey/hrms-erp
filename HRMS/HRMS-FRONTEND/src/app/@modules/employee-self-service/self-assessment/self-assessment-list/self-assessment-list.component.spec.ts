import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfAssessmentListComponent } from './self-assessment-list.component';

describe('SelfAssessmentListComponent', () => {
  let component: SelfAssessmentListComponent;
  let fixture: ComponentFixture<SelfAssessmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfAssessmentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfAssessmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
