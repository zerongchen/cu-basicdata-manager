package com.aotain.datamanagerweb.controller.demo;

import com.aotain.datamanagerweb.annotation.RequiresPermission;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

@Controller
public class DemoController {




	@RequestMapping(value ="/select2")
    public ModelAndView index() {
		ModelAndView mav = new ModelAndView("/demo/select");
        return mav;
    }

    @RequestMapping(value ="/hours/room")
    public ModelAndView room() {
        ModelAndView mav = new ModelAndView("/hoursmag/room/index");
        return mav;
    }

    @RequestMapping(value ="/demo/icom")
    public ModelAndView icom() {
        ModelAndView mav = new ModelAndView("/demo/icom");
        return mav;
    }

}
