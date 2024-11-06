package ro.ferox.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.ferox.backend.model.Material;

import java.util.Optional;

@Repository
public interface MaterialRepo extends JpaRepository<Material, Long> {
    Optional<Material> findByName(String name);

}
