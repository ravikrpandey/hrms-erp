import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicalTypeComponent } from './vehical-type.component';

describe('VehicalTypeComponent', () => {
  let component: VehicalTypeComponent;
  let fixture: ComponentFixture<VehicalTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicalTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicalTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
