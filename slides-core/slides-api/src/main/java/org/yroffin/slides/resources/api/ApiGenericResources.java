/**
 *  Copyright 2017 Yannick Roffin
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *   limitations under the License.
 */

package org.yroffin.slides.resources.api;

import org.yroffin.slides.exception.TechnicalException;
import org.yroffin.slides.resources.api.mapper.ApiMapper;
import org.yroffin.slides.type.GenericMap;

/**
 * default api resources
 *
 */
public abstract class ApiGenericResources extends ApiMapper {

	/**
	 * execute real task on all resources, all task must be overridden in each
	 * resources
	 * 
	 * @param args
	 * @param taskType
	 * @return String
	 * @throws TechnicalException 
	 */
	public abstract GenericValue doRealTask(GenericMap args, String taskType);

}
