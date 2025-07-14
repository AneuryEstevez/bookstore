package com.aneury.review_service.controller;

import com.aneury.review_service.dto.ReviewRequest;
import com.aneury.review_service.entity.Review;
import com.aneury.review_service.feign.CartInterface;
import com.aneury.review_service.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;
    private final CartInterface cartInterface;

    @PostMapping
    public ResponseEntity<?> createReview(@RequestHeader("X-User-Id") Long userId,
                                          @RequestHeader("X-User-Email") String email,
                                          @RequestBody ReviewRequest reviewRequest) {
        try {
            if (cartInterface.verifyPurchase(userId, reviewRequest.getBookId())) {
                if (reviewService.getByUserIdAndBookId(userId, reviewRequest.getBookId()).isPresent()) {
                    return ResponseEntity.badRequest().body("There is already a review for this book");
                }
                Review review = reviewService.save(userId, email, reviewRequest);
                return ResponseEntity.ok(review);
            } else {
                return ResponseEntity.badRequest().body("You haven't purchased this book");
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.internalServerError().body("Something went wrong");
        }
    }

    @GetMapping("/book/{id}")
    public List<Review> getReviewByBookId(@PathVariable("id") String id) {
        return reviewService.getByBookId(id);
    }

    @GetMapping("/me")
    public List<Review> getReviewsByUser(@RequestHeader("X-User-Id") Long userId) {
        return reviewService.getByUserId(userId);
    }

    @GetMapping("/admin/recent")
    public ResponseEntity<?> getRecentReviews(@RequestHeader("X-User-Role") String userRole) {
        if (!"ROLE_ADMIN".equals(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        List<Review> recentReviews = reviewService.findTop10ByOrderByCreatedAtDesc();

        return ResponseEntity.ok(recentReviews);
    }
}
