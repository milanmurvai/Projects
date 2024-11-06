package ro.ferox.backend.dto.material;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MaterialRequest(
        @Schema(description = "The name of the material (required)")
        @NotBlank(message = "Name cannot be blank")
        @Size(min = 3, max = 64, message = "Name must be between 3 and 64 characters")
        String name,
        @Schema(description = "The coefficient of the material (required)")
        double coefficient
) {
    public MaterialRequest(String name, double coefficient) {
        this.name = name;
        this.coefficient = coefficient;
    }
}
