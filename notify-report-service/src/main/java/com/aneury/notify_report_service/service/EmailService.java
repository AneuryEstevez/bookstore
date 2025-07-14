package com.aneury.notify_report_service.service;

import com.aneury.notify_report_service.dto.InvoiceData;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.JRException;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final ReportService reportService;

    @Async
    public void sendInvoiceEmail(String to, InvoiceData invoiceData) throws InterruptedException, MessagingException, FileNotFoundException, JRException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

        helper.setTo(to);
        helper.setSubject("Invoice for Order #" + invoiceData.getOrderId());
        helper.setText("Thank you for your purchase!\n Please find the invoice details attached below.");
        
        // Generate PDF invoice
        byte[] pdfBytes = reportService.generateInvoicePdf(invoiceData);
        ByteArrayResource pdfResource = new ByteArrayResource(pdfBytes);
        
        helper.addAttachment("invoice_" + invoiceData.getOrderId() + ".pdf", pdfResource);
        mailSender.send(mimeMessage);
    }
}
