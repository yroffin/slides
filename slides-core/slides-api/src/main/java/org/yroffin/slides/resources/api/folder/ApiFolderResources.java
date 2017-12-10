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

import static spark.Spark.get;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringWriter;
import java.io.Writer;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.MediaType;

import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.Velocity;
import org.apache.velocity.exception.MethodInvocationException;
import org.apache.velocity.exception.ParseErrorException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slides.yroffin.model.folder.FolderBean;
import org.slides.yroffin.model.folder.FolderRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.yroffin.slides.exception.TechnicalNotFoundException;
import org.yroffin.slides.resources.api.ApiResources;
import org.yroffin.slides.resources.api.Declare;
import org.yroffin.slides.resources.api.GenericValue;
import org.yroffin.slides.type.GenericMap;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import spark.Request;
import spark.Response;
import spark.Route;

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
	 * tools for template inside use
	 */
	public class Tools {
		/**
		 * @param url
		 * @return String
		 */
		public String wget(String url) {
			/**
			 * create client
			 */
			Client client = ClientBuilder.newClient();
			javax.ws.rs.core.Response entity;
			entity = client.target(url).request(MediaType.TEXT_PLAIN).accept(MediaType.TEXT_PLAIN)
					.acceptEncoding("charset=UTF-8").get();

			if (entity.getStatus() == 200) {
				String body = entity.readEntity(String.class);
				entity.close();
				return body;
			} else {
				logger.error("While retrieve {} HTTP RESULT {}", url, entity.getStatus());
				return "";
			}
		}
	}

	/**
	 * constructor
	 */
	public ApiFolderResources() {
		setRestClass(FolderRest.class);
		setBeanClass(FolderBean.class);
	}

	@Override
	public void mount() {
		super.mount();
		/**
		 * reveal presentation generation
		 */
		get("/api/reveal/folder/:id", reveal());
	}

	@Override
	public GenericValue doRealTask(FolderBean bean, GenericMap args, String taskType) {
		return null;
	}

	/**
	 * reveal presentation generation
	 * 
	 * @return Route
	 */
	@GET
	@Path("/api/reveal/folder/{id}")
	@ApiOperation(value = "Reveal presentation generation", nickname = "html")
	@ApiImplicitParams({ @ApiImplicitParam(required = true, dataType = "string", name = "id", paramType = "path"), })
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Success", response = String.class),
			@ApiResponse(code = 404, message = "Template not found", response = String.class) })
	public Route reveal() {
		return new Route() {
			@Override
			public Object handle(Request request, Response response) throws TechnicalNotFoundException {
				return render();
			}
		};
	}

	/**
	 * render it
	 * 
	 * @return
	 */
	private String render() {
		try {
			Velocity.init();
		} catch (Exception e) {
			logger.warn("Velocity init error {}", e);
			return "<html><body>error</body></html>";
		}

		/**
		 * context
		 */
		VelocityContext context = new VelocityContext();
		context.put("tools", new Tools());

		/**
		 * render
		 */
		Writer w = new StringWriter();

		try {
			InputStream inp = this.getClass().getResourceAsStream("/templates/reveal.html");
			Reader r = new InputStreamReader(inp);
			Velocity.evaluate(context, w, "reveal", r);
			inp.close();
		} catch (ParseErrorException pee) {
			/**
			 * thrown if something is wrong with the syntax of our template string
			 */
			logger.warn("Velocity parse error error {}", pee);
		} catch (MethodInvocationException mee) {
			/**
			 * thrown if a method of a reference called by the template throws an exception.
			 * That won't happen here as we aren't calling any methods in this example, but
			 * we have to catch them anyway
			 */
			logger.warn("Velocity method invocation error {}", mee);
		} catch (Exception e) {
			logger.warn("Velocity error {}", e);
		}

		return w.toString();
	}
}
