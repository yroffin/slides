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

package org.yroffin.slides.resources.api.slide;

import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slides.yroffin.model.slide.SlideBean;
import org.slides.yroffin.model.slide.SlideRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.yroffin.slides.resources.api.ApiResources;
import org.yroffin.slides.resources.api.Declare;
import org.yroffin.slides.resources.api.GenericValue;
import org.yroffin.slides.type.GenericMap;

import io.swagger.annotations.Api;

/**
 * Block resource
 */
@Api(value = "slide")
@Path("/api/slides")
@Produces("application/json")
@Component
@Declare(resource = "slides", summary = "Slides resource", rest = SlideRest.class)
public class ApiSlideResources extends ApiResources<SlideRest, SlideBean> {
	protected Logger logger = LoggerFactory.getLogger(ApiSlideResources.class);

	@Autowired
	Environment env;
	
	/**
	 * constructor
	 */
	public ApiSlideResources() {
		setRestClass(SlideRest.class);
		setBeanClass(SlideBean.class);
	}

	@Override
	public GenericValue doRealTask(SlideBean bean, GenericMap args, String taskType) {
		return null;
	}
}
