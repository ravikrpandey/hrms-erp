import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoryItemActionComponent } from './accessory-item-action.component';

describe('AccessoryItemActionComponent', () => {
  let component: AccessoryItemActionComponent;
  let fixture: ComponentFixture<AccessoryItemActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessoryItemActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessoryItemActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
