import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoryItemCreateComponent } from './accessory-item-create.component';

describe('AccessoryItemCreateComponent', () => {
  let component: AccessoryItemCreateComponent;
  let fixture: ComponentFixture<AccessoryItemCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessoryItemCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessoryItemCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
