/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.controller;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
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
public class RestApiController {

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
        if (key.getIsBlocked()) {
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
        if (!key.getIsBlocked()) {
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
    public ApiKey editKey(@PathVariable(name = "id") ApiKey key, @RequestBody NewApiKeyData data) {
        if (data.getName() != null) {
            key.rename(data.getName());
        }

        if (data.isBlocked() != null) {
            boolean v = data.isBlocked();
            if (key.getIsBlocked() ^ v) {
                key.toggleBlock();
            }
        }
        return key;
    }

    /**
     * Завести нового юзера
     *
     * @param au
     * @param data
     * @return
     */
    @RequestMapping(path = "/user", method = {RequestMethod.POST, RequestMethod.PUT},
            produces = "application/json")
    @ResponseBody
    @Transactional
    public User newUser(Authentication au, @RequestBody RegistrationData data) {
        User svsr = ((SecurityUser) au.getPrincipal()).getUser();

        User u = registerUser(svsr.company, data);
        users.save(u);

        return u;
    }

    @RequestMapping(path = "/user/{id}", method = {RequestMethod.POST, RequestMethod.PUT},
            produces = "application/json")
    @ResponseBody
    @Transactional
    public User editUser(Authentication au, @RequestBody RegistrationData data, @PathVariable("id") User u) {

        data.checkPassword(); // exception
        if (data.getPassword() != null) {
            u.changePassword(encoder.encode(data.getPassword()));
        }
        if (data.getEmail() != null) {
            u.changeEmail(data.getEmail());
        }
        if (data.getName() != null) {
            u.rename(data.getName());
        }
        if (data.isLocked() != null) {
            boolean v = data.isLocked();
            if (u.isLocked() ^ v) {
                u.toggleLock();
            }
        }

        return u;
    }

    @RequestMapping(path = "/user/{id}/lock", method = {RequestMethod.POST, RequestMethod.PUT},
            produces = "application/json")
    @ResponseBody
    @Transactional
    public User lockUser(@PathVariable("id") User user) {
        if (!user.isLocked()) {
            user.toggleLock();
        }
        return user;
    }

    @RequestMapping(path = "/user/{id}/unlock", method = {RequestMethod.POST, RequestMethod.PUT},
            produces = "application/json")
    @ResponseBody
    @Transactional
    public User unlockUser(@PathVariable("id") User user) {
        if (user.isLocked()) {
            user.toggleLock();
        }
        return user;
    }

    private User registerUser(Company c, RegistrationData data) {
        data.checkPassword();
        if (users.findByEmail(data.getEmail()) != null) {
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

        private Boolean blocked;

        public Boolean isBlocked() {
            return blocked;
        }

        public void setBlocked(Boolean blocked) {
            this.blocked = blocked;
        }

    }
}
