package com.generation.sPaw_backend.controller;

import com.generation.sPaw_backend.model.Mascota;
import com.generation.sPaw_backend.model.Servicio;
import com.generation.sPaw_backend.service.MascotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.generation.sPaw_backend.model.Usuario;
import com.generation.sPaw_backend.service.UsuarioService;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    private final UsuarioService usuarioService;
    private final MascotaService mascotaService;

    @Autowired
    public UsuarioController(UsuarioService usuarioService, MascotaService mascotaService) {
        this.usuarioService = usuarioService;
        this.mascotaService = mascotaService;
    }

    @GetMapping
    public List<Usuario> listaUsuarios(){
        return usuarioService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public Usuario obtenerPorId(@PathVariable Long id){
        return usuarioService.obtenerPorId(id)
                .orElse(new Usuario());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Usuario> obtenerPorEmail(@PathVariable String email) {
        try {
            Usuario usuario = usuarioService.obtenerPerfilPorEmail(email);
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/crear")
    public ResponseEntity<String> guardarUsuario(@RequestBody Usuario usuario){
        usuarioService.guardarUsuario(usuario);
        return ResponseEntity.ok("Usuario publicado con éxito");
    }

    @PutMapping("/{id}/actualizar")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        try {
            usuarioService.actualizarUsuario(id, usuario);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Fallo actualización, error: " + e.getMessage());
        }
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminarUsuario(@PathVariable Long id){
        usuarioService.obtenerPorId(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.ok("Usuario eliminado con éxito");
    }

    @PostMapping("/{id}/mascotas")
    public Usuario agregarMascota(@PathVariable Long id, @RequestBody Mascota mascota) {
        return usuarioService.agregarMascota(id, mascota);
    }

    @PutMapping("mascotas/{idMascota}")
    public ResponseEntity<Mascota> actualizarMascota(
            @PathVariable Long idMascota,
            @RequestBody Mascota mascota) {
        try {
            Mascota mascotaActualizada = mascotaService.actualizarMascota(idMascota, mascota);
            return ResponseEntity.ok(mascotaActualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("mascotas/eliminar/{id}")
    public ResponseEntity<Void> eliminarMascota(@PathVariable Long id) {
        try {
            mascotaService.eliminarMascota(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }



}