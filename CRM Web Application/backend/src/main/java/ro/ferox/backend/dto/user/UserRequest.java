package ro.ferox.backend.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import ro.ferox.backend.model.enums.Type;

public record UserRequest(
        @Schema(description = "The username of the user (required)")
        @NotBlank(message = "Username cannot be blank")
        @Size(min = 3, max = 64, message = "Username must be between 3 and 64 characters")
        String username,
        @Schema(description = "The name of the user (required)")
        @NotBlank(message = "Name cannot be blank")
        @Size(min = 3, max = 64, message = "Name must be between 3 and 64 characters")
        String name,
        @Schema(description = "The password of the user (required)")
        @NotBlank(message = "Password cannot be blank")
        @Size(min = 3, max = 64, message = "Password must be between 3 and 64 characters")
        String password,
        @Schema(description = "The type of the user(required)", allowableValues = {"ADMIN", "ANGAJAT"})
        Type type
) {
    public UserRequest(String username, String name, String password, Type type) {
        this.username = username;
        this.name = name;
        this.password = password;
        this.type = type;
    }
}
