package com.generation.sPaw_backend.dto;

import com.generation.sPaw_backend.model.Usuario;

public class PerfilDto {
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    // Solo agregamos lo esencial


    public PerfilDto() {
    }


    public PerfilDto(Usuario usuario) {
        this.id = usuario.getIdUsuario();
        this.nombre = usuario.getNombre();
        this.apellido = usuario.getApellido();
        this.email = usuario.getEmail();
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}