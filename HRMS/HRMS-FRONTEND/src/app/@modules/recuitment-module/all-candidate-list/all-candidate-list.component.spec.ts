import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCandidateListComponent } from './all-candidate-list.component';

describe('VarificationListComponent', () => {
  let component: AllCandidateListComponent;
  let fixture: ComponentFixture<AllCandidateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCandidateListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCandidateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
