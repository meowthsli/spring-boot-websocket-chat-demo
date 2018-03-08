/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.wolna.ouchatserver.model.Company;
import org.wolna.ouchatserver.model.CompanyRepository;
import org.wolna.ouchatserver.model.Events;
import org.wolna.ouchatserver.model.InvalidOperationException;
import org.wolna.ouchatserver.model.User;
import org.wolna.ouchatserver.model.UserRepository;

/**
 *
 * @author yurij
 */
@RestController
@RequestMapping("/api")
public class EntryController {
    
    @Autowired
    UserRepository userRepo;
    
    @Autowired
    CompanyRepository compRepo;
    
    @Autowired
    BCryptPasswordEncoder encoder;
    
    @Autowired
    ApplicationEventPublisher publisher;

    @RequestMapping(path = "/register", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    @Transactional
    public Company registerCompany(@RequestBody RegistrationData data) {
        Company c = new Company(data.getName());    
        User u = registerOpUser(c, data);
        compRepo.save(c);
        publisher.publishEvent(new Events.NewCompany());
        return c;
    }

    private User registerOpUser(Company c, RegistrationData data) {
        if(!data.getPassword().equals(data.getConfirmPassword())) {
            throw new InvalidOperationException("Password doesn't match");
        }
        if(userRepo.findByEmail(data.getEmail()) != null) {
            throw new InvalidOperationException("User already exists");
        }
        User u = User.makeSupervisor(c, data.getEmail(), encoder.encode(data.getPassword())); 
        return u;
    }
}
