package com.aotain.datamanagerweb.utils.thread;

import com.aotain.cu.serviceapi.dto.HouseFrameInformationDTO;
import com.aotain.cu.serviceapi.dto.HouseIPSegmentInforDTO;
import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.datamanagerweb.constant.ImportConstant;
import com.aotain.datamanagerweb.serviceapi.PreHouseIPSegmentApi;
import com.aotain.datamanagerweb.serviceapi.PreHouseInfoApi;
import com.aotain.datamanagerweb.serviceapi.PreHouseLinkApi;
import com.aotain.datamanagerweb.serviceapi.PreHouseRackApi;
import com.aotain.datamanagerweb.utils.SpringUtil;

import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.FutureTask;

/**
 * Demo class
 *
 * @author bang
 * @date 2018/10/25
 */
public class HouseBatchInsertThread {

    public static ExecutorService executor = Executors.newFixedThreadPool(ImportConstant.THREAD_NUM);

    static PreHouseRackApi houseRackApi = getHouseRackApi();
    static PreHouseIPSegmentApi preHouseIPSegmentApi = getHouseIpSegApi();

    private static PreHouseInfoApi getHouseInfoApi(){
        return SpringUtil.getBean(PreHouseInfoApi.class);
    }

    private static PreHouseRackApi getHouseRackApi(){
        return SpringUtil.getBean(PreHouseRackApi.class);
    }

    private static PreHouseLinkApi getHouseLinkApi(){
        return SpringUtil.getBean(PreHouseLinkApi.class);
    }

    private static PreHouseIPSegmentApi getHouseIpSegApi(){
        return SpringUtil.getBean(PreHouseIPSegmentApi.class);
    }


    static class BatchInsertRackCallable implements Callable<List<ResultDto>>{
        private List<HouseFrameInformationDTO> houseFrameInformationDTOList;

        public BatchInsertRackCallable(List<HouseFrameInformationDTO> houseFrameInformationDTOList){
            super();
            this.houseFrameInformationDTOList = houseFrameInformationDTOList;
        }

        @Override
        public List<ResultDto> call() throws Exception {
            return houseRackApi.importHouseFrame(houseFrameInformationDTOList);
        }
    }

    static class BatchInsertIpCallable implements Callable<List<ResultDto>>{

        private List<HouseIPSegmentInforDTO> houseIPSegmentInforDTOList;

        public BatchInsertIpCallable(List<HouseIPSegmentInforDTO> houseIPSegmentInforDTOList){
            super();
            this.houseIPSegmentInforDTOList = houseIPSegmentInforDTOList;
        }

        @Override
        public List<ResultDto> call() throws Exception {
            return preHouseIPSegmentApi.importHouseIpSeg(houseIPSegmentInforDTOList);
        }

    }

    static FutureTask<List<ResultDto>> importHouseFrame(List<HouseFrameInformationDTO> houseFrameInformationDTOList){
        BatchInsertRackCallable batchInsertRackCallable = new BatchInsertRackCallable(houseFrameInformationDTOList);
        FutureTask<List<ResultDto>> futureTask = new FutureTask<>(batchInsertRackCallable);
        executor.submit(futureTask);
        return futureTask;
    }

    static FutureTask<List<ResultDto>> importHouseIp(List<HouseIPSegmentInforDTO> houseIPSegmentInforDTOS){
        BatchInsertIpCallable batchInsertIpCallable = new BatchInsertIpCallable(houseIPSegmentInforDTOS);
        FutureTask<List<ResultDto>> futureTask = new FutureTask<List<ResultDto>>(batchInsertIpCallable);
        executor.submit(futureTask);
        return futureTask;
    }

}
