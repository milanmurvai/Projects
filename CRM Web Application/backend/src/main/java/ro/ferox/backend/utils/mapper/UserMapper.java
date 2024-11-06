package ro.ferox.backend.utils.mapper;

import org.springframework.stereotype.Component;
import ro.ferox.backend.dto.user.UserResponse;
import ro.ferox.backend.model.User;

import java.util.List;

@Component
public final class UserMapper {
    public static UserResponse entityToDto(User user) {
        return new UserResponse(user.getId(), user.getUsername(), user.getName(), user.getPassword(),
                user.getType());
    }

    public static List<UserResponse> entityListToDto(List<User> users) {
        return users.stream()
                .map(UserMapper::entityToDto)
                .toList();
    }
}
