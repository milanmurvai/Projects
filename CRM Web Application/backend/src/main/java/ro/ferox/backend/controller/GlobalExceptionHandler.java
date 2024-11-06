package ro.ferox.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import ro.ferox.backend.exception.DeletionException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DeletionException.class)
    public ResponseEntity<String> handleDeletionException(DeletionException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
}

