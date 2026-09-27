import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMapWithLevelActionComponent } from './employee-map-with-level-action.component';

describe('EmployeeMapWithLevelActionComponent', () => {
  let component: EmployeeMapWithLevelActionComponent;
  let fixture: ComponentFixture<EmployeeMapWithLevelActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeMapWithLevelActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeMapWithLevelActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
