package ro.ferox.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.ferox.backend.dto.employee.EmployeeRequest;
import ro.ferox.backend.exception.NotFoundException;
import ro.ferox.backend.model.Employee;
import ro.ferox.backend.repository.EmployeeRepo;

import java.util.List;

@Service
public class EmployeeService {
    private final EmployeeRepo employeeRepo;

    public EmployeeService(EmployeeRepo employeeRepo) {
        this.employeeRepo = employeeRepo;
    }

    @Transactional
    public Employee save(EmployeeRequest employeeRequest) {
        Employee employeeToSave = new Employee(employeeRequest.name(), employeeRequest.coefficient(), employeeRequest.costCoefficient());
        return employeeRepo.save(employeeToSave);
    }

    @Transactional
    public void delete(Long id) throws NotFoundException {
        Employee employee = findById(id);
        employeeRepo.delete(employee);
    }

    public Employee findById(Long id) throws NotFoundException {
        return employeeRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Employee not found with id: " + id));
    }


    public List<Employee> getAllEmployees() {
        return employeeRepo.findAll();
    }

    @Transactional
    public Employee update(EmployeeRequest employeeRequest, Long employeeId) throws NotFoundException {
        Employee employeeToUpdate = findById(employeeId);
        employeeToUpdate.setName(employeeRequest.name());
        employeeToUpdate.setCoefficient(employeeRequest.coefficient());
        employeeToUpdate.setCostCoefficient(employeeRequest.costCoefficient());
        return employeeRepo.save(employeeToUpdate);
    }
}
