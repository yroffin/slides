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

package org.yroffin.swagger;

import java.lang.reflect.Field;
import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.swagger.models.AbstractModel;
import io.swagger.models.ExternalDocs;
import io.swagger.models.Model;
import io.swagger.models.properties.ArrayProperty;
import io.swagger.models.properties.BooleanProperty;
import io.swagger.models.properties.DateTimeProperty;
import io.swagger.models.properties.IntegerProperty;
import io.swagger.models.properties.LongProperty;
import io.swagger.models.properties.ObjectProperty;
import io.swagger.models.properties.Property;
import io.swagger.models.properties.StringProperty;

/**
 * swagger model for rest class
 */
public class ModelRest extends AbstractModel implements Model {

	protected Logger logger = LoggerFactory.getLogger(ModelRest.class);
	
	private Map<String, Property> properties = new LinkedHashMap<String, Property>();
	private Class<?> rest;

	private String title;

	private String description;

	/**
	 * constructor
	 * @param rest
	 */
	public ModelRest(Class<?> rest) {
		this.rest = rest;
		for(Field field : rest.getFields()) {
			if(field.getGenericType().getTypeName().equals("java.lang.String")) {
				properties.put(field.getName(), new StringProperty());
			} else {
				if(field.getGenericType().getTypeName().equals("org.joda.time.DateTime")) {
					properties.put(field.getName(), new DateTimeProperty());
				} else {
					if(field.getGenericType().getTypeName().equals("boolean")) {
						properties.put(field.getName(), new BooleanProperty());
					} else {
						if(field.getGenericType().getTypeName().equals("int")) {
							properties.put(field.getName(), new IntegerProperty());
						} else {
							if(field.getGenericType().getTypeName().equals("long")) {
								properties.put(field.getName(), new LongProperty());
							} else {
								if(field.getGenericType().toString().startsWith("class org.jarvis")) {
									properties.put(field.getName(), new ObjectProperty());
								} else {
									if(field.getGenericType().toString().startsWith("java.util.List")) {
										properties.put(field.getName(), new ArrayProperty());
									} else {
										if(field.getGenericType().toString().startsWith("class org.common.core.type.GenericMap")) {
											properties.put(field.getName(), new ObjectProperty());
										} else {
											logger.warn("No type conversion for {}", field.getGenericType().toString());
										}
									}
								}
							}
						}
					}
				}
			}
		}
		title = rest.getCanonicalName();
		description = "Class " + rest.getSimpleName();
	}

	@Override
	public String getTitle() {
		return title;
	}

	@Override
	public void setTitle(String title) {
		this.title = title;
	}

	@Override
	public String getDescription() {
		return description;
	}

	@Override
	public void setDescription(String description) {
		this.description = description;
	}

	@Override
	public Map<String, Property> getProperties() {
		return properties;
	}

	@Override
	public void setProperties(Map<String, Property> properties) {
		this.properties = properties;
	}

	@Override
	public Object getExample() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void setExample(Object example) {
		// TODO Auto-generated method stub

	}

	@Override
	public ExternalDocs getExternalDocs() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getReference() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void setReference(String reference) {
		// TODO Auto-generated method stub

	}

	@Override
	public Map<String, Object> getVendorExtensions() {
		// TODO Auto-generated method stub
		return null;
	}

	public Object clone() {
        ModelRest cloned = new ModelRest(rest);
        super.cloneTo(cloned);
        if (this.properties != null) cloned.properties =  new LinkedHashMap<String, Property>(this.properties);

        return cloned;
	}
}
