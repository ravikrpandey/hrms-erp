import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoryItemDilogComponent } from './accessory-item-dilog/accessory-item-dilog.component';

describe('AccessoryItemDilogComponent', () => {
  let component: AccessoryItemDilogComponent;
  let fixture: ComponentFixture<AccessoryItemDilogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessoryItemDilogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessoryItemDilogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
