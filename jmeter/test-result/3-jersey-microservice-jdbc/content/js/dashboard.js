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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3600, 0, 0.0, 29.601944444444417, 10, 182, 28.0, 36.0, 64.0, 87.98999999999978, 19.871058906650184, 1589.3855470129934, 8.606264282323588], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["UpdateDisputedFlag - 爭議款項申請:上註記", 300, 0, 0.0, 13.20333333333333, 10, 27, 13.0, 16.0, 18.0, 20.0, 2.386995647711269, 0.5967489119278173, 0.7436050894725535], "isController": false}, {"data": ["UpdateActivationRecord - 信用卡開卡 更新信用卡狀態", 300, 0, 0.0, 33.8233333333333, 29, 71, 33.0, 37.900000000000034, 41.0, 51.960000000000036, 2.3862551702195356, 0.6058851018135539, 0.7387137587496023], "isController": false}, {"data": ["FindCusBill - 本期信用卡帳單查詢", 300, 0, 0.0, 25.503333333333355, 21, 36, 25.0, 27.0, 28.0, 29.99000000000001, 2.3866918064870286, 2.3960148213561183, 0.6502802871190243], "isController": false}, {"data": ["InsertBill - 產生各消費者的月結帳單", 300, 0, 0.0, 28.066666666666674, 16, 35, 28.0, 30.0, 31.94999999999999, 33.0, 2.3866158582668393, 0.5780085281740003, 1.9484481030381622], "isController": false}, {"data": ["GetCardHolder - 查詢卡片持有者資料", 300, 0, 0.0, 29.166666666666668, 26, 39, 29.0, 32.0, 33.0, 36.99000000000001, 2.386426008861595, 2.2675708072483713, 0.6129199612603511], "isController": false}, {"data": ["FindCusBill - 查詢該月帳單的所有客戶資料", 300, 0, 0.0, 26.966666666666676, 14, 36, 27.0, 29.0, 29.0, 31.99000000000001, 2.387945650356998, 1.5227817477374215, 0.5503468491057143], "isController": false}, {"data": ["UpdatePayDate - 繳交信用卡費", 300, 0, 0.0, 15.656666666666679, 11, 38, 15.0, 19.900000000000034, 21.0, 31.960000000000036, 2.3866348448687353, 0.5780131264916467, 0.8343899164677804], "isController": false}, {"data": ["GetActivatedCardHolder - 查詢有效卡片持有者資料", 300, 0, 0.0, 29.42333333333333, 26, 38, 29.0, 32.0, 33.0, 34.99000000000001, 2.3863690599296814, 2.2884906414560033, 0.7317577000175001], "isController": false}, {"data": ["UpdateCardApprovalStatus - 審核信用卡 更新信用卡狀態", 300, 0, 0.0, 29.37333333333335, 26, 38, 29.0, 32.0, 33.0, 37.0, 2.386274151082971, 0.6105506128747445, 1.092932203962806], "isController": false}, {"data": ["FindCusBillAll - 查詢該月帳單的\"特定\"客戶資料", 300, 0, 0.0, 71.32666666666661, 55, 182, 66.0, 90.90000000000003, 101.0, 165.73000000000025, 2.386444992442924, 2277.9293301547214, 0.7108063698194257], "isController": false}, {"data": ["InsertCusDateBill - 客戶使用信用卡消費計入消費紀錄", 300, 0, 0.0, 27.18666666666665, 24, 37, 27.0, 29.0, 30.0, 33.99000000000001, 2.388173763523034, 0.594711239939818, 1.5649068313710506], "isController": false}, {"data": ["CreateCuscredit - 新增客戶信用卡資訊", 300, 0, 0.0, 25.526666666666674, 19, 77, 24.0, 31.900000000000034, 34.0, 54.840000000000146, 2.3853823767950004, 0.5893571692667334, 2.2246486033586184], "isController": false}]}, function(index, item){
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
