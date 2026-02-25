package com.generation.sPaw_backend.repository;

import com.generation.sPaw_backend.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface IReservaRepository extends JpaRepository <Reserva, Long> {
    List<Reserva> findByFecha(LocalDate fecha);
    List<Reserva> findByMascotaIdMascota(Long idMascota);
    List<Reserva> findByGroomerIdGroomer(Long idGroomer);
    List<Reserva> findByMascotaUsuarioIdUsuario(Long idUsuario);
    List<Reserva> findByFechaAndGroomerIdGroomer(LocalDate fecha, Long idGroomer);
}
