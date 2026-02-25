package com.generation.sPaw_backend.dto;

public class UsuarioDto {
    private String email;
    private String passwordUsuario;

    public UsuarioDto() {
    }

    public UsuarioDto(String email, String passwordUsuario) {
        this.email = email;
        this.passwordUsuario = passwordUsuario;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordUsuario() {
        return passwordUsuario;
    }

    public void setPasswordUsuario(String passwordUsuario) {
        this.passwordUsuario = passwordUsuario;
    }
}
