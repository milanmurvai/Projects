package ro.ferox.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.ferox.backend.model.Activity;

import java.util.List;

@Repository
public interface ActivityRepo extends JpaRepository<Activity, Long> {
    List<Activity> findAllByUserId(Long userId);

    List<Activity> findAllByProjectId(Long projectId);
}
