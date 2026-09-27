import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProbationEditComponent } from './probation-create.component';

describe('ProbationEditComponent', () => {
  let component: ProbationEditComponent;
  let fixture: ComponentFixture<ProbationEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProbationEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProbationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
