import { TestBed, inject } from '@angular/core/testing';

import { Folders.StoreService } from './folders.store.service';

describe('Folders.StoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Folders.StoreService]
    });
  });

  it('should be created', inject([Folders.StoreService], (service: Folders.StoreService) => {
    expect(service).toBeTruthy();
  }));
});
