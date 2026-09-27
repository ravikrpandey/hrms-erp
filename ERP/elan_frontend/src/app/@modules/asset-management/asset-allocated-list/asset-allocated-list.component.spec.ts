import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetAllocatedListComponent } from './asset-allocated-list.component';

describe('AssetAllocatedListComponent', () => {
  let component: AssetAllocatedListComponent;
  let fixture: ComponentFixture<AssetAllocatedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetAllocatedListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetAllocatedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
