import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDeskCreateComponent } from './help-desk-create.component';

describe('HelpDeskCreateComponent', () => {
  let component: HelpDeskCreateComponent;
  let fixture: ComponentFixture<HelpDeskCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpDeskCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpDeskCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
