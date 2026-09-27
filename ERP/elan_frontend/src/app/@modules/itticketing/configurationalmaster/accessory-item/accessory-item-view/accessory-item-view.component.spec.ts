import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoryItemViewComponent } from './accessory-item-view.component';

describe('AccessoryItemViewComponent', () => {
  let component: AccessoryItemViewComponent;
  let fixture: ComponentFixture<AccessoryItemViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessoryItemViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessoryItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
