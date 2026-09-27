import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDirectAssetComponent } from './create-direct-asset.component';

describe('CreateDirectAssetComponent', () => {
  let component: CreateDirectAssetComponent;
  let fixture: ComponentFixture<CreateDirectAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDirectAssetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDirectAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
