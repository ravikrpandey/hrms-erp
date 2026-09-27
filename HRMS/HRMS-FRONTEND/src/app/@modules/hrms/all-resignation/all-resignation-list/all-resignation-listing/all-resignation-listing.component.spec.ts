import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllResignationListingComponent } from './all-resignation-listing.component';

describe('AllResignationListingComponent', () => {
  let component: AllResignationListingComponent;
  let fixture: ComponentFixture<AllResignationListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllResignationListingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllResignationListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
