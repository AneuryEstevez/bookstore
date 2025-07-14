package com.aneury.cart_service.dto;

import lombok.Data;

@Data
public class Book {
    private String id;
    private String title;
    private String author;
    private String genre;
    private String publisher;
    private double price;
}
