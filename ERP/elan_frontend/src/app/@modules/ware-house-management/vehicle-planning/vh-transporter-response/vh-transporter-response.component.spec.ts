import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VhTransporterResponseComponent } from './vh-transporter-response.component';

describe('VhTransporterResponseComponent', () => {
  let component: VhTransporterResponseComponent;
  let fixture: ComponentFixture<VhTransporterResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VhTransporterResponseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VhTransporterResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
