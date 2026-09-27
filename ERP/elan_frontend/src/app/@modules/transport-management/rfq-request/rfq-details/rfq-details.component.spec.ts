import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqDetailsComponent } from './rfq-details.component';

describe('RfqDetailsComponent', () => {
  let component: RfqDetailsComponent;
  let fixture: ComponentFixture<RfqDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfqDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfqDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
