package org.yroffin.slides.security;

import org.pac4j.core.authorization.generator.AuthorizationGenerator;
import org.pac4j.core.context.WebContext;

/**
 * authorization
 */
public class SlidesAuthorization implements AuthorizationGenerator<SlidesCoreProfile> {

	@Override
	public SlidesCoreProfile generate(WebContext context, SlidesCoreProfile profile) {
		return profile;
	}

}
