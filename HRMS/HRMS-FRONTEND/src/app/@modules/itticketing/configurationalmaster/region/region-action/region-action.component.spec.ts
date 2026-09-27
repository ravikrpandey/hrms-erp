import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionActionComponent } from './region-action.component';

describe('RegionActionComponent', () => {
  let component: RegionActionComponent;
  let fixture: ComponentFixture<RegionActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegionActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegionActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
