import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeProbationComponent } from './employe-probation.component';

describe('EmployeProbationComponent', () => {
  let component: EmployeProbationComponent;
  let fixture: ComponentFixture<EmployeProbationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeProbationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeProbationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
