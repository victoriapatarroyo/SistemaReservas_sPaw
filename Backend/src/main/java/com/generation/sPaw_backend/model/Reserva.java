package com.generation.sPaw_backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "reserva")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idReserva")
    private Long idReserva;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "horaInicio", nullable = false)
    private LocalTime horaInicio;

    @Column(name = "horaFinal", nullable = false)
    private LocalTime horaFinal;

    @ManyToOne
    @JoinColumn(name = "idGroomer", nullable = false,
            foreignKey = @ForeignKey(name = "FK_RESERVA_GROOMER"))
    @JsonIgnoreProperties({"reservas", "hibernateLazyInitializer", "handler"})
    private Groomer groomer;


    @ManyToOne
    @JoinColumn(name = "idServicio", nullable = false,
            foreignKey = @ForeignKey(name = "FK_RESERVA_SERVICIO"))
    @JsonIgnoreProperties({"reservas", "hibernateLazyInitializer", "handler"})
    private Servicio servicio;

    @ManyToOne
    @JoinColumn(name = "idMascota", nullable = false,
            foreignKey = @ForeignKey(name = "FK_RESERVA_MASCOTA"))
    @JsonIgnoreProperties({"reservas", "hibernateLazyInitializer", "handler"})
    private Mascota mascota;

    public Reserva() {}

    public Reserva(LocalDate fecha, LocalTime horaInicio, LocalTime horaFinal,
                   Groomer groomer, Servicio servicio, Mascota mascota) {
        this.fecha = fecha;
        this.horaInicio = horaInicio;
        this.horaFinal = horaFinal;
        this.groomer = groomer;
        this.servicio = servicio;
        this.mascota = mascota;
    }

    public Long getIdReserva() {
        return idReserva;
    }

    public void setIdReserva(Long idReserva) {
        this.idReserva = idReserva;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFinal() {
        return horaFinal;
    }

    public void setHoraFinal(LocalTime horaFinal) {
        this.horaFinal = horaFinal;
    }

    public Groomer getGroomer() {
        return groomer;
    }

    public void setGroomer(Groomer groomer) {
        this.groomer = groomer;
    }

    public Servicio getServicio() {
        return servicio;
    }

    public void setServicio(Servicio servicio) {
        this.servicio = servicio;
    }

    public Mascota getMascota() {
        return mascota;
    }

    public void setMascota(Mascota mascota) {
        this.mascota = mascota;
    }
}