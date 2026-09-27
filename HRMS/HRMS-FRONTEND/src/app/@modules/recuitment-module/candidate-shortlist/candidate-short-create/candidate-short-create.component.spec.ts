import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateShortCreateComponent } from './candidate-short-create.component';

describe('BvgListComponent', () => {
  let component: CandidateShortCreateComponent;
  let fixture: ComponentFixture<CandidateShortCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateShortCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateShortCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
