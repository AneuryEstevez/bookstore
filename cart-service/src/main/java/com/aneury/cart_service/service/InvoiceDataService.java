package com.aneury.cart_service.service;

import com.aneury.cart_service.dto.InvoiceData;
import com.aneury.cart_service.dto.InvoiceItem;
import com.aneury.cart_service.entity.Order;
import com.aneury.cart_service.entity.OrderItem;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvoiceDataService {

    public InvoiceData mapOrderToInvoiceData(Order order) {
        InvoiceData invoiceData = new InvoiceData();
        invoiceData.setOrderId(order.getId());
        invoiceData.setPurchaseDate(order.getPurchaseDate());
        invoiceData.setTotalAmount(order.getTotalAmount());
        invoiceData.setTransactionId(order.getTransactionId());
        invoiceData.setStatus(order.getStatus());
        
        // Map order items to invoice items
        List<InvoiceItem> invoiceItems = order.getItems().stream()
                .map(this::mapOrderItemToInvoiceItem)
                .collect(Collectors.toList());
        invoiceData.setItems(invoiceItems);
        
        return invoiceData;
    }
    
    private InvoiceItem mapOrderItemToInvoiceItem(OrderItem orderItem) {
        InvoiceItem invoiceItem = new InvoiceItem();
        invoiceItem.setBookId(orderItem.getBookId());
        invoiceItem.setTitle(orderItem.getTitle());
        invoiceItem.setAuthor(orderItem.getAuthor());
        invoiceItem.setQuantity(orderItem.getQuantity());
        invoiceItem.setPrice(orderItem.getPrice());
        invoiceItem.setSubtotal(orderItem.getQuantity() * orderItem.getPrice());
        return invoiceItem;
    }
}
