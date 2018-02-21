/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.model;

import org.springframework.data.repository.CrudRepository;

/**
 *
 * @author yurij
 */
public interface ApiKeyRepository extends CrudRepository<ApiKey, Long> {
    ApiKey findOneByValue(String value);
}