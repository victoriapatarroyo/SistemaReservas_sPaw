package com.generation.sPaw_backend.service;

import com.generation.sPaw_backend.model.Groomer;

import java.util.List;
import java.util.Optional;

public interface IGroomerService {
    List<Groomer> listar();
    Optional<Groomer> buscarPorId(Long id);
    Groomer guardar(Groomer groomer);
    Groomer actualizarGroomer(Long id, Groomer groomerActualizado);
    void eliminar(Long id);
}
