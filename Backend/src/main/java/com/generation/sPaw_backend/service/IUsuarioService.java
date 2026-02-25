package com.generation.sPaw_backend.service;

import java.util.List;
import java.util.Optional;

import com.generation.sPaw_backend.dto.PerfilDto;
import com.generation.sPaw_backend.model.Mascota;
import com.generation.sPaw_backend.model.Usuario;

public interface IUsuarioService {
    List<Usuario> obtenerTodos();
    Optional<Usuario> obtenerPorId(Long id);
    Usuario obtenerPerfilPorEmail(String email);
    Usuario guardarUsuario(Usuario usuario);
    void eliminarUsuario(Long id);
    void actualizarUsuario(Long id, Usuario usuarioActualizado);
    Usuario agregarMascota(Long idUsuario, Mascota mascota);
    List<Usuario> obtenerPorRol(String rol);
    Usuario registrarUsuario(Usuario usuario);
}