package com.aotain.datamanagerweb.dic;

import com.aotain.datamanagerweb.dto.dic.AreaModelDTO;
import com.aotain.datamanagerweb.mapper.dic.DictionaryMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.xml.XmlBeanFactory;
import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.test.context.junit4.SpringRunner;

//@RunWith(SpringRunner.class)
@SpringBootTest
public class dicTestDemo {

    @Autowired
    private DictionaryMapper dictionaryMapper;



    @Test
    public void test(){

        AreaModelDTO dto = dictionaryMapper.getAreaData();



    }
}


