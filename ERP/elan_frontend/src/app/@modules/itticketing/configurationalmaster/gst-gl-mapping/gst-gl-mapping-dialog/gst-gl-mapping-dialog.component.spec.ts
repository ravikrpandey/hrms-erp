import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstGlMappingDialogComponent } from './gst-gl-mapping-dialog.component';

describe('GstGlMappingDialogComponent', () => {
  let component: GstGlMappingDialogComponent;
  let fixture: ComponentFixture<GstGlMappingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GstGlMappingDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GstGlMappingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
