import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionAppraisalComponent } from './action-appraisal.component';

describe('ActionAppraisalComponent', () => {
  let component: ActionAppraisalComponent;
  let fixture: ComponentFixture<ActionAppraisalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionAppraisalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionAppraisalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
