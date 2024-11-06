package ro.ferox.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.ferox.backend.model.Employee;

@Repository
public interface EmployeeRepo extends JpaRepository<Employee, Long> {
}
