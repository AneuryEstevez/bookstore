package com.aneury.notify_report_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class NotifyReportServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(NotifyReportServiceApplication.class, args);
	}

}
