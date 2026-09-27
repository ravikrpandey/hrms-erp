import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendRfpComponent } from './send-rfp.component';

describe('SendRfpComponent', () => {
  let component: SendRfpComponent;
  let fixture: ComponentFixture<SendRfpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendRfpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendRfpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
