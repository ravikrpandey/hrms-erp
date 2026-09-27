import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityLogoComponent } from './entity-logo.component';

describe('EntityListComponent', () => {
  let component: EntityLogoComponent;
  let fixture: ComponentFixture<EntityLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityLogoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
