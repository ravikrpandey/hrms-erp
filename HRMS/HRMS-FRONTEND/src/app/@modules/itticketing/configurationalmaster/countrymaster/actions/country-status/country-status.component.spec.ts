import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryStatusComponent } from './country-status.component';

describe('CountryStatusComponent', () => {
  let component: CountryStatusComponent;
  let fixture: ComponentFixture<CountryStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountryStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
