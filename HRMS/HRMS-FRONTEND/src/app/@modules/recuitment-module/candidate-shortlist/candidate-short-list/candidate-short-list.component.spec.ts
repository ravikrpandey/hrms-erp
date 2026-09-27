import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateShortListComponent } from './candidate-short-list.component';

describe('VarificationListComponent', () => {
  let component: CandidateShortListComponent;
  let fixture: ComponentFixture<CandidateShortListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateShortListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateShortListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
