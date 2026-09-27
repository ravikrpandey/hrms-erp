import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateEwayComponent } from './generate-eway.component';

describe('GenerateEwayComponent', () => {
  let component: GenerateEwayComponent;
  let fixture: ComponentFixture<GenerateEwayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateEwayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateEwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
