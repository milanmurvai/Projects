package ro.ferox.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.ferox.backend.dto.client.ClientRequest;
import ro.ferox.backend.exception.DeletionException;
import ro.ferox.backend.exception.NotFoundException;
import ro.ferox.backend.model.Client;
import ro.ferox.backend.repository.ClientRepo;
import ro.ferox.backend.repository.ProjectRepo;

import java.util.List;

@Service
public class ClientService {
    private final ClientRepo clientRepo;
    private final ProjectRepo projectRepo;

    public ClientService(ClientRepo clientRepo, ProjectRepo projectRepo) {
        this.clientRepo = clientRepo;
        this.projectRepo = projectRepo;
    }

    @Transactional
    public Client save(ClientRequest clientRequest) {
        Client clientToSave = new Client(clientRequest.name(), clientRequest.address(), clientRequest.phone(),
                clientRequest.email());
        return clientRepo.save(clientToSave);
    }

    @Transactional
    public void delete(Long id) throws NotFoundException {
        Client client = findById(id);
        if (projectRepo.countByClientId(client.getId()) > 0) {
            throw new DeletionException("Clientul nu poate fi sters deoarece are proiecte asociate.");
        }
        clientRepo.delete(client);
    }

    public Client findById(Long id) throws NotFoundException {
        return clientRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Client not found with id: " + id));
    }

    public Client findByName(String name) throws NotFoundException {
        return clientRepo.findByName(name)
                .orElseThrow(() -> new NotFoundException("Client not found with name: " + name));
    }

    public List<Client> getAllClients() {
        return clientRepo.findAll();
    }

    @Transactional
    public Client update(ClientRequest clientRequest, Long clientId) throws NotFoundException {
        Client clientToUpdate = findById(clientId);
        clientToUpdate.setName(clientRequest.name());
        clientToUpdate.setAddress(clientRequest.address());
        clientToUpdate.setPhone(clientRequest.phone());
        clientToUpdate.setEmail(clientRequest.email());
        return clientRepo.save(clientToUpdate);
    }
}
