import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpDigitalActionComponent } from './emp-digital-action.component';

describe('EmpDigitalActionComponent', () => {
  let component: EmpDigitalActionComponent;
  let fixture: ComponentFixture<EmpDigitalActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpDigitalActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpDigitalActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
