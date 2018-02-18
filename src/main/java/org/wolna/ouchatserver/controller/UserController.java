/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.wolna.ouchatserver.model.Company;
import org.wolna.ouchatserver.model.CompanyRepository;
import org.wolna.ouchatserver.model.User;
import org.wolna.ouchatserver.model.UserRepository;
import org.wolna.ouchatserver.security.Credentials;

/**
 *
 * @author yurij
 */
@RestController
@RequestMapping("/api")
public class UserController {
    
    @Autowired
    UserRepository userRepo;
    
    @Autowired
    CompanyRepository compRepo;
    
    @Autowired
    BCryptPasswordEncoder encoder;
    
    @PostMapping("/login")
    public void login(@RequestBody Credentials user) {
        //user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        //applicationUserRepository.save(user);
    }

    @PostMapping("/register") 
    public void registerCompany(@RequestBody CompanyRegistration data) {
        Company c = new Company();
        compRepo.save(c);
        
        User u = registerOpUser(c, data);
    }

    private User registerOpUser(Company c, CompanyRegistration data) {
        
        if(!data.getPassword().equals(data.getConfirmPassword())) {
            throw new RuntimeException("password doesnt match");
        }
        User u = new User();
        u.isSupervisor = true;
        u.email = data.getEmail();
        u.encodedPassword = encoder.encode(data.getPassword());
        u.company = c;
        userRepo.save(u);
        return u;
    }
}
