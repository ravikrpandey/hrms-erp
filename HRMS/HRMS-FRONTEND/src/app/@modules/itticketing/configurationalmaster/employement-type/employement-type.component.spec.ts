import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployementTypeComponent } from './employement-type.component';

describe('EmployementTypeComponent', () => {
  let component: EmployementTypeComponent;
  let fixture: ComponentFixture<EmployementTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployementTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployementTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
