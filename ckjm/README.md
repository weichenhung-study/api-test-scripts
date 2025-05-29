步驟
1. 至 要進行分析物件導向設定指標分析的 專案內執行以下指令<br>
	- mvn clean package<br>
	- mvn dependency:copy-dependencies -DoutputDirectory=lib<br>

2. 執行 scanClassLocation-then-runCkjm.bat 輸入專案名稱，將得到class的程式清單

分析清單
1.	jersey-monolith
2.	jersey-modular-monolith
3.	jersey-microservice-jdbc\jersey-microservice-jdbc-billofmonth
4.	jersey-microservice-jdbc\jersey-microservice-jdbc-billrecord
5.	jersey-microservice-jdbc\jersey-microservice-jdbc-cuscredit
6.	jersey-microservice\jersey-microservice-billing
7.	jersey-microservice\jersey-microservice-dispute
8.	jersey-microservice\jersey-microservice-management
9.	jersey-microservice\jersey-microservice-transactions
10.	jersey-microservice-loadbalancer\jersey-microservice-loadbalancer-billing
11.	jersey-microservice-loadbalancer\jersey-microservice-loadbalancer-dispute
12.	jersey-microservice-loadbalancer\jersey-microservice-loadbalancer-management
13.	jersey-microservice-loadbalancer\jersey-microservice-loadbalancer-transactions
14. jersey-microservice-gateway

15. springboot-modular-monolith
16.	springboot-microservice-jpa\springboot-microservice-jpa-billofmonth
17.	springboot-microservice-jpa\springboot-microservice-jpa-billrecord
18.	springboot-microservice-jpa\springboot-microservice-jpa-cuscredit
19.	springboot-microservice\springboot-microservice-billing
20.	springboot-microservice\springboot-microservice-dispute
21.	springboot-microservice\springboot-microservice-management
22.	springboot-microservice\springboot-microservice-transactions
23.	springboot-microservice-loadbalancer\springboot-microservice-loadbalancer-billing
24.	springboot-microservice-loadbalancer\springboot-microservice-loadbalancer-transactions
25.	springboot-microservice-loadbalancer\springboot-microservice-loadbalancer-dispute
26.	springboot-microservice-loadbalancer\springboot-microservice-loadbalancer-management
27. springboot-microservice-gateway