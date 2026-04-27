package com.pingup.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class AuthDtos {
    public static class RegisterRequest {
        @Email
        @NotBlank
        public String email;

        @NotBlank
        @Size(min = 3, max = 40)
        public String username;

        @NotBlank
        @Size(min = 2, max = 80)
        public String fullName;

        @NotBlank
        @Size(min = 6, max = 100)
        public String password;
    }

    public static class LoginRequest {
        @NotBlank
        public String email;

        @NotBlank
        public String password;
    }

    public static class AuthResponse {
        public String token;
        public UserResponse user;

        public AuthResponse(String token, UserResponse user) {
            this.token = token;
            this.user = user;
        }
    }
}
