import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqRequestComponent } from './rfq-request.component';

describe('RfqRequestComponent', () => {
  let component: RfqRequestComponent;
  let fixture: ComponentFixture<RfqRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfqRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfqRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
