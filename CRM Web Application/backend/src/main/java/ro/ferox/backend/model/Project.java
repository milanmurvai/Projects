package ro.ferox.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ro.ferox.backend.model.enums.Status;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "project")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "The id of the project")
    private Long id;

    @Column(nullable = false, length = 64)
    @Schema(description = "The name of the project")
    private String name;

    @Column(nullable = false, length = 64)
    @Schema(description = "The description of the project")
    private String description;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id")
    @Schema(description = "The client of the project")
    private Client client;

    @Column(nullable = false, length = 64)
    @Schema(description = "The address of the project")
    private String address;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Schema(description = "The materials and their quantity used for the project")
    private List<ProjectMaterial> materials = new ArrayList<>();

    @Column(nullable = false)
    @Schema(description = "The number of hours worked on the project")
    private double hours = 0;

    @Column(nullable = false)
    @Schema(description = "The price of the project")
    private int price;

    @Column(nullable = false)
    @Schema(description = "The payment made in advance for the project")
    private int advance;

    @Column(nullable = false)
    @Schema(description = "True/false if an invoice was issued for the project")
    private boolean invoice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Schema(description = "The status of the project")
    private Status status;

    @Column(nullable = false)
    @Schema(description = "The date when the project was started")
    private LocalDate startDate;

    @Column(nullable = false)
    @Schema(description = "The limit date for the project")
    private LocalDate limitDate;

    @Schema(description = "The users of the project")
    @ManyToMany(mappedBy = "projects", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<User> users;

    @Schema(description = "The total amount of the project")
    private double totalAmount = 0;

    public Project(String name, String description, Client client, String address, int price, int advance,
                   boolean invoice, Status status, LocalDate startDate, LocalDate limitDate) {
        this.name = name;
        this.description = description;
        this.client = client;
        this.address = address;
        this.price = price;
        this.advance = advance;
        this.invoice = invoice;
        this.status = status;
        this.startDate = startDate;
        this.limitDate = limitDate;
    }

    public void updateTotalAmount() {
        this.totalAmount = getTotalAmount();
    }

    public double getTotalAmount() {
        return materials.stream()
                .mapToDouble(ProjectMaterial::getTotal)
                .sum();
    }

    public void addMaterial(ProjectMaterial material) {
        materials.add(material);
        material.setProject(this);
        updateTotalAmount();
    }

    public void removeMaterial(ProjectMaterial material) {
        materials.remove(material);
        material.setProject(null);
        updateTotalAmount();
    }

    public void addHours(double hours) {
        this.hours += hours;
    }

    @Override
    public String toString() {
        return "Project{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", client=" + client.getName() +
                ", address='" + address + '\'' +
                ", hours=" + hours +
                ", price=" + price +
                ", advance=" + advance +
                ", invoice=" + invoice +
                ", status=" + status +
                ", startDate=" + startDate +
                ", limitDate=" + limitDate +
                '}';
    }

    public void addUser(User user) {
        users.add(user);
        user.getProjects().add(this);
    }

    public void removeUser(User user) {
        users.remove(user);
        user.getProjects().remove(this);
    }
}
