import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpaListComponent } from './kpa-list.component';

describe('KpaListComponent', () => {
  let component: KpaListComponent;
  let fixture: ComponentFixture<KpaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpaListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
