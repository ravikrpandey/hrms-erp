import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoListComponent } from './so-list.component';

describe('SoListComponent', () => {
  let component: SoListComponent;
  let fixture: ComponentFixture<SoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
