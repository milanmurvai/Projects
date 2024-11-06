package ro.ferox.backend.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "material")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "The id of the material")
    private Long id;

    @Column(nullable = false, length = 64)
    @Schema(description = "The name of the material")
    private String name;

    @Column(nullable = false)
    @Schema(description = "The coefficient of the material")
    private double coefficient;

    public Material(String name, double coefficient) {
        this.name = name;
        this.coefficient = coefficient;
    }

}
