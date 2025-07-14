package com.aneury.catalog_service.repository;

import com.aneury.catalog_service.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {
    Page<Book> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    Page<Book> findByAuthorContainingIgnoreCase(String author, Pageable pageable);
    Page<Book> findByGenreContainingIgnoreCase(String genre, Pageable pageable);
    Page<Book> findByPublisherContainingIgnoreCase(String publisher, Pageable pageable);
    
    // Unified search across all fields
    @Query("{'$or': [" +
           "{'title': {'$regex': ?0, '$options': 'i'}}, " +
           "{'author': {'$regex': ?0, '$options': 'i'}}, " +
           "{'genre': {'$regex': ?0, '$options': 'i'}}, " +
           "{'publisher': {'$regex': ?0, '$options': 'i'}}" +
           "]}")
    Page<Book> findBySearchQuery(String query, Pageable pageable);
}
