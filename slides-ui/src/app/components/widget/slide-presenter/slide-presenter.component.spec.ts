import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidePresenterComponent } from './slide-presenter.component';

describe('SlidePresenterComponent', () => {
  let component: SlidePresenterComponent;
  let fixture: ComponentFixture<SlidePresenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlidePresenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidePresenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
