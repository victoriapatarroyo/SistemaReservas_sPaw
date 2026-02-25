package com.generation.sPaw_backend.controller;

import com.generation.sPaw_backend.model.Groomer;
import com.generation.sPaw_backend.model.Servicio;
import com.generation.sPaw_backend.service.IGroomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/groomers")
@CrossOrigin("*")
public class GroomerController {

    private final IGroomerService groomerService;

    public GroomerController(IGroomerService groomerService) {
        this.groomerService = groomerService;
    }


    @GetMapping
    public ResponseEntity<List<Groomer>> listar() {
        return ResponseEntity.ok(groomerService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Groomer> buscar(@PathVariable Long id) {
        return groomerService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/crear")
    public ResponseEntity<Groomer> crear(@RequestBody Groomer groomer) {
        return ResponseEntity.ok(groomerService.guardar(groomer));
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Groomer groomer) {
        try{
            Groomer groomerActualizado = groomerService.actualizarGroomer(id, groomer);
            return ResponseEntity.ok(groomerActualizado);
        } catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Fallo actualizacion, error: " + e.getMessage());
        }
    }


    @DeleteMapping("eliminar/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        return groomerService.buscarPorId(id)
                .map(g -> {
                    String nombre = g.getNombre();

                    if (!g.getReservas().isEmpty()) {
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body("No se puede eliminar, tiene reservas activas");
                    }

                    groomerService.eliminar(id);
                    return ResponseEntity.ok("El groomer fue eliminado con exito");
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("El groomer no fue encontrado"));
    }

}


