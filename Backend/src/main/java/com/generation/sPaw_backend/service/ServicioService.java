package com.generation.sPaw_backend.service;

import com.generation.sPaw_backend.model.Servicio;
import com.generation.sPaw_backend.repository.IServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServicioService implements IServicioService {

    private final IServicioRepository servicioRepository;

    @Autowired
    public ServicioService(IServicioRepository servicioRepository) {
        this.servicioRepository = servicioRepository;
    }

    @Override
    public List<Servicio> obtenerTodos() {
        return servicioRepository.findAll();
    }

    @Override
    public Optional<Servicio> obtenerPorId(Long id) {
        return servicioRepository.findById(id);
    }

    @Override
    public Servicio guardarServico(Servicio servicio) {
        return servicioRepository.save(servicio);
    }

    @Override
    public Servicio actualizarServicio(Long id, Servicio servicioActualizado) {
        Servicio servicioBuscado = servicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        servicioBuscado.setNombre(servicioActualizado.getNombre());
        servicioBuscado.setDescripcion(servicioActualizado.getDescripcion());
        servicioBuscado.setPrecioTamPequeno(servicioActualizado.getPrecioTamPequeno());
        servicioBuscado.setPrecioTamMediano(servicioActualizado.getPrecioTamMediano());
        servicioBuscado.setPrecioTamGrande(servicioActualizado.getPrecioTamGrande());

        // Solo actualiza la imagen si viene una nueva URL
        if (servicioActualizado.getImagen() != null && !servicioActualizado.getImagen().isEmpty()) {
            servicioBuscado.setImagen(servicioActualizado.getImagen());
        }

        return servicioRepository.save(servicioBuscado);
    }

    @Override
    public void eliminarServicio(Long id) {
        servicioRepository.deleteById(id);
    }
}