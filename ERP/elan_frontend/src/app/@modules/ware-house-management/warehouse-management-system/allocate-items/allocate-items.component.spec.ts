import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateItemsComponent } from './allocate-items.component';

describe('AllocateItemsComponent', () => {
  let component: AllocateItemsComponent;
  let fixture: ComponentFixture<AllocateItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocateItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocateItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
