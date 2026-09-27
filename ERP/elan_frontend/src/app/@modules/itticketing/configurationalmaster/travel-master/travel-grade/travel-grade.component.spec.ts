import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelGradeComponent } from './travel-grade.component';

describe('TravelGradeComponent', () => {
  let component: TravelGradeComponent;
  let fixture: ComponentFixture<TravelGradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelGradeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
