/* 
 * Copyright 2017 Yannick Roffin.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 import { Injectable } from '@angular/core';

@Injectable()
export class ConfigurationService {

  public ServerWithUrl: string;
  public ServerWithApiUrl: string;
  public AuthToken: string;

  private Server: string = "/";
  private ApiUrl: string = "api/";

  /**
   * constructor
   */
  constructor() {
    this.ServerWithUrl = this.Server;
    this.ServerWithApiUrl = this.Server + this.ApiUrl;
  }

  /**
   * fix session token
   * @param AuthToken 
   */
  public setAuthToken(AuthToken: string): void {
    this.AuthToken = AuthToken;
  }

  /**
   * get token
   * @param AuthToken 
   */
  public getAuthToken(): string {
    return this.AuthToken;
  }

}
