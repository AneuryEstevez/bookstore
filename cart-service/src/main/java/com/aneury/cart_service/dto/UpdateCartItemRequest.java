package com.aneury.cart_service.dto;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class UpdateCartItemRequest {
    private String bookId;
    @Min(value = 1, message = "Quantity must be greater than 0")
    private int quantity;
} 