import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleryUpdatedEmpComponent } from './salery-updated-emp.component';

describe('SaleryUpdatedEmpComponent', () => {
  let component: SaleryUpdatedEmpComponent;
  let fixture: ComponentFixture<SaleryUpdatedEmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleryUpdatedEmpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleryUpdatedEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
