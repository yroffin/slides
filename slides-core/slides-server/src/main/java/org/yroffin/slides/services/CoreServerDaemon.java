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

package org.yroffin.slides.services;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.joda.JodaModule;

import io.swagger.annotations.Contact;
import io.swagger.annotations.Info;
import io.swagger.annotations.SwaggerDefinition;
import io.swagger.annotations.Tag;

/**
 * main daemon
 */
@Component
@PropertySources({ @PropertySource(value = "classpath:server.properties", ignoreResourceNotFound = true),
		@PropertySource(value = "file://${slides.user.dir}/config.properties", ignoreResourceNotFound = true) })
@SwaggerDefinition(info = @Info(description = "Jarvis", version = "v1.0", //
		title = "Jarvis core system", contact = @Contact(name = "Yannick Roffin", url = "https://yroffin.github.io")), schemes = {
				SwaggerDefinition.Scheme.HTTP, SwaggerDefinition.Scheme.HTTPS }, consumes = {
						"application/json" }, produces = { "application/json" }, tags = { @Tag(name = "swagger") })
public class CoreServerDaemon {
	protected Logger logger = LoggerFactory.getLogger(CoreServerDaemon.class);

	@Autowired
	Environment env;

	protected ObjectMapper mapper = new ObjectMapper();

	/**
	 * start component
	 */
	@PostConstruct
	public void server() {
		/**
		 * init mapper
		 */
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		mapper.registerModule(new JodaModule());
	}
}
