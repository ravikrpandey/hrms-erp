import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gstr7TdsUnderGstComponent } from './gstr7-tds-under-gst.component';

describe('Gstr7TdsUnderGstComponent', () => {
  let component: Gstr7TdsUnderGstComponent;
  let fixture: ComponentFixture<Gstr7TdsUnderGstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Gstr7TdsUnderGstComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gstr7TdsUnderGstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
