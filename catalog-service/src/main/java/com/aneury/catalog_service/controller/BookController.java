package com.aneury.catalog_service.controller;

import com.aneury.catalog_service.model.Book;
import com.aneury.catalog_service.service.BookService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/catalog")
@AllArgsConstructor
public class BookController {
    private final BookService bookService;

    @GetMapping
    public Page<Book> getAllBooks(@PageableDefault(size = 12, page = 0) Pageable pageable) {
        return bookService.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable String id) {
        return bookService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public Page<Book> searchBooks(@RequestParam String q, 
                                @PageableDefault(size = 12, page = 0) Pageable pageable) {
        return bookService.searchBooks(q, pageable);
    }

    @GetMapping("/title")
    public Page<Book> getBooksByTitle(@RequestParam String q, 
                                    @PageableDefault(size = 12, page = 0) Pageable pageable) {
        return bookService.findByTitle(q, pageable);
    }

    @GetMapping("/author")
    public Page<Book> getBooksByAuthor(@RequestParam String q, 
                                     @PageableDefault(size = 12, page = 0) Pageable pageable) {
        return bookService.findByAuthor(q, pageable);
    }

    @GetMapping("/genre")
    public Page<Book> getBooksByGenre(@RequestParam String q, 
                                    @PageableDefault(size = 12, page = 0) Pageable pageable) {
        return bookService.findByGenre(q, pageable);
    }

    @GetMapping("/publisher")
    public Page<Book> getBooksByPublisher(@RequestParam String q, 
                                        @PageableDefault(size = 12, page = 0) Pageable pageable) {
        return bookService.findByPublisher(q, pageable);
    }

    @GetMapping("/admin/stats")
    public ResponseEntity<?> getBookStats() {
        long totalBooks = bookService.count();

        // Count unique genres
        long categoriesCount = bookService.findAll().stream()
                .map(Book::getGenre)
                .distinct()
                .count();

        Map<String, Object> stats = Map.of(
                "totalBooks", totalBooks,
                "categoriesCount", categoriesCount
        );

        return ResponseEntity.ok(stats);
    }
}
