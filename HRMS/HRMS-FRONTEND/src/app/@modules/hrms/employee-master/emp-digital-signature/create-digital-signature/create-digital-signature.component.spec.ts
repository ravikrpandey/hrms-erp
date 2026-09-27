import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDigitalSignatureComponent } from './create-digital-signature.component';

describe('CreateDigitalSignatureComponent', () => {
  let component: CreateDigitalSignatureComponent;
  let fixture: ComponentFixture<CreateDigitalSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDigitalSignatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDigitalSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
