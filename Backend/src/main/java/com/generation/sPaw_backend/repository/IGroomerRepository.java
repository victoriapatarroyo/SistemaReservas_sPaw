package com.generation.sPaw_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.generation.sPaw_backend.model.Groomer;

@Repository
public interface IGroomerRepository extends JpaRepository<Groomer, Long> {
}
