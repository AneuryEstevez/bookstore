package com.aneury.review_service.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient("CART-SERVICE")
public interface CartInterface {
    @GetMapping("api/order/verify-purchase")
    public boolean verifyPurchase(@RequestHeader("X-User-Id") Long userId,
                                  @RequestParam String bookId);
}
