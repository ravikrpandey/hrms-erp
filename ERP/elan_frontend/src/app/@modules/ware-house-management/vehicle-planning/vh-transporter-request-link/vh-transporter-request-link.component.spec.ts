import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VhTransporterRequestLinkComponent } from './vh-transporter-request-link.component';

describe('VhTransporterRequestLinkComponent', () => {
  let component: VhTransporterRequestLinkComponent;
  let fixture: ComponentFixture<VhTransporterRequestLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VhTransporterRequestLinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VhTransporterRequestLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
