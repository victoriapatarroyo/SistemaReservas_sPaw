package com.generation.sPaw_backend.repository;

import com.generation.sPaw_backend.model.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IServicioRepository extends JpaRepository <Servicio, Long> {
}
