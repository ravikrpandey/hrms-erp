import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlMappingListComponent } from './gl-mapping-list.component';

describe('GlMappingListComponent', () => {
  let component: GlMappingListComponent;
  let fixture: ComponentFixture<GlMappingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlMappingListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlMappingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
