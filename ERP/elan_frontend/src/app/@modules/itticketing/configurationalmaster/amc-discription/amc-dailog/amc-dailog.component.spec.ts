import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmcDailogComponent } from './amc-dailog.component';

describe('AmcDailogComponent', () => {
  let component: AmcDailogComponent;
  let fixture: ComponentFixture<AmcDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmcDailogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmcDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
