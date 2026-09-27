import { ComponentFixture, TestBed } from '@angular/core/testing';

import { menuMasterComponent } from './menu-master.component';

describe('UserMasterListComponent', () => {
  let component: menuMasterComponent;
  let fixture: ComponentFixture<menuMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ menuMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(menuMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
