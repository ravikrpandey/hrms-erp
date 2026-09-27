import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProbationActionComponent } from './probation-action.component';

describe('ProbationActionComponent', () => {
  let component: ProbationActionComponent;
  let fixture: ComponentFixture<ProbationActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProbationActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProbationActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
