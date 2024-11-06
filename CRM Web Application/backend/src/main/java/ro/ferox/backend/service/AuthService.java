package ro.ferox.backend.service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.stereotype.Service;
import ro.ferox.backend.dto.user.UserRequest;
import ro.ferox.backend.dto.user.UserResponse;
import ro.ferox.backend.exception.AuthException;

@Service
public class AuthService {

    private final UserService userService;

    private final PasswordEncoder passwordEncoder;

    private final InMemoryUserDetailsManager inMemoryUserDetailsManager;

    public AuthService(UserService userService, PasswordEncoder passwordEncoder, InMemoryUserDetailsManager inMemoryUserDetailsManager) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.inMemoryUserDetailsManager = inMemoryUserDetailsManager;
    }


    public UserResponse signup(UserRequest userRequest) throws AuthException {
        if (userService.checkIfUsernameExists(userRequest.username())) {
            throw new AuthException("Username already exists");
        }
        UserResponse userResponse = userService.save(userRequest);
        UserDetails userDetails = User.withUsername(userRequest.username())
                .password(passwordEncoder.encode(userRequest.password()))
                .roles("ADMIN", "USER")
                .build();
        inMemoryUserDetailsManager.createUser(userDetails);
        return userResponse;
    }
}
