import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingMenuComponent } from './listing-menu.component';

describe('ListingMenuComponent', () => {
  let component: ListingMenuComponent;
  let fixture: ComponentFixture<ListingMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListingMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
