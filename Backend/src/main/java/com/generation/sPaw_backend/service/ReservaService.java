package com.generation.sPaw_backend.service;

import com.generation.sPaw_backend.model.Groomer;
import com.generation.sPaw_backend.model.Mascota;
import com.generation.sPaw_backend.model.Reserva;
import com.generation.sPaw_backend.model.Servicio;
import com.generation.sPaw_backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ReservaService implements IReservaService {
    private final IReservaRepository reservaRepository;
    private final IGroomerRepository groomerRepository;
    private final IServicioRepository servicioRepository;
    private final IMascotaRepository mascotaRepository;
    private final IUsuarioRepository usuarioRepository;

    public ReservaService(IReservaRepository reservaRepository, IGroomerRepository groomerRepository, IServicioRepository servicioRepository, IMascotaRepository mascotaRepository, IUsuarioRepository usuarioRepository) {
        this.reservaRepository = reservaRepository;
        this.groomerRepository = groomerRepository;
        this.servicioRepository = servicioRepository;
        this.mascotaRepository = mascotaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public List<Reserva> obtenerTodas() {
        return reservaRepository.findAll();
    }

    @Override
    public Optional<Reserva> obtenerPorId(Long id) {
        return reservaRepository.findById(id);
    }

    @Override
    public List<Reserva> obtenerPorUsuario(Long idUsuario) {
        List<Mascota> mascotas = mascotaRepository.findByUsuarioIdUsuario(idUsuario);
        if (mascotas.isEmpty()) {
            return new ArrayList<>();
        }
        List<Reserva> todasReservas = new ArrayList<>();
        for (Mascota mascota : mascotas) {
            List<Reserva> reservasMascota = reservaRepository.findByMascotaIdMascota(mascota.getIdMascota());
            todasReservas.addAll(reservasMascota);
        }
        return todasReservas;
    }

    @Override
    public List<Reserva> obtenerPorFecha(LocalDate fecha) {
        return reservaRepository.findByFecha(fecha);
    }

    @Override
    public List<Reserva> obtenerPorMascota(Long idMascota) {
        return reservaRepository.findByMascotaIdMascota(idMascota);
    }

    @Override
    public List<Reserva> obtenerPorGroomer(Long idGroomer) {
        return reservaRepository.findByGroomerIdGroomer(idGroomer);
    }

    @Override
    public Reserva guardarReserva(Long usuarioId, Reserva reserva) {
        Mascota mascota = mascotaRepository.findById(reserva.getMascota().getIdMascota())
                .orElseThrow(() -> new RuntimeException("Mascota no encontrada"));

        if (!mascota.getUsuario().getIdUsuario().equals(usuarioId)) {
            throw new RuntimeException("La mascota no pertenece al usuario");
        }
        if(!verificarDisponibilidad(
                reserva.getFecha(),
                reserva.getHoraInicio(),
                reserva.getHoraFinal(),
                reserva.getGroomer().getIdGroomer())){
            throw new RuntimeException("El groomer no tiene disponibilidad en la hora seleccionada");
        }

        return reservaRepository.save(reserva);
    }

    @Override
    public Reserva actualizarReserva(Long id, Reserva reservaActualizada) {
        Reserva reservaExistente = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con id: " + id));

        if (!reservaExistente.getFecha().equals(reservaActualizada.getFecha()) ||
                !reservaExistente.getHoraInicio().equals(reservaActualizada.getHoraInicio()) ||
                !reservaExistente.getGroomer().getIdGroomer().equals(reservaActualizada.getGroomer().getIdGroomer())) {

            if (!verificarDisponibilidad(reservaActualizada.getFecha(), reservaActualizada.getHoraInicio(),
                    reservaActualizada.getHoraFinal(), reservaActualizada.getGroomer().getIdGroomer())) {
                throw new RuntimeException("El groomer no está disponible en ese horario");
            }
        }

        reservaExistente.setFecha(reservaActualizada.getFecha());
        reservaExistente.setHoraInicio(reservaActualizada.getHoraInicio());
        reservaExistente.setHoraFinal(reservaActualizada.getHoraFinal());
        reservaExistente.setGroomer(reservaActualizada.getGroomer());
        reservaExistente.setServicio(reservaActualizada.getServicio());
        reservaExistente.setMascota(reservaActualizada.getMascota());

        return reservaRepository.save(reservaExistente);
    }

    @Override
    public void eliminarReserva(Long id) {
        reservaRepository.deleteById(id);
    }

    @Override
    public Reserva asignarGroomer(Long idReserva, Long idGroomer) {
        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        Groomer groomer = groomerRepository.findById(idGroomer)
                .orElseThrow(() -> new RuntimeException("Groomer no encontrado"));

        if (!verificarDisponibilidad(reserva.getFecha(), reserva.getHoraInicio(),
                reserva.getHoraFinal(), idGroomer)) {
            throw new RuntimeException("El groomer no está disponible en ese horario");
        }

        reserva.setGroomer(groomer);
        return reservaRepository.save(reserva);
    }

    @Override
    public Reserva asignarServicio(Long idReserva, Long idServicio) {
        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        Servicio servicio = servicioRepository.findById(idServicio)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        reserva.setServicio(servicio);
        return reservaRepository.save(reserva);
    }

    @Override
    public Reserva asignarMascota(Long idReserva, Long idMascota) {
        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        Mascota mascota = mascotaRepository.findById(idMascota)
                .orElseThrow(() -> new RuntimeException("Mascota no encontrada"));

        reserva.setMascota(mascota);
        return reservaRepository.save(reserva);
    }

    @Override
    public boolean verificarDisponibilidad(LocalDate fecha, LocalTime horaInicio,
                                           LocalTime horaFinal, Long idGroomer) {

        List<Reserva> reservasExistentes = reservaRepository
                .findByFechaAndGroomerIdGroomer(fecha, idGroomer);

        for (Reserva reserva : reservasExistentes) {
            LocalTime inicioExistente = reserva.getHoraInicio();
            LocalTime finalExistente = reserva.getHoraFinal();

            boolean haySolapamiento =
                    (horaInicio.isBefore(finalExistente) && horaFinal.isAfter(inicioExistente));

            if (haySolapamiento) {
                return false;
            }
        }

        return true;
    }

}