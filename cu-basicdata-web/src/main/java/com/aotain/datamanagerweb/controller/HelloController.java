/*
package com.aotain.datamanagerweb.controller;

import com.aotain.datamanagerweb.mapper.DemoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;

*/
/**
 * Demo class
 *
 * @author daiyh
 * @date 2018/07/03
 *//*

@RestController
public class HelloController {

    @Autowired
    private DataSource dataSource;

    private final DemoMapper cityMapper;

    public HelloController(DemoMapper cityMapper) {
        this.cityMapper = cityMapper;
    }

    @RequestMapping("/hello")
    public String hello(){
        return "hello";
    }

    @RequestMapping("/dataSource")
    public String dataSource(){
        return dataSource.toString();
    }

    @RequestMapping("/app")
    public String getApp(){
        return cityMapper.findAllAppType().size()+"";
    }

    @RequestMapping("/demo")
    public String getDemo(){
        return cityMapper.oracleFind().size()+"";
    }

    @RequestMapping("/demo2")
    public String getDemo2(){
        return cityMapper.findList().toString();
    }
}
*/
