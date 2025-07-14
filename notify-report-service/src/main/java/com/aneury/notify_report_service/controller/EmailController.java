package com.aneury.notify_report_service.controller;

import com.aneury.notify_report_service.dto.InvoiceData;
import com.aneury.notify_report_service.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notify")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    @PostMapping("/send-invoice")
    public void sendInvoice(@RequestHeader("X-User-Email") String email, @RequestBody InvoiceData invoiceData) {
        try {
            emailService.sendInvoiceEmail(email, invoiceData);
            System.out.println("Email sent successfully");
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
