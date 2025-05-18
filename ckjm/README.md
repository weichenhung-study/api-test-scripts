1. 至專案執行 mvn claen package
2. 執行 scanClassLocation.bat 輸入專案名稱，將得到class的程式清單
3. 執行 run_ckjm.bat 輸入專案名稱，將依照清單逐一執行

備註：
單獨指令如下
java -jar ckjm-1.0-SNAPSHOT.jar D:\Project\ckjm\target\WEB-INF\classes\com\ntou\db\ConnControl.class > metrics.txt