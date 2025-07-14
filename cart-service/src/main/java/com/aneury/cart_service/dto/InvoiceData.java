package com.aneury.cart_service.dto;

import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;

@Data
public class InvoiceData {
    private Long orderId;
    private OffsetDateTime purchaseDate;
    private double totalAmount;
    private String transactionId;
    private String status;
    private List<InvoiceItem> items;
}
