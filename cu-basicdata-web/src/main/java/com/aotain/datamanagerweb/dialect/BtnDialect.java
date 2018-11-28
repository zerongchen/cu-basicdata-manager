package com.aotain.datamanagerweb.dialect;

import org.springframework.stereotype.Component;
import org.thymeleaf.dialect.AbstractProcessorDialect;
import org.thymeleaf.processor.IProcessor;

import java.util.HashSet;
import java.util.Set;

@Component
public class BtnDialect extends AbstractProcessorDialect {

    private static final String DIALECT_NAME = "commonBtn";
    private static final String PREFIX = "th";
    public static final int PROCESSOR_PRECEDENCE = 1000;



    protected BtnDialect() {
        super(DIALECT_NAME, PREFIX, PROCESSOR_PRECEDENCE);
    }

    @Override
    public Set<IProcessor> getProcessors( String s ) {
        final Set<IProcessor> processors = new HashSet<>();
        processors.add(new BtnElementProcessor(s));
        return processors;
    }
}
