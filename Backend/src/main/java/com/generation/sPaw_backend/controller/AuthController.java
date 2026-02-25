package com.generation.sPaw_backend.controller;


import com.generation.sPaw_backend.JwtUtil;
import com.generation.sPaw_backend.dto.UsuarioDto;
import com.generation.sPaw_backend.model.Usuario;
import com.generation.sPaw_backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/registro")
    public ResponseEntity<?> register(@RequestBody Usuario usuario) {
        try {
            Usuario usuarioRegistrado = usuarioService.registrarUsuario(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioRegistrado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }


    @PostMapping("/loginConDTO")
    public ResponseEntity<?> loginConDTO(@RequestBody UsuarioDto usuarioDto) {
        UserDetails userDetails = usuarioService.loadUserByEmail(usuarioDto.getEmail());
        if (userDetails != null && passwordEncoder.matches(usuarioDto.getPasswordUsuario(), userDetails.getPassword())) {
            String token = jwtUtil.generateToken(userDetails.getUsername());

            Usuario usuario = usuarioService.obtenerPerfilPorEmail(usuarioDto.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);

            Map<String, Object> usuarioData = new HashMap<>();
            usuarioData.put("idUsuario", usuario.getIdUsuario());
            usuarioData.put("nombre", usuario.getNombre());
            usuarioData.put("apellido", usuario.getApellido());
            usuarioData.put("email", usuario.getEmail());

            response.put("usuario", usuarioData);

            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body("Credenciales inválidas");
    }

    @GetMapping("/resource")
    @PreAuthorize("hasRole('Cliente')")
    public ResponseEntity<String> getProtectedResource() {
        return ResponseEntity.ok("Este es un recurso protegido!");
    }
}
