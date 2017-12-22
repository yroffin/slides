import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideBrowserComponent } from './slide-browser.component';

describe('SlideBrowserComponent', () => {
  let component: SlideBrowserComponent;
  let fixture: ComponentFixture<SlideBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideBrowserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
