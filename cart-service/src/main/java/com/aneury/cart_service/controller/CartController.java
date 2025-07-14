package com.aneury.cart_service.controller;

import com.aneury.cart_service.dto.AddToCartRequest;
import com.aneury.cart_service.dto.Book;
import com.aneury.cart_service.dto.UpdateCartItemRequest;
import com.aneury.cart_service.entity.Cart;
import com.aneury.cart_service.feign.CatalogInterface;
import com.aneury.cart_service.service.CartService;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final CatalogInterface catalogInterface;

    @GetMapping
    public Cart cart(@RequestHeader("X-User-Id") String userId) {
        return cartService.getCartByUserId(Long.valueOf(userId));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestHeader("X-User-Id") String userId,
                                      @Valid @RequestBody AddToCartRequest request) {

        try {
            Book book = catalogInterface.getBookById(request.getBookId()).getBody();
            cartService.addToCart(Long.valueOf(userId), request, book);
            return ResponseEntity.ok().build();
        } catch (FeignException.NotFound e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body("Book not found");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body("Error while adding to cart");
        }
    }

    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFromCart(@RequestHeader("X-User-Id") String userId,
                                            @RequestParam String bookId) {
        try {
            cartService.deleteBook(Long.valueOf(userId), bookId);
            return ResponseEntity.ok().body("Book deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error while deleting from cart");
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateCartItem(@RequestHeader("X-User-Id") String userId,
                                            @Valid @RequestBody UpdateCartItemRequest request) {
        try {
            cartService.updateQuantity(Long.valueOf(userId), request);
            return ResponseEntity.ok().body("Cart item updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error while updating cart item");
        }
    }

    @DeleteMapping("/empty")
    public ResponseEntity<?> emptyCart(@RequestHeader("X-User-Id") String userId) {
        try {
            cartService.clearCart(Long.valueOf(userId));
            return ResponseEntity.ok().body("Cart emptied successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error while emptying cart");
        }
    }
}
