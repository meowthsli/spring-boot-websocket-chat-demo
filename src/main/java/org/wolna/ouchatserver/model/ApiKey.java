/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.UUID;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

/**
 *
 * @author yurij
 */
@Entity
public class ApiKey {

    public static ApiKey make(String name) {
        ApiKey t = new ApiKey();
        t.name = name;
        t.value = UUID.randomUUID().toString();
        return t;
    }
    
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;
    
    String value;
    boolean isBlocked;
    String name;
    
    @ManyToOne
    @JsonBackReference
    Company company;
    
    public Long getId() {
        return id;
    }
    
    public String getValue() {
        return value;
    }
    
    public boolean getIsBlocked() {
        return this.isBlocked;
    }
    
    public void toggleBlock() {
        this.isBlocked = !this.isBlocked;
    }
    
    public String getName() {
        return this.name;
    }
    
    protected ApiKey() {
        
    }

    public void rename(String name) {
        this.name = name;
    }
}
