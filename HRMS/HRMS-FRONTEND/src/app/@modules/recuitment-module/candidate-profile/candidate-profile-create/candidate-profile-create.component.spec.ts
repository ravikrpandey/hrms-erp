import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateProfileCreateComponent } from './candidate-profile-create.component';

describe('CandidateProfileCreateComponent', () => {
  let component: CandidateProfileCreateComponent;
  let fixture: ComponentFixture<CandidateProfileCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateProfileCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateProfileCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
