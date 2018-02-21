/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.wolna.ouchatserver.model.ApiKey;
import org.wolna.ouchatserver.model.Company;
import org.wolna.ouchatserver.model.CompanyRepository;
import org.wolna.ouchatserver.model.InvalidOperationException;
import org.wolna.ouchatserver.model.User;
import org.wolna.ouchatserver.model.UserRepository;
import org.wolna.ouchatserver.security.UserDetailsServiceImpl.SecurityUser;

/**
 *
 * @author yurij
 */
@RestController
@RequestMapping("/api")
@Secured("ROLE_SUPERVISOR")
public class Data {

    @Autowired
    CompanyRepository companies;

    @Autowired
    UserRepository users;
    
    @Autowired
    BCryptPasswordEncoder encoder;

    @RequestMapping(path = "/companies", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    @Transactional
    // TODO: secure
    public List<Company> companies() {
        ArrayList<Company> cc = new ArrayList<>();
        for (Company c : companies.findAll()) {
            cc.add(c);
        }
        return cc;
    }

    @RequestMapping(path = "/organization", method = {RequestMethod.GET}, produces = "application/json")
    @ResponseBody
    @Transactional
    @Secured("ROLE_SUPERVISOR")
    public Company organization(Authentication au) {
        User cu = ((SecurityUser) au.getPrincipal()).getUser();
        return cu.company;
    }

    @RequestMapping(path = "/key",
            method = {RequestMethod.POST, RequestMethod.PUT},
            produces = "application/json")
    @ResponseBody
    @Transactional
    @Secured("ROLE_SUPERVISOR")
    public ApiKey newApiKey(Authentication au, @RequestBody NewApiKeyData data) {
        User cu = ((SecurityUser) au.getPrincipal()).getUser();
        return cu.company.generateKey(data.name);
    }
    
    @RequestMapping(path = "/key/{id}/unlock",
            method = {RequestMethod.POST, RequestMethod.PUT},
            produces = "application/json")
    @ResponseBody
    @Transactional
    @Secured("ROLE_SUPERVISOR")
    // TODO: работать только со своими ключами
    public ApiKey unlockKey(Authentication au, @PathVariable(name = "id") ApiKey key) {
        if(key.getIsBlocked()) {
            key.toggleBlock();
        }
        return key;
    }
    
    @RequestMapping(path = "/key/{id}/lock",
            method = {RequestMethod.POST, RequestMethod.PUT},
            produces = "application/json")
    @ResponseBody
    @Transactional
    @Secured("ROLE_SUPERVISOR")
    // TODO: работать только со своими ключами
    public ApiKey lockKey(Authentication au, @PathVariable(name = "id") ApiKey key) {
        if(!key.getIsBlocked()) {
            key.toggleBlock();
        }
        return key;
    }
    
    @RequestMapping(path = "/key/{id}",
            method = {RequestMethod.POST, RequestMethod.PUT},
            produces = "application/json")
    @ResponseBody
    @Transactional
    @Secured("ROLE_SUPERVISOR")
    // TODO: работать только со своими ключами
    public ApiKey renameKey(@PathVariable(name = "id") ApiKey key, @RequestBody NewApiKeyData data) {
        key.rename(data.getName());
        return key;
    }

    @RequestMapping(path = "/user", method = {RequestMethod.POST, RequestMethod.PUT}, 
            produces = "application/json")
    @ResponseBody
    @Transactional
    public Object newUser(Authentication au, @RequestBody RegistrationData data) {
        User svsr = ((SecurityUser) au.getPrincipal()).getUser();
           
        User u = registerUser(svsr.company, data);
        users.save(u);
        
        return Collections.EMPTY_MAP;
    }
    
    @RequestMapping(path = "/user/{id}/lock", method = {RequestMethod.POST, RequestMethod.PUT}, 
            produces = "application/json")
    @ResponseBody
    @Transactional
    public User lockUser(@PathVariable("id") User user) {
        if(!user.isLocked()) {
            user.toggleLock();
        }
        return user;
    }
    
    @RequestMapping(path = "/user/{id}/unlock", method = {RequestMethod.POST, RequestMethod.PUT}, 
            produces = "application/json")
    @ResponseBody
    @Transactional
    public User unlockUser(@PathVariable("id") User user) {
        if(user.isLocked()) {
            user.toggleLock();
        }
        return user;
    }

    private User registerUser(Company c, RegistrationData data) {
        if(!data.getPassword().equals(data.getConfirmPassword())) {
            throw new InvalidOperationException("Passwords don't match");
        }
        if(users.findByEmail(data.getEmail()) != null) {
            throw new InvalidOperationException("User already exists");
        }
        User u = User.makeNormal(c, data.getEmail(), data.getName(), encoder.encode(data.getPassword())); 
        return u;
    }

    public static class NewApiKeyData {

        private String name;

        public void setName(String name) {
            this.name = name;
        }

        public String getName() {
            return this.name;
        }
    }
}
