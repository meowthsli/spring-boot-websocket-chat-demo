/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.model;

import java.util.HashSet;
import java.util.Set;
import javax.annotation.Generated;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

/**
 *
 * @author yurij
 */
@Entity
public class Company {
    public Company(String name) {
        this.name = name;
    }
    
    public Long getId() {
        return this.id;
    }
    
    protected void setId(Long id) {
        this.id = id;
    }
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    protected Long id;

    public String getName() {
        return name;
    }

    protected void setName(String name) {
        this.name = name;
    }
    protected String name;
    
    public Set<AccessToken> getTokens() {
        return new HashSet<>(this.tokens);
    }
    
    public Set<User> getUsers() {
        return new HashSet<>(this.users);
    }

    @OneToMany(mappedBy = "company", cascade = {CascadeType.PERSIST, CascadeType.DETACH})
    Set<User> users = new HashSet<>();
    
    @OneToMany(mappedBy = "company", cascade = {CascadeType.ALL})
    Set<AccessToken> tokens = new HashSet<>();
    
    protected Company() {}
}
