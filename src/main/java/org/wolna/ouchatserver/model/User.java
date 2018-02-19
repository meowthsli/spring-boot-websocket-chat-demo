/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 *
 * @author yurij
 */
@Entity
@Table(name = "`User`")
public class User {

    public static User makeSupervisor(Company c, String email, String encodedPass) {
        User u = new User(c, email, encodedPass);
        u.isSupervisor = true;
        return u;
    }
    
    public User(Company c, String email, String encodedPassword) {
        if(!c.users.contains(this)) {
            c.users.add(this);
        }
        this.company = c;
        this.email = email;
        this.encodedPassword = encodedPassword;
    }
    String email;

    public String getEmail() {
        return email;
    }

    public String getEncodedPassword() {
        return encodedPassword;
    }
    String encodedPassword;
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;
    boolean isSupervisor;
   
    boolean isVerified;
    boolean isLocked;
    
    @ManyToOne
    @JsonBackReference
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
    
    public boolean isLocked() {
        return this.isLocked;
    }
    
    public void toggleLock() {
        this.isLocked = !this.isLocked;
    }
    
    protected User() {}
}
