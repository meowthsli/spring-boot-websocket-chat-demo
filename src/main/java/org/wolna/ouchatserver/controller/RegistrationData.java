/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.controller;

import org.wolna.ouchatserver.model.InvalidOperationException;

/**
 *
 * @author yurij
 */
public class RegistrationData {

    private String name;

    public void setName(String name) {
        this.name = name;
    }
    public String getName() {
        return this.name;
    }
    
        private String email;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
        private String password;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

        private String confirmPassword;

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    public void checkPassword() {
        if(!getPassword().equals(getConfirmPassword())) {
            throw new InvalidOperationException("Passwords don't match");
        }
    }
    
}
