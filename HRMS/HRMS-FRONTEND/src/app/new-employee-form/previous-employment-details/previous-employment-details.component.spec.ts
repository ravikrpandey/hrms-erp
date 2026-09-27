import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousEmploymentDetailsComponent } from './previous-employment-details.component';

describe('PreviousEmploymentDetailsComponent', () => {
  let component: PreviousEmploymentDetailsComponent;
  let fixture: ComponentFixture<PreviousEmploymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviousEmploymentDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviousEmploymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
