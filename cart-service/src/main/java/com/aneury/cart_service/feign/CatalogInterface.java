package com.aneury.cart_service.feign;

import com.aneury.cart_service.dto.Book;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient("CATALOG-SERVICE")
public interface CatalogInterface {
    @GetMapping("/api/catalog/{id}")
    ResponseEntity<Book> getBookById(@PathVariable String id);
}
