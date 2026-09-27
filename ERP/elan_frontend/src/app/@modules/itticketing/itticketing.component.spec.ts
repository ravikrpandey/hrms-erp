import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItticketingComponent } from './itticketing.component';

describe('ItticketingComponent', () => {
  let component: ItticketingComponent;
  let fixture: ComponentFixture<ItticketingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItticketingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItticketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
