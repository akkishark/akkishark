package org.example.back.config;

import java.io.File;

import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.unit.DataSize;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;

import javax.servlet.MultipartConfigElement;

// @Configuration
// public class MultipartConfig {
// 	@Bean
// 	public MultipartResolver multipartResolver() {
// 		return new StandardServletMultipartResolver();
// 	}
//
// 	@Bean
// 	public MultipartConfigElement multipartConfigElement() {
// 		MultipartConfigFactory factory = new MultipartConfigFactory();
// 		factory.setLocation("D:" + File.separator + "ssatudio");
// 		factory.setMaxRequestSize(DataSize.ofMegabytes(300L));
// 		factory.setMaxFileSize(DataSize.ofMegabytes(300L));
//
// 		return factory.createMultipartConfig();
// 	}
// }
