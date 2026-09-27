import { ComponentFixture, TestBed } from '@angular/core/testing';

import { aiIntegrationComponent } from './ai-integration.component';

describe('aiIntegrationComponent', () => {
  let component: aiIntegrationComponent;
  let fixture: ComponentFixture<aiIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ aiIntegrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(aiIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
