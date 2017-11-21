package org.yroffin.slides.security;

import org.pac4j.core.credentials.Credentials;

/**
 * default credentials
 */
public class SlidesCoreCredentials extends Credentials {

	/**
	 * serial
	 */
	private static final long serialVersionUID = 1L;

	@Override
	public String toString() {
		return "JarvisCoreCredentials [getClientName()=" + getClientName() + "]";
	}

	@Override
	public boolean equals(Object o) {
		return this.equals(o);
	}

	@Override
	public int hashCode() {
		return this.hashCode();
	}
}