package com.aneury.catalog_service.service;

import com.aneury.catalog_service.model.Book;
import com.aneury.catalog_service.repository.BookRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class BookService {
    private final BookRepository bookRepository;

    public List<Book> findAll() {
        return bookRepository.findAll();
    }
    
    public Page<Book> findAll(Pageable pageable) {
        return bookRepository.findAll(pageable);
    }

    public Optional<Book> getById(String id) {
        return bookRepository.findById(id);
    }

    public Page<Book> findByAuthor(String author, Pageable pageable) {
        return bookRepository.findByAuthorContainingIgnoreCase(author, pageable);
    }

    public Page<Book> findByTitle(String title, Pageable pageable) {
        return bookRepository.findByTitleContainingIgnoreCase(title, pageable);
    }
    
    public Page<Book> findByGenre(String genre, Pageable pageable) {
        return bookRepository.findByGenreContainingIgnoreCase(genre, pageable);
    }
    
    public Page<Book> findByPublisher(String publisher, Pageable pageable) {
        return bookRepository.findByPublisherContainingIgnoreCase(publisher, pageable);
    }
    
    public Page<Book> searchBooks(String query, Pageable pageable) {
        return bookRepository.findBySearchQuery(query, pageable);
    }

    public long count() {
        return bookRepository.count();
    }
}
