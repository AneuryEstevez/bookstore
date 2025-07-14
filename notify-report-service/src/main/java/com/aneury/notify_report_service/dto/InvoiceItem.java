package com.aneury.notify_report_service.dto;

import lombok.Data;

@Data
public class InvoiceItem {
    private String bookId;
    private String title;
    private String author;
    private int quantity;
    private double price;
    private double subtotal;
}
