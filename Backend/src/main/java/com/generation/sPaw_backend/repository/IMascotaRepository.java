package com.generation.sPaw_backend.repository;

import com.generation.sPaw_backend.model.Mascota;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IMascotaRepository extends JpaRepository<Mascota, Long> {
    List<Mascota> findByUsuarioIdUsuario(Long idUsuario);
}
