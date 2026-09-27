import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidaterespondComponent } from './candidaterespond.component';

describe('CandidaterespondComponent', () => {
  let component: CandidaterespondComponent;
  let fixture: ComponentFixture<CandidaterespondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidaterespondComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidaterespondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
