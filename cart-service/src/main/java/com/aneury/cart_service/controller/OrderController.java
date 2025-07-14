package com.aneury.cart_service.controller;

import com.aneury.cart_service.dto.InvoiceData;
import com.aneury.cart_service.entity.Order;
import com.aneury.cart_service.feign.NotifyInterface;
import com.aneury.cart_service.service.InvoiceDataService;
import com.aneury.cart_service.service.OrderService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {
    
    private final OrderService orderService;
    private final NotifyInterface notifyInterface;
    private final InvoiceDataService invoiceDataService;

    @GetMapping
    public ResponseEntity<List<Order>> getOrdersByUser(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllOrders(@RequestHeader("X-User-Role") String userRole) {
        if (!userRole.equals("ROLE_ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body("Access denied. Admin privileges required");
        }
        return ResponseEntity.ok(orderService.getAllOrders());
    }
    
    @PostMapping("/process")
    public ResponseEntity<?> processOrder(@RequestHeader("X-User-Id") Long userId,
                                          @RequestHeader("X-User-Email") String email,
                                          @RequestParam String paypalOrderId) {
        try {
            Order order = orderService.processOrder(userId, email, paypalOrderId);
            InvoiceData invoiceData = invoiceDataService.mapOrderToInvoiceData(order);
            notifyInterface.sendInvoice(email, invoiceData);
            return ResponseEntity.ok(invoiceData);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Cart is empty");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("There was an error processing the order");
        }
    }

    @GetMapping("/verify-purchase")
    public boolean verifyPurchase(@RequestHeader("X-User-Id") Long userId,
                                  @RequestParam String bookId) {
        return orderService.verifyPurchase(userId, bookId);
    }

    @GetMapping("/admin/stats")
    public ResponseEntity<?> getOrderStats(@RequestHeader("X-User-Role") String userRole) {
        if (!userRole.equals("ROLE_ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
        
        List<Order> allOrders = orderService.getAllOrders();
        LocalDate today = LocalDate.now();
        
        // Calculate stats
        long totalOrders = allOrders.size();
        double totalRevenue = allOrders.stream().mapToDouble(Order::getTotalAmount).sum();
        
        long todayOrders = allOrders.stream()
            .filter(order -> order.getPurchaseDate().toLocalDate().equals(today))
            .count();
        
        double todayRevenue = allOrders.stream()
            .filter(order -> order.getPurchaseDate().toLocalDate().equals(today))
            .mapToDouble(Order::getTotalAmount)
            .sum();
        
        // Recent orders (last 10)
        List<Order> recentOrders = allOrders.stream()
            .sorted((o1, o2) -> o2.getPurchaseDate().compareTo(o1.getPurchaseDate()))
            .limit(10)
            .toList();
        
        // Monthly revenue (last 6 months)
        List<Map<String, Object>> monthlyRevenue = orderService.getMonthlyRevenue(allOrders);
        
        Map<String, Object> stats = Map.of(
            "totalOrders", totalOrders,
            "totalRevenue", totalRevenue,
            "todayOrders", todayOrders,
            "todayRevenue", todayRevenue,
            "recentOrders", recentOrders,
            "monthlyRevenue", monthlyRevenue
        );
        
        return ResponseEntity.ok(stats);
    }
}
