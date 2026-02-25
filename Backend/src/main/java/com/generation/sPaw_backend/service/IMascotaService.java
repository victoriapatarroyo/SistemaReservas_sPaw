package com.generation.sPaw_backend.service;

import com.generation.sPaw_backend.model.Mascota;
import java.util.List;
import java.util.Optional;

public interface IMascotaService {
    List<Mascota> obtenerTodas();
    Optional<Mascota> obtenerPorId(Long id);
    Mascota guardarMascota(Mascota mascota);
    void eliminarMascota(Long id);
    List<Mascota> obtenerPorUsuario(Long idUsuario);
    Mascota actualizarMascota(Long idMascota, Mascota mascotaActualizada);
    Mascota asignarUsuario(Long idMascota, Long idUsuario);
}