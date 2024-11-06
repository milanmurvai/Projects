package ro.ferox.backend.dto.employee;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EmployeeRequest(
        @Schema(description = "The name of the employee (required)")
        @NotBlank(message = "Name cannot be blank")
        @Size(min = 3, max = 64, message = "Name must be between 3 and 64 characters")
        String name,
        @Schema(description = "The coefficient of the employee (required)")
        @NotBlank(message = "Coefficient cannot be blank")
        int coefficient,
        @Schema(description = "The cost coefficient of the employee (required)")
        @NotBlank(message = "Cost coefficient cannot be blank")
        int costCoefficient

) {
    public EmployeeRequest(String name, int coefficient, int costCoefficient) {
        this.name = name;
        this.coefficient = coefficient;
        this.costCoefficient = costCoefficient;
    }
}
