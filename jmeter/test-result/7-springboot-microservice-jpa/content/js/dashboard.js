/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "UpdateDisputedFlag - 爭議款項申請:上註記"], "isController": false}, {"data": [1.0, 500, 1500, "UpdateActivationRecord - 信用卡開卡 更新信用卡狀態"], "isController": false}, {"data": [1.0, 500, 1500, "FindCusBill - 本期信用卡帳單查詢"], "isController": false}, {"data": [1.0, 500, 1500, "InsertBill - 產生各消費者的月結帳單"], "isController": false}, {"data": [1.0, 500, 1500, "GetCardHolder - 查詢卡片持有者資料"], "isController": false}, {"data": [1.0, 500, 1500, "FindCusBill - 查詢該月帳單的所有客戶資料"], "isController": false}, {"data": [1.0, 500, 1500, "UpdatePayDate - 繳交信用卡費"], "isController": false}, {"data": [1.0, 500, 1500, "GetActivatedCardHolder - 查詢有效卡片持有者資料"], "isController": false}, {"data": [1.0, 500, 1500, "UpdateCardApprovalStatus - 審核信用卡 更新信用卡狀態"], "isController": false}, {"data": [1.0, 500, 1500, "FindCusBillAll - 查詢該月帳單的\"特定\"客戶資料"], "isController": false}, {"data": [1.0, 500, 1500, "InsertCusDateBill - 客戶使用信用卡消費計入消費紀錄"], "isController": false}, {"data": [1.0, 500, 1500, "CreateCuscredit - 新增客戶信用卡資訊"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3600, 0, 0.0, 27.996666666666638, 7, 349, 25.0, 40.0, 57.0, 96.98999999999978, 19.878629920651136, 1845.9656820992939, 8.672634684620014], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["UpdateDisputedFlag - 爭議款項申請:上註記", 300, 0, 0.0, 10.18333333333333, 7, 55, 9.0, 12.0, 13.0, 46.99000000000001, 2.387622564624984, 0.6085639544600789, 0.7507953767668407], "isController": false}, {"data": ["UpdateActivationRecord - 信用卡開卡 更新信用卡狀態", 300, 0, 0.0, 38.620000000000005, 34, 65, 37.0, 45.0, 48.0, 60.98000000000002, 2.386672818978822, 0.6176448213177617, 0.745835255930882], "isController": false}, {"data": ["FindCusBill - 本期信用卡帳單查詢", 300, 0, 0.0, 21.586666666666666, 19, 28, 22.0, 23.0, 23.0, 24.0, 2.3872805691276877, 2.4082625272547866, 0.6574346879824297], "isController": false}, {"data": ["InsertBill - 產生各消費者的月結帳單", 300, 0, 0.0, 25.723333333333336, 12, 33, 26.0, 28.0, 29.0, 32.98000000000002, 2.387299566307245, 0.6224697111367524, 1.9560003282536902], "isController": false}, {"data": ["GetCardHolder - 查詢卡片持有者資料", 300, 0, 0.0, 25.98666666666668, 24, 74, 26.0, 27.0, 28.0, 35.940000000000055, 2.3868437174295285, 2.279622222310624, 0.6200199500354049], "isController": false}, {"data": ["FindCusBill - 查詢該月帳單的所有客戶資料", 300, 0, 0.0, 23.046666666666653, 20, 28, 23.0, 24.0, 25.0, 26.0, 2.389276925159882, 1.5352970866750024, 0.557653501087121], "isController": false}, {"data": ["UpdatePayDate - 繳交信用卡費", 300, 0, 0.0, 14.273333333333339, 10, 73, 13.0, 17.0, 19.0, 56.76000000000022, 2.3873945567404102, 0.6224944791500876, 0.8486441588413178], "isController": false}, {"data": ["GetActivatedCardHolder - 查詢有效卡片持有者資料", 300, 0, 0.0, 25.906666666666673, 10, 35, 26.0, 28.0, 28.0, 32.99000000000001, 2.3868816981867655, 2.3006369493265018, 0.7389077132082077], "isController": false}, {"data": ["UpdateCardApprovalStatus - 審核信用卡 更新信用卡狀態", 300, 0, 0.0, 26.273333333333337, 12, 36, 26.0, 28.0, 28.0, 32.99000000000001, 2.3869766553683105, 0.6223855146321668, 1.1002470520838306], "isController": false}, {"data": ["FindCusBillAll - 查詢該月帳單的\"特定\"客戶資料", 300, 0, 0.0, 71.94666666666666, 50, 349, 58.0, 101.90000000000003, 138.0, 320.7500000000002, 2.3871286025749163, 2647.1880806193008, 0.7180035249932364], "isController": false}, {"data": ["InsertCusDateBill - 客戶使用信用卡消費計入消費紀錄", 300, 0, 0.0, 27.526666666666674, 24, 38, 27.0, 30.0, 31.0, 35.0, 2.3893530428411, 0.6393386071664662, 1.572679639526271], "isController": false}, {"data": ["CreateCuscredit - 新增客戶信用卡資訊", 300, 0, 0.0, 24.88666666666668, 20, 97, 24.0, 28.0, 30.0, 66.87000000000012, 2.386236189658052, 0.6338439878779202, 2.232435810246498], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3600, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
