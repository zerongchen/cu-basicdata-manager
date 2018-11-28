package com.aotain.datamanagerweb.utils.thread;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ThreadContext  {

    private static Map<Thread,Map<String,String>> dataMap = new ConcurrentHashMap<>();

    public Map<String,String> getThreadLocalMap(Thread thread){
        if (dataMap!=null){
            Map<String,String> threadMap = dataMap.get(thread);
            if (threadMap!=null){
                return threadMap;
            }else {
                return new ConcurrentHashMap<>();
            }
        }else {
            dataMap=new ConcurrentHashMap<>();
            return getThreadLocalMap(thread);
        }
    }

    public void set(String key,String value){
        Thread thread = Thread.currentThread();
        Map<String,String>  map = getThreadLocalMap(thread);
        map.put(key,value);
        dataMap.put(thread,map);
    }

    public String get(Thread thread,String key){
      return getThreadLocalMap(thread).get(key);
    }

    public void remove(Thread thread){
        if (dataMap.get(thread)!=null)
            dataMap.remove(thread);
    }


}
