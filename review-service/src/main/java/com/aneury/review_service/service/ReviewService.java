package com.aneury.review_service.service;

import com.aneury.review_service.dto.ReviewRequest;
import com.aneury.review_service.entity.Review;
import com.aneury.review_service.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;

    public Review save(Long userId, String userEmail, ReviewRequest reviewRequest) {
        Review review = Review.builder()
                .userId(userId)
                .userEmail(userEmail)
                .bookId(reviewRequest.getBookId())
                .bookTitle(reviewRequest.getBookTitle())
                .rating(reviewRequest.getRating())
                .content(reviewRequest.getContent())
                .createdAt(OffsetDateTime.now())
                .build();
        return reviewRepository.save(review);
    }

    public List<Review> getByUserId(Long userId) {
        return reviewRepository.findAllByUserId(userId);
    }

    public List<Review> getByBookId(String bookId) {
        return reviewRepository.findAllByBookId(bookId);
    }

    public Optional<Review> getByUserIdAndBookId(Long userId, String bookId) {
        return reviewRepository.findByUserIdAndBookId(userId, bookId);
    }

    public List<Review> findTop10ByOrderByCreatedAtDesc() {
        return reviewRepository.findTop10ByOrderByCreatedAtDesc();
    }
}
