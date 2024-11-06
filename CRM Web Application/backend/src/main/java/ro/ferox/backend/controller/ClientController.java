package ro.ferox.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ro.ferox.backend.dto.ResponseDto;
import ro.ferox.backend.dto.client.ClientRequest;
import ro.ferox.backend.exception.NotFoundException;
import ro.ferox.backend.model.Client;
import ro.ferox.backend.service.ClientService;

import java.util.List;

@RestController
@RequestMapping("/clients")
@Validated
public class ClientController {

    private final ClientService clientService;

    @Autowired
    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @Operation(summary = "Create a new client", description = "This endpoint is used to create a new client." +
            "The details of the client to be created are passed in the request body. " +
            "The response body contains the details of the created client.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Client created successfully",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = Client.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid request due to validation errors",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))}),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))})
    })
    @PostMapping
    public ResponseEntity<Client> createClient(@Valid @RequestBody ClientRequest clientRequest) {
        Client createdClient = clientService.save(clientRequest);
        return ResponseEntity.ok(createdClient);
    }

    @Operation(summary = "Delete a client", description = "This endpoint is used to delete an existing client.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Client deleted successfully",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))}),
            @ApiResponse(responseCode = "404", description = "The client with the given id does not exist",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))}),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))})
    })
    @DeleteMapping("/{clientId}")
    public ResponseEntity<?> deleteClient(@PathVariable("clientId") Long clientId) throws NotFoundException {
        clientService.delete(clientId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Edit a client", description = "This endpoint is used to edit an existing client." +
            "The details of the client to be edited are passed in the request body. " +
            "The response body contains the details of the updated client.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Client edited successfully",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = Client.class))}),
            @ApiResponse(responseCode = "404", description = "The client with the given id does not exist",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid request due to validation errors",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))}),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))})
    })
    @PutMapping("/{clientId}")
    public ResponseEntity<Client> updateClient(@PathVariable("clientId") Long clientId,
                                               @RequestBody ClientRequest clientRequest) throws NotFoundException {
        Client updatedClient = clientService.update(clientRequest, clientId);
        return ResponseEntity.ok(updatedClient);
    }

    @Operation(summary = "Get client with specified name", description = "This endpoint is used to retrieve a client with " +
            "specified name.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Client found successfully",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = Client.class))}),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))})
    })
    @GetMapping("/byName/{name}")
    public ResponseEntity<Client> getClientByName(@PathVariable("name") String name) throws NotFoundException {
        Client client = clientService.findByName(name);
        return ResponseEntity.ok(client);
    }

    @Operation(summary = "Get client by id", description = "This endpoint is used to retrieve a client with " +
            "specified id.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Client found successfully",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = Client.class))}),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))})
    })
    @GetMapping("/{clientId}")
    public ResponseEntity<Client> getClientById(@PathVariable("clientId") Long clientId) throws NotFoundException {
        Client client = clientService.findById(clientId);
        return ResponseEntity.ok(client);
    }

    @Operation(summary = "Get all clients", description = "This endpoint is used to retrieve all clients.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Clients found successfully",
                    content = {@Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = Client.class)))}),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDto.class))})
    })
    @GetMapping
    public ResponseEntity<List<Client>> getAllClients() {
        List<Client> clients = clientService.getAllClients();
        return ResponseEntity.ok(clients);
    }
}
