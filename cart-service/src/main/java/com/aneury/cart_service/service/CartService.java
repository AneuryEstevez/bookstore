package com.aneury.cart_service.service;

import com.aneury.cart_service.dto.AddToCartRequest;
import com.aneury.cart_service.dto.Book;
import com.aneury.cart_service.dto.UpdateCartItemRequest;
import com.aneury.cart_service.entity.Cart;
import com.aneury.cart_service.entity.CartItem;
import com.aneury.cart_service.repository.CartItemRepository;
import com.aneury.cart_service.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    public Optional<Cart> getCartById(Long id) {
        return cartRepository.findById(id);
    }

    public Cart getCartByUserId(Long userId) {
        Optional<Cart> cart = cartRepository.findByUserId(userId);
        if (cart.isPresent()) {
            return cart.get();
        }
        return createCartForUser(userId);
    }

    public void addToCart(Long userId, AddToCartRequest request, Book book) {
        if (request.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createCartForUser(userId));
        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndBookId(cart.getId(), request.getBookId());

        if (existingItem.isPresent()) {
            CartItem cartItem = existingItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
            cartItemRepository.save(cartItem);
        } else {
            CartItem newCartItem = CartItem.builder()
                    .bookId(request.getBookId())
                    .title(book.getTitle())
                    .author(book.getAuthor())
                    .quantity(request.getQuantity())
                    .price(book.getPrice())
                    .build();
            cart.getItems().add(newCartItem);
        }
        cartRepository.save(cart);
    }

    public void deleteBook(Long userId, String bookId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem existingItem = cartItemRepository.findByCartIdAndBookId(cart.getId(), bookId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        cart.getItems().remove(existingItem);
        cartRepository.save(cart);
    }

    public void updateQuantity(Long userId, UpdateCartItemRequest request) {
        if (request.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem cartItem = cartItemRepository.findByCartIdAndBookId(cart.getId(), request.getBookId())
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cartItem.setQuantity(request.getQuantity());
        cartItemRepository.save(cartItem);
    }

    private Cart createCartForUser(Long userId) {
        Cart cart = new Cart();
        cart.setUserId(userId);
        return cartRepository.save(cart);
    }

    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
