/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.wolna.ouchatserver.model.ApiKey;
import org.wolna.ouchatserver.model.Company;
import org.wolna.ouchatserver.model.CompanyRepository;
import org.wolna.ouchatserver.model.User;
import org.wolna.ouchatserver.model.UserRepository;
import org.wolna.ouchatserver.security.UserDetailsServiceImpl.SecurityUser;

/**
 *
 * @author yurij
 */
@RestController
@RequestMapping("/api")
public class Data {
    @Autowired
    CompanyRepository companies;
    
    @Autowired
    UserRepository users;
    
    @RequestMapping(path = "/companies", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    @Transactional
    public List<Company> companies() {
        ArrayList<Company> cc = new ArrayList<>();
        for(Company c : companies.findAll()) {
            cc.add(c);
        }
        return cc;
    }
    
    @RequestMapping(path = "/key", method = {RequestMethod.POST, RequestMethod.PUT},
            produces = "application/json")
    @ResponseBody
    @Transactional
    public ApiKey makeToken(Authentication au) {
        User cu = ((SecurityUser)au.getPrincipal()).getUser();
        return cu.company.addToken();
    }
}
