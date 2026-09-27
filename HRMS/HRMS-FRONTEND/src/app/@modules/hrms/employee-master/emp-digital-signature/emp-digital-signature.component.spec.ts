import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpDigitalSignatureComponent } from './emp-digital-signature.component';

describe('EmpDigitalSignatureComponent', () => {
  let component: EmpDigitalSignatureComponent;
  let fixture: ComponentFixture<EmpDigitalSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpDigitalSignatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpDigitalSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
