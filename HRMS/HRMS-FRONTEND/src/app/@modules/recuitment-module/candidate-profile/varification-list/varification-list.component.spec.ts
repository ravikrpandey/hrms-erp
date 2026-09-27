import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateProfileComponent1 } from './varification-list.component';

describe('VarificationListComponent', () => {
  let component: CandidateProfileComponent1;
  let fixture: ComponentFixture<CandidateProfileComponent1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateProfileComponent1 ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateProfileComponent1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
