package ro.ferox.backend.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "employee")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "The id of the employee")
    private Long id;

    @Column(nullable = false, length = 64)
    @Schema(description = "The name of the employee")
    private String name;

    @Column(nullable = false)
    @Schema(description = "The coefficient of the employee")
    private int coefficient;

    @Column(nullable = false)
    @Schema(description = "The cost coefficient of the employee")
    @JoinColumn(name = "cost_coefficient")
    private int costCoefficient;


    public Employee(String name, int coefficient, int costCoefficient) {
        this.name = name;
        this.coefficient = coefficient;
        this.costCoefficient = costCoefficient;
    }

}
