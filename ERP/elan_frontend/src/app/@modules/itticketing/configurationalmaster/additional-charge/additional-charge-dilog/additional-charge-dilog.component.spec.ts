import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalChargeDilogComponent } from './additional-charge-dilog.component';

describe('AdditionalChargeDilogComponent', () => {
  let component: AdditionalChargeDilogComponent;
  let fixture: ComponentFixture<AdditionalChargeDilogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalChargeDilogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalChargeDilogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
