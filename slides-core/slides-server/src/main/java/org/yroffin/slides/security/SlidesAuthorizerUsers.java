package org.yroffin.slides.security;

import java.util.List;

import org.pac4j.core.authorization.authorizer.Authorizer;
import org.pac4j.core.context.WebContext;
import org.pac4j.core.exception.HttpAction;

/**
 * check with user list
 */
public class SlidesAuthorizerUsers implements Authorizer<SlidesCoreProfile> {

	private String[] users;

	/**
	 * @param users
	 */
	public SlidesAuthorizerUsers(String[] users) {
		this.users = users;
	}

	@Override
	public boolean isAuthorized(WebContext context, List<SlidesCoreProfile> profiles) throws HttpAction {
		for(String user : users) {
			for(SlidesCoreProfile profile: profiles) {
				if(user.equals(profile.getEmail())) {
					return true;
				}
			}
		}
		return false;
	}

}
