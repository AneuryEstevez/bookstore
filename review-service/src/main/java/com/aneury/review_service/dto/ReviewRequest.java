package com.aneury.review_service.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private String bookId;
    private String bookTitle;
    private int rating;
    private String content;
}
