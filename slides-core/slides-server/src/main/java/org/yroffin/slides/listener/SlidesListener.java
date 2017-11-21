package org.yroffin.slides.listener;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.SpringApplicationRunListener;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;

/**
 * simple listener
 */
public class SlidesListener implements SpringApplicationRunListener {

	/**
	 * constructor
	 * @param application 
	 * @param args 
	 */
	public SlidesListener(SpringApplication application, String[] args) {
		
	}

	@Override
	public void contextLoaded(ConfigurableApplicationContext arg0) {
	}

	@Override
	public void contextPrepared(ConfigurableApplicationContext arg0) {
	}

	@Override
	public void environmentPrepared(ConfigurableEnvironment arg0) {
	}

	@Override
	public void finished(ConfigurableApplicationContext arg0, Throwable arg1) {
	}

	@Override
	public void starting() {
	}

}
