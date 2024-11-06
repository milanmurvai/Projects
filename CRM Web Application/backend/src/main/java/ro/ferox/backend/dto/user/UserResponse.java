package ro.ferox.backend.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import ro.ferox.backend.model.enums.Type;

public record UserResponse(
        @Schema(description = "The id of the user")
        Long id,
        @Schema(description = "The username of the user")
        String username,
        @Schema(description = "The name of the user")
        String name,
        @Schema(description = "The password of the user")
        String password,
        @Schema(description = "The type of the user")
        Type type
) {
    public UserResponse(Long id, String username, String name, String password, Type type) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.password = password;
        this.type = type;
    }
}
