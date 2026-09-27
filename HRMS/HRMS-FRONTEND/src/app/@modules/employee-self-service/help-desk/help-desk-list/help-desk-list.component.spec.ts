import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDeskListComponent } from './help-desk-list.component';

describe('HelpDeskListComponent', () => {
  let component: HelpDeskListComponent;
  let fixture: ComponentFixture<HelpDeskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpDeskListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpDeskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
