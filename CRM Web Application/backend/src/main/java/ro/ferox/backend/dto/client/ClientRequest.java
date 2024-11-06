package ro.ferox.backend.dto.client;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ClientRequest(
        @Schema(description = "The name of the client (required)")
        @NotBlank(message = "Name cannot be blank")
        @Size(min = 3, max = 64, message = "Name must be between 3 and 64 characters")
        String name,
        @Schema(description = "The address of the client (required)")
        @NotBlank(message = "Address cannot be blank")
        @Size(min = 3, max = 64, message = "Address must be between 3 and 64 characters")
        String address,
        @Schema(description = "The phone number of the client (required)")
        @NotBlank(message = "Phone cannot be blank")
        @Size(min = 3, max = 64, message = "Phone must be between 3 and 64 characters")
        String phone,
        @Schema(description = "The email of the client (required)")
        @NotBlank(message = "Email cannot be blank")
        @Size(min = 3, max = 64, message = "Email must be between 3 and 64 characters")
        String email
) {
    public ClientRequest(String name, String address, String phone, String email) {
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.email = email;
    }
}
