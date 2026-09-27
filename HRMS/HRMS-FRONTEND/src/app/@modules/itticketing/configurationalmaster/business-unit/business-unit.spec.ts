import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessUnit } from './business-unit';

describe('BusinessUnit', () => {
  let component: BusinessUnit;
  let fixture: ComponentFixture<BusinessUnit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessUnit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessUnit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
