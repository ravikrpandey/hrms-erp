import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebinarRegistrationComponent } from './webinar-registration.component';

describe('WebinarRegistrationComponent', () => {
  let component: WebinarRegistrationComponent;
  let fixture: ComponentFixture<WebinarRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebinarRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebinarRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
