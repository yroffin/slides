package org.yroffin.slides.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import spark.Filter;
import spark.Request;
import spark.Response;

/**
 * basic filter for token validation
 */
public class SlidesAccessLogFilter implements Filter {
	
	protected final Logger logger = LoggerFactory.getLogger(getClass());

	@Override
	public void handle(Request request, Response response) throws Exception {
		int length = 0;
		if(response.body() != null) length = response.body().length();
		logger.warn("{} {} {} {} {} {} {}", request.ip(), request.contentLength(), request.requestMethod(), request.url(), request.protocol(), response.status(), length);
	}

}
