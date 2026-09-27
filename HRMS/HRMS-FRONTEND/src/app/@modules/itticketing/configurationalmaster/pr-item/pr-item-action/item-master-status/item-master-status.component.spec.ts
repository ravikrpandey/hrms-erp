import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMasterStatusComponent } from './item-master-status.component';

describe('ItemMasterStatusComponent', () => {
  let component: ItemMasterStatusComponent;
  let fixture: ComponentFixture<ItemMasterStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemMasterStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemMasterStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
