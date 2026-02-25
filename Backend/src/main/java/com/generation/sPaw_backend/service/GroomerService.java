package com.generation.sPaw_backend.service;

import com.generation.sPaw_backend.model.Groomer;
import com.generation.sPaw_backend.repository.IGroomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GroomerService implements IGroomerService {

    private final IGroomerRepository groomerRepository;

    public GroomerService(IGroomerRepository groomerRepository) {
        this.groomerRepository = groomerRepository;
    }

    @Override
    public List<Groomer> listar() {
        return groomerRepository.findAll();
    }

    @Override
    public Optional<Groomer> buscarPorId(Long id) {
        return groomerRepository.findById(id);
    }

    @Override
    public Groomer guardar(Groomer groomer) {
        return groomerRepository.save(groomer);

    }

    @Override
    public Groomer actualizarGroomer(Long id, Groomer groomerActualizado) {
        Groomer groomerBuscado = groomerRepository.findById(id).orElseThrow(() -> new RuntimeException("Gromer no encontrado"));

        groomerBuscado.setNombre(groomerActualizado.getNombre());
        groomerBuscado.setApellido(groomerActualizado.getApellido());
        groomerBuscado.setTelefono(groomerActualizado.getTelefono());
        groomerBuscado.setEmail(groomerActualizado.getEmail());

        return groomerRepository.save(groomerBuscado);
    }

    public void eliminar(Long id) {
        groomerRepository.deleteById(id);
    }

}