
package com.generation.sPaw_backend.controller;

import com.generation.sPaw_backend.model.Reserva;
import com.generation.sPaw_backend.service.IReservaService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/reservas")
@CrossOrigin("*")
public class ReservaController {
    private final IReservaService reservaService;

    public ReservaController(IReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @GetMapping
    public ResponseEntity<List<Reserva>> obtenerTodas() {
        return ResponseEntity.ok(reservaService.obtenerTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reserva> obtenerPorId(@PathVariable Long id) {
        return reservaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/fecha/{fecha}")
    public ResponseEntity<List<Reserva>> obtenerPorFecha(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(reservaService.obtenerPorFecha(fecha));
    }

    @GetMapping("/mascota/{mascotaId}")
    public ResponseEntity<List<Reserva>> obtenerPorMascota(@PathVariable Long mascotaId) {
        return ResponseEntity.ok(reservaService.obtenerPorMascota(mascotaId));
    }

    @GetMapping("/groomer/{groomerId}")
    public ResponseEntity<List<Reserva>> obtenerPorGroomer(@PathVariable Long groomerId) {
        return ResponseEntity.ok(reservaService.obtenerPorGroomer(groomerId));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Reserva>> obtenerPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(reservaService.obtenerPorUsuario(usuarioId));
    }

    @PostMapping("/usuario/{usuarioId}/crear")
    public ResponseEntity<Reserva> crearParaUsuario(
            @PathVariable Long usuarioId,
            @RequestBody Reserva reserva) {
        try {
            Reserva reservaCreada = reservaService.guardarReserva(usuarioId, reserva);
            return ResponseEntity.status(HttpStatus.CREATED).body(reservaCreada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("actualizar/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Reserva reserva) {
        try {
            Reserva reservaActualizada = reservaService.actualizarReserva(id, reserva);
            return ResponseEntity.ok(reservaActualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Fallo actualización, error: " + e.getMessage());
        }
    }

    @DeleteMapping("eliminar/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            Reserva reserva = reservaService.obtenerPorId(id)
                    .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

            reservaService.eliminarReserva(id);
            return ResponseEntity.ok("La reserva fue eliminada con exito");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No se pudo eliminar, error: " + e.getMessage());
        }
    }

}
