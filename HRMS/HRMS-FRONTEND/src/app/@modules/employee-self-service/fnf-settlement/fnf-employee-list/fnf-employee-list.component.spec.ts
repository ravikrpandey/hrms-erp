import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FnfEmployeeListComponent } from './fnf-employee-list.component';

describe('FnfEmployeeListComponent', () => {
  let component: FnfEmployeeListComponent;
  let fixture: ComponentFixture<FnfEmployeeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FnfEmployeeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FnfEmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
