package com.aneury.cart_service.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
public class Order {
    @Id
    @GeneratedValue
    private Long id;

    private Long userId;
    private String userEmail;
    private OffsetDateTime purchaseDate;
    private double totalAmount;
    private String transactionId;
    private String status;

    @OneToMany(cascade= CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "orderId")
    private List<OrderItem> items;
}
