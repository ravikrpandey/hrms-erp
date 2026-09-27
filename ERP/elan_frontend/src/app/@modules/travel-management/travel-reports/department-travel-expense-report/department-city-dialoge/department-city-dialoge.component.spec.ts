import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentCityDialogeComponent } from './department-city-dialoge.component';

describe('DepartmentCityDialogeComponent', () => {
  let component: DepartmentCityDialogeComponent;
  let fixture: ComponentFixture<DepartmentCityDialogeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentCityDialogeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentCityDialogeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
