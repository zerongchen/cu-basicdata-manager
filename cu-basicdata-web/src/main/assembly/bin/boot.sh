#!/bin/sh

PRG_NAME=cu-basicdata-web
WORK_DIR=$(cd `dirname $0`; pwd)/../
LOG_DIR="$WORK_DIR"/logs
PID_FILE=${LOG_DIR}/${PRG_NAME}.pid

#优先从环境变量目录中取配置文件
APP_CFG_FILE=$CU_HOME/${PRG_NAME}/application.properties
APP_LOG_CFG_FILE=$CU_HOME/${PRG_NAME}/logback-spring.xml

if [ ! -f "$APP_CFG_FILE" ];then
	APP_CFG_FILE=${WORK_DIR}config/application.properties
fi

if [ ! -f "$APP_LOG_CFG_FILE" ];then
	APP_LOG_CFG_FILE=${WORK_DIR}config/logback-spring.xml
fi

JAVA=java
JAVA_OPTS="-Djava.io.tmpdir=$WORK_DIR/tmp -Xms5120m -Xmx10240m -XX:+UseParNewGC -XX:+UseConcMarkSweepGC -XX:-CMSConcurrentMTEnabled -XX:CMSInitiatingOccupancyFraction=70 -XX:+CMSParallelRemarkEnabled -Dwork.dir=${WORK_DIR}"
CLASS_PATH=" -classpath "$(echo ${WORK_DIR}lib/*.jar|sed 's/ /:/g')
CLASS=com.aotain.datamanagerweb.DataManagerWebApplication
CONFIG_PATH=" --spring.config.location=$APP_CFG_FILE --logging.config=$APP_LOG_CFG_FILE"

if [ ! -d "${LOG_DIR}" ]; then
  mkdir -p ${LOG_DIR}
fi

if [ ! -d "$WORK_DIR/tmp" ]; then
  mkdir -p $WORK_DIR/tmp
fi

cd $WORK_DIR

case "$1" in

  start)
  	echo "application.properties file is come from $APP_CFG_FILE"
	echo "logback-spring.xml file is come from $APP_LOG_CFG_FILE"
  
  	if [ -f "${PID_FILE}" ]; then
    	echo "${PRG_NAME} is running,pid=`cat ${PID_FILE}`."
    else
    	exec "$JAVA" $JAVA_OPTS $CLASS_PATH $CLASS $CONFIG_PATH >> ${LOG_DIR}/${PRG_NAME}.log 2>&1 &
		echo "${PRG_NAME} is running,pid=$!."
    	echo $! > ${PID_FILE}
        echo "${PRG_NAME} start----> "`date  '+%Y-%m-%d %H:%M:%S'` >>${LOG_DIR}/${PRG_NAME}.out
    fi
    ;;

  stop)
  	if [ -f "${PID_FILE}" ]; then
    	kill -15 `cat ${PID_FILE}`
    	for i in {1..10}
    	do
	    	ps -p `cat ${PID_FILE}` > /dev/null
	        if [ $? -eq 0 ]; then
	            echo -ne "\rtring to stop process ${i}s ..." 
	            sleep 1;
	        else 
	        	echo -ne "\n"
	        	break
	        fi
	    done
	    ps -p `cat ${PID_FILE}` > /dev/null
	    if [ $? -eq 0 ]; then
	    	echo -ne "\rtring to kill process ..." 
	    	kill -9 ${PID_FILE}
		fi
		rm -rf ${PID_FILE}	        
    	echo "${PRG_NAME} is stopped."
	echo "${PRG_NAME} end----> "`date  '+%Y-%m-%d %H:%M:%S'` >>${LOG_DIR}/${PRG_NAME}.out
    else
    	echo "${PRG_NAME} is not running."
    fi
    ;;

  restart)
    bin/$0 stop
    sleep 1
    bin/$0 start
    ;;

  status)
  	if [ -f "${PID_FILE}" ]; then
    	echo "${PRG_NAME} is running,pid=`cat ${PID_FILE}`."
    else
    	echo "${PRG_NAME} is not running."
    fi
    ;;

  *)
    echo "Usage: ${PRG_NAME}.sh {start|stop|restart|status}"
    ;;

esac

exit 0
