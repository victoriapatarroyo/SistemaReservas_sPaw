package com.generation.sPaw_backend.repository;

import com.generation.sPaw_backend.model.Rol;
import com.generation.sPaw_backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IUsuarioRepository extends JpaRepository <Usuario, Long>  {
    List<Usuario> findByRol(Rol rol);
    Usuario findByEmail(String email);
}
