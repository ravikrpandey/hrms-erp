import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetActionComponent } from './asset-action.component';

describe('AssetActionComponent', () => {
  let component: AssetActionComponent;
  let fixture: ComponentFixture<AssetActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
