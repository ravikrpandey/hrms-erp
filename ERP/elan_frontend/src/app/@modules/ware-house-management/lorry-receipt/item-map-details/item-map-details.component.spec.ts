import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMapDetailsComponent } from './item-map-details.component';

describe('ItemMapDetailsComponent', () => {
  let component: ItemMapDetailsComponent;
  let fixture: ComponentFixture<ItemMapDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemMapDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemMapDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
