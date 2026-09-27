import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateApprisalEmpComponent } from './update-apprisal-emp.component';

describe('UpdateApprisalEmpComponent', () => {
  let component: UpdateApprisalEmpComponent;
  let fixture: ComponentFixture<UpdateApprisalEmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateApprisalEmpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateApprisalEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
