import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuListCardComponent } from './menu-list-card.component';

describe('MenuListCardComponent', () => {
  let component: MenuListCardComponent;
  let fixture: ComponentFixture<MenuListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuListCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
