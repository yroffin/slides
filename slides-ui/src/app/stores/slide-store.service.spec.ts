import { TestBed, inject } from '@angular/core/testing';

import { SlideStoreService } from './slide-store.service';

describe('SlideStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SlideStoreService]
    });
  });

  it('should be created', inject([SlideStoreService], (service: SlideStoreService) => {
    expect(service).toBeTruthy();
  }));
});
