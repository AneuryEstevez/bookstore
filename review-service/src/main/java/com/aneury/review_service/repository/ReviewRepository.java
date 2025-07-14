package com.aneury.review_service.repository;

import com.aneury.review_service.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findAllByBookId(String bookId);
    List<Review> findAllByUserId(Long userId);
    Optional<Review> findByUserIdAndBookId(Long userId, String bookId);
    List<Review> findTop10ByOrderByCreatedAtDesc();
}
