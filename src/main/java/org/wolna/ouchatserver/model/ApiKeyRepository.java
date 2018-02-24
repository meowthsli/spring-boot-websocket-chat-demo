/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wolna.ouchatserver.model;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author yurij
 */
public interface ApiKeyRepository extends CrudRepository<ApiKey, Long> {
    ApiKey findOneByVal(String value);
    
    @Query("select k.company.id from ApiKey k where k.val = :keyValue")
    Long findCompanyIdByKeyValue(@Param("keyValue") String keyValue);
}
