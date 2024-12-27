package com.example.demo.util;

import org.springframework.stereotype.Component;

@Component
public class UserFormatter {
    public String formatUserName(String prefix, String name) {
        return prefix + name;
    }
}
