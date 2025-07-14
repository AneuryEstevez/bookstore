package com.aneury.cart_service.service;

import com.aneury.cart_service.entity.Cart;
import com.aneury.cart_service.entity.CartItem;
import com.aneury.cart_service.entity.Order;
import com.aneury.cart_service.entity.OrderItem;
import com.aneury.cart_service.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final CartService cartService;

    public Order processOrder(Long userId, String userEmail, String paypalOrderId) {
        Cart cart = cartService.getCartByUserId(userId);
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Create new order
        Order order = new Order();
        order.setUserId(userId);
        order.setUserEmail(userEmail);
        order.setPurchaseDate(OffsetDateTime.now());
        order.setStatus("COMPLETED");
        order.setTransactionId(paypalOrderId);

        // Converting cart items to order items and calculate total amount
        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

        for (CartItem cartItem : cart.getItems()) {
            if (cartItem.getQuantity() <= 0) {
                throw new RuntimeException("Cart item quantity must be greater than 0");
            }
            OrderItem orderItem = new OrderItem();
            orderItem.setBookId(cartItem.getBookId());
            orderItem.setTitle(cartItem.getTitle());
            orderItem.setAuthor(cartItem.getAuthor());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getPrice());

            orderItems.add(orderItem);

            totalAmount += orderItem.getPrice() * orderItem.getQuantity();
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);
        cartService.clearCart(userId);

        return savedOrder;
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public boolean verifyPurchase(Long userId, String bookId) {
        List<Order> userOrders = orderRepository.findByUserId(userId);
        
        return userOrders.stream()
                .anyMatch(order -> order.getItems().stream()
                        .anyMatch(item -> item.getBookId().equals(bookId)));
    }

    public List<Map<String, Object>> getMonthlyRevenue(List<Order> orders) {
        // Get current month
        YearMonth currentMonth = YearMonth.now();

        // Generate list of last 6 months
        List<YearMonth> last6Months = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            last6Months.add(currentMonth.minusMonths(i));
        }

        // Group orders by month and calculate revenue
        Map<YearMonth, Double> monthlyRevenueMap = orders.stream()
                .filter(order -> order.getPurchaseDate() != null)
                .collect(Collectors.groupingBy(
                        order -> YearMonth.from(order.getPurchaseDate()),
                        Collectors.summingDouble(Order::getTotalAmount)
                ));

        // Create result list with month names and revenue
        return last6Months.stream()
                .map(month -> {
                    String monthName = month.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
                    double revenue = monthlyRevenueMap.getOrDefault(month, 0.0);

                    Map<String, Object> monthData = new HashMap<>();
                    monthData.put("month", monthName);
                    monthData.put("revenue", Math.round(revenue * 100.0) / 100.0); // Round to 2 decimal places

                    return monthData;
                })
                .collect(Collectors.toList());
    }
    
}
