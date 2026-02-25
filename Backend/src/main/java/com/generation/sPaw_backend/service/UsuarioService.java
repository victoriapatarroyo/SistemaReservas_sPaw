package com.generation.sPaw_backend.service;

import com.generation.sPaw_backend.dto.PerfilDto;
import com.generation.sPaw_backend.model.Mascota;
import com.generation.sPaw_backend.model.Rol;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import com.generation.sPaw_backend.model.Usuario;
import com.generation.sPaw_backend.repository.IUsuarioRepository;

@Service
public class UsuarioService implements IUsuarioService{

    private final IUsuarioRepository usuarioRepository;

    @Autowired
    public UsuarioService(IUsuarioRepository UsuarioRepository) {
        this.usuarioRepository = UsuarioRepository;
    }

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario registrarUsuario(Usuario usuario) {
        if (usuario.getNombre() == null || usuario.getApellido() == null ||
                usuario.getEmail() == null || usuario.getTelefono() == null ||
                usuario.getPasswordUsuario() == null || usuario.getRol() == null) {
            throw new IllegalArgumentException("Todos los campos son obligatorios");
        }

        if (usuarioRepository.findByEmail(usuario.getEmail()) != null) {
            throw new RuntimeException("Email ya esta registrado");
        }
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombre(usuario.getNombre());
        nuevoUsuario.setApellido(usuario.getApellido());
        nuevoUsuario.setEmail(usuario.getEmail());
        nuevoUsuario.setPasswordUsuario(passwordEncoder.encode(usuario.getPasswordUsuario()));
        nuevoUsuario.setTelefono(usuario.getTelefono());
        nuevoUsuario.setMascotas(new ArrayList<>());
        nuevoUsuario.setRol(usuario.getRol());

        return usuarioRepository.save(nuevoUsuario);
    }

    public UserDetails loadUserByEmail(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            throw new UsernameNotFoundException("Usuario no encontrado");
        }
        return  new org.springframework.security.core.userdetails.User(usuario.getEmail(), usuario.getPasswordUsuario(), new ArrayList<>());

    }

    @Override
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    @Override
    public Optional<Usuario> obtenerPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    @Override
    public Usuario obtenerPerfilPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email);

        if (usuario == null) {
            throw new UsernameNotFoundException("Usuario no encontrado con email: " + email);
        }

        return usuario;
    }

    @Override
    public Usuario guardarUsuario(Usuario usuario) {
        if(usuario.getRol() == null){
            usuario.setRol(Rol.Cliente);
        }
        return usuarioRepository.save(usuario);
    }

    @Override
    public void eliminarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

    @Override
    public void actualizarUsuario(Long id, Usuario usuarioActualizado) {
        //Saber si existe
        Usuario usuarioExistente = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado con el id: " + id));

        //Actualizar los campos de usuario existente
        if (usuarioExistente != null){
            usuarioExistente.setNombre(usuarioActualizado.getNombre());
            usuarioExistente.setApellido(usuarioActualizado.getApellido());
            usuarioExistente.setTelefono(usuarioActualizado.getTelefono());
            usuarioExistente.setEmail(usuarioActualizado.getEmail());
            usuarioExistente.setPasswordUsuario(usuarioActualizado.getPasswordUsuario());
            usuarioExistente.setRol(usuarioActualizado.getRol());

            // Guardar el usuario actualizado
            usuarioRepository.save(usuarioExistente);
        } else {
            throw new RuntimeException("Usuario no encontrado con el id: " + id);
        }
    }

    @Override
    public Usuario agregarMascota(Long idUsuario, Mascota mascota) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        mascota.setUsuario(usuario);
        usuario.getMascotas().add(mascota);

        return usuarioRepository.save(usuario);
    }

    @Override
    public List<Usuario> obtenerPorRol(String rol) {
        return usuarioRepository.findByRol(Rol.valueOf(rol));
    }
}