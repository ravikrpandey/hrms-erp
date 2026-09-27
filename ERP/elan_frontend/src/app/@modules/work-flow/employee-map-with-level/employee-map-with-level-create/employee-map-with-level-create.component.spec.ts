import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMapWithLevelCreateComponent } from './employee-map-with-level-create.component';

describe('EmployeeMapWithLevelCreateComponent', () => {
  let component: EmployeeMapWithLevelCreateComponent;
  let fixture: ComponentFixture<EmployeeMapWithLevelCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeMapWithLevelCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeMapWithLevelCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
