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

package org.yroffin.slides.resources.api.folder;

import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slides.yroffin.model.folder.FolderBean;
import org.slides.yroffin.model.folder.FolderRest;
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
@Api(value = "folder")
@Path("/api/folders")
@Produces("application/json")
@Component
@Declare(resource = "folders", summary = "Folders resource", rest = FolderRest.class)
public class ApiFolderResources extends ApiResources<FolderRest, FolderBean> {
	protected Logger logger = LoggerFactory.getLogger(ApiFolderResources.class);

	@Autowired
	Environment env;
	
	/**
	 * constructor
	 */
	public ApiFolderResources() {
		setRestClass(FolderRest.class);
		setBeanClass(FolderBean.class);
	}

	@Override
	public GenericValue doRealTask(FolderBean bean, GenericMap args, String taskType) {
		return null;
	}
}
