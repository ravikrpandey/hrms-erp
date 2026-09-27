import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedComplaintComponent } from './assigned-complaint.component';

describe('AssignedComplaintComponent', () => {
  let component: AssignedComplaintComponent;
  let fixture: ComponentFixture<AssignedComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedComplaintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
