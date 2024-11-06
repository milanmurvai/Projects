package ro.ferox.backend.model;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "project_material")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ProjectMaterial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "The id of the project material")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "material_id")
    private Material material;

    @Column(nullable = false)
    @Schema(description = "The quantity of the material")
    private double quantity;

    @Schema(description = "The total price of the material")
    private double total = 0;

    public ProjectMaterial(Project project, Material material, double quantity) {
        this.project = project;
        this.material = material;
        this.quantity = quantity;
    }


    public double calculateTotal() {
        return (material != null) ? material.getCoefficient() * quantity : 0;
    }

    @PrePersist
    @PreUpdate
    private void updateTotal() {
        total = calculateTotal();
    }
}
