package com.aneury.cart_service.feign;

import com.aneury.cart_service.dto.InvoiceData;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient("NOTIFY-REPORT-SERVICE")
public interface NotifyInterface {
    @PostMapping("api/notify/send-invoice")
    void sendInvoice(@RequestHeader("X-User-Email") String email, @RequestBody InvoiceData invoiceData);
}
