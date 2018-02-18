/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.model;

/**
 *
 * @author yurij
 */
public class User {
    public String email;
    public String encodedPassword;
    public Long id;
    public boolean isSupervisor;
    public Company company;
}
