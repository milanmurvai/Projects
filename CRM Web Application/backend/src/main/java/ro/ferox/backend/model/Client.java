package ro.ferox.backend.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "client")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "The id of the client")
    private Long id;

    @Column(nullable = false, length = 64)
    @Schema(description = "The name of the client")
    private String name;

    @Column(nullable = false, length = 64)
    @Schema(description = "The address of the client")
    private String address;

    @Column(nullable = false, length = 64)
    @Schema(description = "The phone number of the client")
    private String phone;

    @Column(nullable = false, length = 64)
    @Schema(description = "The email of the client")
    private String email;

    public Client(String name, String address, String phone, String email) {
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.email = email;
    }
}
