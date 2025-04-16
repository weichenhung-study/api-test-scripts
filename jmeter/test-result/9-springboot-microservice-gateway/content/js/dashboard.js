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

    var data = {"OkPercent": 63.42857142857143, "KoPercent": 36.57142857142857};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.05857142857142857, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "SC0106002-DisputeNotation"], "isController": false}, {"data": [0.0, 500, 1500, "SC0107001-FeePayment"], "isController": false}, {"data": [0.0, 500, 1500, "SC0104001-Transaction"], "isController": false}, {"data": [0.13333333333333333, 500, 1500, "SC0103001-Activation"], "isController": false}, {"data": [0.14333333333333334, 500, 1500, "SC0102001-Review"], "isController": false}, {"data": [0.0, 500, 1500, "SC0106001-TransactionQuery"], "isController": false}, {"data": [0.13333333333333333, 500, 1500, "SC0101001-Application"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2100, 768, 36.57142857142857, 16604.9638095238, 213, 75537, 7878.5, 61396.600000000006, 65394.6, 69675.06999999998, 14.489453747593716, 440.24360340208926, 7.620708793028503], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["SC0106002-DisputeNotation", 300, 246, 82.0, 25962.46333333333, 1729, 69676, 12814.5, 65981.5, 67734.7, 69336.62000000001, 3.04130086575698, 1.2367164848644594, 1.101877559761562], "isController": false}, {"data": ["SC0107001-FeePayment", 300, 26, 8.666666666666666, 26152.91666666667, 3083, 70263, 12854.0, 63362.200000000004, 65107.09999999999, 67492.61, 2.9797377830750893, 1.18419357742352, 1.1930590733015494], "isController": false}, {"data": ["SC0104001-Transaction", 300, 195, 65.0, 15285.806666666682, 764, 73763, 8395.0, 57512.100000000006, 65310.85, 72434.81000000001, 2.8229183329726273, 1.1433646275394502, 1.9903779652404656], "isController": false}, {"data": ["SC0103001-Activation", 300, 17, 5.666666666666667, 4001.4866666666708, 986, 16771, 1850.0, 10300.300000000001, 12434.499999999998, 15704.94, 4.394831677946734, 1.7245136386276405, 1.5708089786411181], "isController": false}, {"data": ["SC0102001-Review", 300, 17, 5.666666666666667, 7913.560000000008, 927, 48483, 1971.5, 43301.20000000003, 46562.8, 48329.85, 2.6404034536477172, 1.033599340229187, 1.093292055026008], "isController": false}, {"data": ["SC0106001-TransactionQuery", 300, 250, 83.33333333333333, 18456.72666666667, 213, 75537, 8878.0, 61891.9, 67123.9, 73088.57, 2.907822041291073, 611.5057084938693, 1.042158876126781], "isController": false}, {"data": ["SC0101001-Application", 300, 17, 5.666666666666667, 18461.786666666663, 939, 69575, 4368.5, 63980.600000000006, 66371.4, 68543.81, 2.36860181434899, 0.9387666468296265, 2.5675273573509556], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 743, 96.74479166666667, 35.38095238095238], "isController": false}, {"data": ["503/Service Unavailable", 4, 0.5208333333333334, 0.19047619047619047], "isController": false}, {"data": ["500/Internal Server Error", 21, 2.734375, 1.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2100, 768, "400/Bad Request", 743, "500/Internal Server Error", 21, "503/Service Unavailable", 4, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["SC0106002-DisputeNotation", 300, 246, "400/Bad Request", 246, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["SC0107001-FeePayment", 300, 26, "400/Bad Request", 22, "500/Internal Server Error", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["SC0104001-Transaction", 300, 195, "400/Bad Request", 195, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["SC0103001-Activation", 300, 17, "500/Internal Server Error", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["SC0102001-Review", 300, 17, "400/Bad Request", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["SC0106001-TransactionQuery", 300, 250, "400/Bad Request", 246, "503/Service Unavailable", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["SC0101001-Application", 300, 17, "400/Bad Request", 17, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
