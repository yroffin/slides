import { TestBed, inject } from '@angular/core/testing';

import { SidesStoreService } from './sides-store.service';

describe('SidesStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SidesStoreService]
    });
  });

  it('should be created', inject([SidesStoreService], (service: SidesStoreService) => {
    expect(service).toBeTruthy();
  }));
});
