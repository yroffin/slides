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

package org.yroffin.slides;

import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.boot.SpringApplication;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * simple bootstrap for rest bootstrap
 */
@Configuration
@EnableAutoConfiguration
@ComponentScan
public class SlidesServer {
	protected static String normalizedPath;
	protected static Logger logger = LoggerFactory.getLogger(SlidesServer.class);
	
	{
		/**
		 * set normalized path in properties
		 */
		Path absolutePath = Paths.get(".").toAbsolutePath().normalize();
		String prefix = absolutePath.getRoot().toString();
		SlidesServer.normalizedPath = absolutePath.toString().replace(prefix, "\\").replace("\\", "/");
		/**
		 * fix properties
		 */
		if(System.getProperty("slides.user.dir") == null) {
			System.setProperty("slides.user.dir", normalizedPath);
		}
		if(System.getProperty("slides.log.dir") == null) {
			System.setProperty("slides.log.dir", normalizedPath);
		}
	}

	@Autowired
	Environment env;

	/**
	 * main entry
	 * 
	 * @param args
	 * @throws MalformedURLException
	 */
	@SuppressWarnings("resource")
	public static void main(String[] args) throws MalformedURLException {
		/**
		 * fix output
		 */
		new CoreStdoutConsole();
		new CoreStderrConsole();

		/**
		 * dump classpath
		 */
		ClassLoader cl = ClassLoader.getSystemClassLoader();

		URL[] urls = ((URLClassLoader) cl).getURLs();

		for (URL url : urls) {
			logger.trace("Classpath {}", url.getFile());
		}

		/**
		 * start application
		 */
		SpringApplication.run(SlidesServer.class, args);
	}
}
