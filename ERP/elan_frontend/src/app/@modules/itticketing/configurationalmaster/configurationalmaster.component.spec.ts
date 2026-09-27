import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationalmasterComponent } from './configurationalmaster.component';

describe('ConfigurationalmasterComponent', () => {
  let component: ConfigurationalmasterComponent;
  let fixture: ComponentFixture<ConfigurationalmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationalmasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationalmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
