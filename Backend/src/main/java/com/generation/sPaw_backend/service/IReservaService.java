package com.generation.sPaw_backend.service;

import com.generation.sPaw_backend.model.Reserva;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface IReservaService {
    List<Reserva> obtenerTodas();
    Optional<Reserva> obtenerPorId(Long id);
    List<Reserva> obtenerPorFecha(LocalDate fecha);
    List<Reserva> obtenerPorMascota(Long idMascota);
    List<Reserva> obtenerPorGroomer(Long idGroomer);
    List<Reserva> obtenerPorUsuario(Long idUsuario);
    Reserva guardarReserva(Long usuarioId, Reserva reserva);
    Reserva actualizarReserva(Long id, Reserva reservaActualizada);
    void eliminarReserva(Long id);
    Reserva asignarGroomer(Long idReserva, Long idGroomer);
    Reserva asignarServicio(Long idReserva, Long idServicio);
    Reserva asignarMascota(Long idReserva, Long idMascota);
    boolean verificarDisponibilidad(LocalDate fecha, LocalTime horaInicio, LocalTime horaFinal, Long idGroomer);
}