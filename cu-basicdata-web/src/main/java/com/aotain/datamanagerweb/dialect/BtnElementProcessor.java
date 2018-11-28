package com.aotain.datamanagerweb.dialect;

import org.thymeleaf.context.ITemplateContext;
import org.thymeleaf.context.WebEngineContext;
import org.thymeleaf.engine.AttributeName;
import org.thymeleaf.model.IModel;
import org.thymeleaf.model.IProcessableElementTag;
import org.thymeleaf.processor.element.AbstractAttributeTagProcessor;
import org.thymeleaf.processor.element.IElementTagStructureHandler;
import org.thymeleaf.templatemode.TemplateMode;
import sun.security.ssl.Debug;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * @since 20180511
 * @author chenzr
 */
public class BtnElementProcessor extends AbstractAttributeTagProcessor {

    private static final String ATTR_NAME = "btn";
    private static final String ELE_NAME = "div";
    private static final int PRECEDENCE = 10000;

    protected BtnElementProcessor( String dialectPrefix ) {
        super(TemplateMode.HTML, dialectPrefix, ELE_NAME, false, ATTR_NAME, true, PRECEDENCE, true);
    }

    @Override
    protected void doProcess( ITemplateContext iTemplateContext, IProcessableElementTag iProcessableElementTag, AttributeName attributeName, String s, IElementTagStructureHandler iElementTagStructureHandler ) {




        String def="<button type=\"button\" class=\"btn btn-outline btn-info  m-l-xs\"> <i class=\"fa fa-newspaper-o\" aria-hidden=\"true\"></i> 完整性核验</button>";
        System.out.println("");
        iElementTagStructureHandler.replaceWith(def,true);
        iElementTagStructureHandler.setAttribute("id",s);

    }
}
