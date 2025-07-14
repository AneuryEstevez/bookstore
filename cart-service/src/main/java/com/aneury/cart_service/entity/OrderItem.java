package com.aneury.cart_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;
import jakarta.validation.constraints.Min;

@Entity
@Data
public class OrderItem {
    @Id
    @GeneratedValue
    private Long id;

    private Long orderId;
    private String bookId;
    private String title;
    private String author;
    @Min(value = 1, message = "Quantity must be greater than 0")
    private int quantity;
    private double price;
}
