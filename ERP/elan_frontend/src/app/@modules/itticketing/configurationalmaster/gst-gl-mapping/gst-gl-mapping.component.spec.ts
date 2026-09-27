import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstGlMappingComponent } from './gst-gl-mapping.component';

describe('GstGlMappingComponent', () => {
  let component: GstGlMappingComponent;
  let fixture: ComponentFixture<GstGlMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GstGlMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GstGlMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
