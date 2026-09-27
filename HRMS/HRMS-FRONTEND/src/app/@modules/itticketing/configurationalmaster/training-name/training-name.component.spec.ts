import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingNameComponent } from './training-name.component';

describe('TrainingNameComponent', () => {
  let component: TrainingNameComponent;
  let fixture: ComponentFixture<TrainingNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingNameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
