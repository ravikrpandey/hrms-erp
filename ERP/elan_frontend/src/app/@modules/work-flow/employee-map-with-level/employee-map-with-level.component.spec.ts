import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMapWithLevelComponent } from './employee-map-with-level.component';

describe('EmployeeMapWithLevelComponent', () => {
  let component: EmployeeMapWithLevelComponent;
  let fixture: ComponentFixture<EmployeeMapWithLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeMapWithLevelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeMapWithLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
