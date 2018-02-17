/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.wolna.ouchatserver.security.Credentials;

/**
 *
 * @author yurij
 */
@RestController
@RequestMapping("/api")
public class UserController {
    
    @PostMapping("/login")
    public void login(@RequestBody Credentials user) {
        System.out.println(user.getEmail());
        //user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        //applicationUserRepository.save(user);
    }
    
}
