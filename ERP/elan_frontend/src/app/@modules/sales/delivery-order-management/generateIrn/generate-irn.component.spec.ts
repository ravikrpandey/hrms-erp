import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateIRN } from './generate-irn.component';

describe('GenerateIRN', () => {
  let component: GenerateIRN;
  let fixture: ComponentFixture<GenerateIRN>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateIRN ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateIRN);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
