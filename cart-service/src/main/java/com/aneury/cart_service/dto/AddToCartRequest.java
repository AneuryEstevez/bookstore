package com.aneury.cart_service.dto;

import lombok.Data;
import jakarta.validation.constraints.Min;

@Data
public class AddToCartRequest {
    private String bookId;
    @Min(value = 1, message = "Quantity must be greater than 0")
    private int quantity;
}
