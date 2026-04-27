package com.pingup.dto;

import javax.validation.constraints.Size;

public class UserDtos {
    public static class UpdateProfileRequest {
        @Size(min = 2, max = 80)
        public String fullName;
        @Size(min = 3, max = 40)
        public String username;
        @Size(max = 500)
        public String bio;
        public String profilePicture;
        public String coverPhoto;
        public String location;
        public String website;
        public Boolean privateAccount;
    }
}
