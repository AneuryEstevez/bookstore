package com.aneury.notify_report_service.service;

import com.aneury.notify_report_service.dto.InvoiceData;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class ReportService {

    public byte[] generateInvoicePdf(InvoiceData invoiceData) throws FileNotFoundException, JRException {

        InputStream inputStream = getClass().getResourceAsStream("/invoice.jrxml");
        JasperReport jasperReport = JasperCompileManager.compileReport(inputStream);

        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(invoiceData.getItems());

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("invoice_id", invoiceData.getOrderId());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a dd/MM/yyyy");
        parameters.put("invoice_date", invoiceData.getPurchaseDate().format(formatter));
        parameters.put("total", invoiceData.getTotalAmount());

        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);

        return JasperExportManager.exportReportToPdf(jasperPrint);
    }
}
