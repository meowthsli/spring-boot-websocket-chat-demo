/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 *
 * @author yurij
 */
@Entity
@Table(name = "`User`")
public class User {
    
    public User(Company c) {
        if(!c.users.contains(this)) {
            c.users.add(this);
        }
        this.company = c;
    }
    public String email;
    public String encodedPassword;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Long id;
    public boolean isSupervisor;
    @ManyToOne
    public Company company;

    public Long getId() {
        return id;
    }

    protected void setId(Long id) {
        this.id = id;
    }

    protected void setCompany(Company c) {
        this.company = c;
    }
}
