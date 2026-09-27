import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPerformanceEmpComponent } from './view-performance-emp.component';

describe('ViewPerformanceEmpComponent', () => {
  let component: ViewPerformanceEmpComponent;
  let fixture: ComponentFixture<ViewPerformanceEmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPerformanceEmpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPerformanceEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
