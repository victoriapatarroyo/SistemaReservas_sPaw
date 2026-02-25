package com.generation.sPaw_backend.service;

import com.generation.sPaw_backend.model.Mascota;
import com.generation.sPaw_backend.model.Usuario;
import com.generation.sPaw_backend.repository.IMascotaRepository;
import com.generation.sPaw_backend.repository.IUsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MascotaService implements IMascotaService {
    private final IMascotaRepository mascotaRepository;
    private final IUsuarioRepository usuarioRepository;

    public MascotaService(IMascotaRepository mascotaRepository, IUsuarioRepository usuarioRepository) {
        this.mascotaRepository = mascotaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public List<Mascota> obtenerTodas() {
        return mascotaRepository.findAll();
    }

    @Override
    public Optional<Mascota> obtenerPorId(Long id) {
        return mascotaRepository.findById(id);
    }

    @Override
    public Mascota guardarMascota(Mascota mascota) {
        return mascotaRepository.save(mascota);
    }

    @Override
    public void eliminarMascota(Long id) {
        mascotaRepository.deleteById(id);
    }

    @Override
    public List<Mascota> obtenerPorUsuario(Long idUsuario) {
        return mascotaRepository.findByUsuarioIdUsuario(idUsuario);
    }

    @Override
    public Mascota actualizarMascota(Long idMascota, Mascota mascotaActualizada) {
        Mascota mascotaBuscada = mascotaRepository.findById(idMascota)
                .orElseThrow(() -> new RuntimeException("Mascota no encontrada con el id: " + idMascota));

        mascotaBuscada.setNombreMascota(mascotaActualizada.getNombreMascota());
        return mascotaRepository.save(mascotaBuscada);
    }

    @Override
    public Mascota asignarUsuario(Long idMascota, Long idUsuario) {
        Mascota mascota = mascotaRepository.findById(idMascota).orElseThrow(() -> new RuntimeException("Mascota no encontrada"));
        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        mascota.setUsuario(usuario);
        return mascotaRepository.save(mascota);
    }
}