1. 修改 scanClassLocation.bat 中的CLASSROOT路徑，將得到class的程式清單
2. 執行 run_ckjm.bat，將依照清單逐一執行

備註：
單獨指令如下
java -jar ckjm-1.0-SNAPSHOT.jar D:\Project\ckjm\target\WEB-INF\classes\com\ntou\db\ConnControl.class > metrics.txt