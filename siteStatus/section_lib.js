/* JavaScript ************************************************************** */
"use strict";



/* ************************************************************************* */
/* data:                                                                     */
/* ************************************************************************* */
var siteMetricLabel = { LifeStatus:       "Life Status",
                        manualLifeStatus: " &nbsp; manual Life Status",
                        ProdStatus:       "Prod Status",
                        manualProdStatus: " &nbsp; manual Prod Status",
                        CrabStatus:       "CRAB Status",
                        manualCrabStatus: " &nbsp; manual CRAB Status",
                        downtime:         "Downtime(s)",
                        SiteReadiness:    "Site Readiness",
                        wlcgSAMsite:      "SAM Status",
                        wlcgSAMservice:   "SAM Status",
                        wlcgSAMdowntime:  "SAM Downtime(s)",
                        HC15min:          "HammerCloud",
                        summary:          "<B>Summary</B>" };
var siteMetricOrder = [ "LifeStatus", "manualLifeStatus",
                        "ProdStatus", "manualProdStatus",
                        "CrabStatus", "manualCrabStatus",
                        "***LINE***",
                        "***GGUS***",
                        "downtime",
                        "***LINE***",
                        "SiteReadiness", "wlcgSAMsite", "HC15min",
                        "***Othr***",
                        "summary",
                        "***LINE***",
                        "**Elmnts**" ];



/* ************************************************************************* */
/* functons:                                                                 */
/* ************************************************************************* */
function dateString1(timeInSeconds) {
   // function to return a full time string like "Th, 1970-Jan-01 00:00"
   var timeStr = "";
   var dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
   var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

   var timeObj = new Date( timeInSeconds * 1000 );

   timeStr = dayNames[ timeObj.getUTCDay() ] + ", " +
      timeObj.getUTCFullYear() + "-" + monthNames[ timeObj.getUTCMonth() ];
   if ( timeObj.getUTCDate() < 10 ) {
      timeStr += "-0" + timeObj.getUTCDate();
   } else {
      timeStr += "-" + timeObj.getUTCDate();
   }
   if ( timeObj.getUTCHours() < 10 ) {
      timeStr += " 0" + timeObj.getUTCHours();
   } else {
      timeStr += " " + timeObj.getUTCHours();
   }
   if ( timeObj.getUTCMinutes() < 10 ) {
      timeStr += ":0" + timeObj.getUTCMinutes();
   } else {
      timeStr += ":" + timeObj.getUTCMinutes();
   }

   return timeStr;
}

function dateString2(timeInSeconds) {
   // function to return an abbreviated date string like "Su, Jan-01"
   var timeStr = "";
   var dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
   var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

   var timeObj = new Date( timeInSeconds * 1000 );

   if ( timeObj.getUTCDate() < 10 ) {
      timeStr = dayNames[ timeObj.getUTCDay() ] + ", " +
         monthNames[ timeObj.getUTCMonth() ] + "-0" + timeObj.getUTCDate();
   } else {
      timeStr = dayNames[ timeObj.getUTCDay() ] + ", " +
         monthNames[ timeObj.getUTCMonth() ] + "-" + timeObj.getUTCDate();
   }

   return timeStr;
}

function dateString3(timeInSeconds) {
   // function to return an abbreviated date string like "2017/01/01"
   var timeStr = "";

   var timeObj = new Date( timeInSeconds * 1000 );

   timeStr = timeObj.getUTCFullYear() + '/' +
      ("0" + (timeObj.getUTCMonth() + 1)).slice(-2) + '/' +
      ("0" + timeObj.getUTCDate()).slice(-2);

   return timeStr;
}

function dateString4(timeInSeconds) {
   // function to return an abbreviated date string like "2017-01-01"
   var timeStr = "";

   var timeObj = new Date( timeInSeconds * 1000 );

   timeStr = timeObj.getUTCFullYear() + '-' +
      ("0" + (timeObj.getUTCMonth() + 1)).slice(-2) + '-' +
      ("0" + timeObj.getUTCDate()).slice(-2);

   return timeStr;
}

function dateMidnight(timeInSeconds) {
   // function to return the time in seconds at midnight of the timestamp
   var midnight = 0;

   var timeObj = new Date( timeInSeconds * 1000 );
   timeObj.setUTCHours(0);
   timeObj.setUTCMinutes(0);
   timeObj.setUTCSeconds(0);
   midnight = Math.trunc( timeObj.getTime() / 1000 );

   return midnight;
}

function writePmonthTable() {

   // compose table header:
   var myTableStr = '<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="0">\n<TR' +
      '>\n   <TH NOWRAP ALIGN="left"><BIG><B>Metric</B></BIG>\n   <TH NOWRAP' +
      '><BIG>&nbsp;</BIG>\n   <TH NOWRAP ALIGN="left"><BIG><B>' +
      dateString2(myData.time - 38 * 86400) + '</B></BIG>\n   <TH NOWRAP ALI' +
      'GN="center"><BIG><B>Previous Month</B></BIG>\n   <TH NOWRAP ALIGN="ri' +
      'ght"><BIG><B>' + dateString2(myData.time - 8 * 86400) + '</B></BIG>\n';


   // loop over metrics in siteMetricOrder and write a table row for each:
   for ( var mCnt=0; mCnt < siteMetricOrder.length; mCnt+=1 ) {
      if ( siteMetricOrder[mCnt] == "***LINE***" ) {
         myTableStr += '<TR>\n   <TD COLSPAN="5" bgcolor="#000000" STYLE="li' +
            'ne-height:2px;">&nbsp;\n<TR>\n   <TD COLSPAN="5" bgcolor="#FFFF' +
            'FF" STYLE="line-height:2px;">&nbsp;\n';
      } else if ( siteMetricOrder[mCnt] == "***GGUS***" ) {
         myTableStr += '<TR>\n   <TD ALIGN="left">GGUS tickets:\n' +
            '   <TD NOWRAP>&nbsp;';
         var nidnight = dateMidnight( myData.time );
         myData.ggus.sort();
         // GGUS tickets opened the previous month:
         myTableStr += '\n   <TD COLSPAN="3"><DIV STYLE="text-align: center"' +
            '>&nbsp;';
         for ( var iTckt = 0; iTckt < myData.ggus.length; iTckt += 1 ) {
            if (( myData.ggus[iTckt][1] >= nidnight - 3283200 ) &&
                ( myData.ggus[iTckt][1] <= nidnight - 691200 )) {
               myTableStr += '[<A HREF="https://ggus.eu/?mode=ticket_info&ti' +
                  'cket_id=' + myData.ggus[iTckt][0] + '">' +
                  myData.ggus[iTckt][0] + '</A>]&nbsp;';
            }
         }
         myTableStr += '</DIV>\n';
      } else if ( siteMetricOrder[mCnt] in myData.metrics ) {
         var nName = siteMetricOrder[mCnt];
         if ( siteMetricOrder[mCnt] in siteMetricLabel ) {
            nName = siteMetricLabel[siteMetricOrder[mCnt]];
         }
         myTableStr += '<TR>\n   <TD NOWRAP ALIGN="left">' + nName + '\n   <' +
            'TD NOWRAP>&nbsp;\n';
         var urlStr = "";
         if ( siteMetricOrder[mCnt] == "wlcgSAMsite" ) {
            myTableStr += '   <TD COLSPAN="3"><A HREF="http://wlcg-sam-cms.c' +
               'ern.ch/templates/ember/#/historicalsmry/heatMap?profile=CMS_' +
               'CRITICAL_FULL&site=' + myData.site + '&start_time=' +
               dateString3(myData.time - 38 * 86400) + ' 00:00&end_time=' +
               dateString3(myData.time - 8 * 86400) + ' 00:00&time=manual&gr' +
               'anularity=Daily&view=Service Availability"><CANVAS ID="cnvs_' +
               siteMetricOrder[mCnt] + '_s1" WIDTH="782" HEIGHT="18"></CANVA' +
               'S></A>\n';
         } else if ( siteMetricOrder[mCnt] == "HC15min" ) {
            myTableStr += '   <TD COLSPAN="3"><A HREF="http://dashb-ssb.cern' +
               '.ch/dashboard/request.py/siteviewhistory?columnid=217&debug=' +
               'false#time=custom&start_date=' +
               dateString4(myData.time - 38 * 86400) + '&end_date=' +
               dateString4(myData.time - 8 * 86400) + '&values=false&spline=' +
               'false&debug=false&resample=false&sites=one&clouds=all&site=' +
               myData.site + '"><CANVAS ID="cnvs_' + siteMetricOrder[mCnt] +
               '_s1" WIDTH="782" HEIGHT="18"></CANVAS></A>\n';
         } else {
            myTableStr += '   <TD COLSPAN="3"><CANVAS ID="cnvs_' +
               siteMetricOrder[mCnt] + '_s1" WIDTH="782" HEIGHT="18"></CANVA' +
               'S>\n';
         }
      } else if ( siteMetricOrder[mCnt] == "***Othr***" ) {
         // loop over site metrics and write any not in siteMetricOrder:
         for ( var mName in myData.metrics ) {
            if ( siteMetricOrder.indexOf(mName) >= 0 ) {
               continue;
            }
            myTableStr += '<TR>\n   <TD ALIGN="left">' + mName +
               '\n   <TD NOWRAP>&nbsp;\n';
            // previous month's, column:
            myTableStr += '   <TD COLSPAN="3"><CANVAS ID="cnvs_' + mName +
               '_s1" WIDTH="782" HEIGHT="18"></CANVAS>\n';
         }
      } else if ( siteMetricOrder[mCnt] == "**Elmnts**" ) {
         // loop over site elements and write the metrics of each:
         for ( var cnt=0; cnt < myData.elements.length; cnt+=1 ) {
            // concatenate host and type excluding domain
            var indx = myData.elements[cnt].host.indexOf('.');
            if ( indx <= 0 ) {
               indx = myData.elements[cnt].host.length;
            }
            var eName = myData.elements[cnt].host.substring(0,indx) + ' / ' +
               myData.elements[cnt].type;

            myTableStr += '<TR>\n   <TD COLSPAN="5" bgcolor="#000000" STYLE=' +
               '"line-height:2px;">&nbsp;\n<TR>\n   <TD COLSPAN="5" bgcolor=' +
               '"#FFFFFF" STYLE="line-height:8px;">&nbsp;\n<TR>\n   <TD COLS' +
               'PAN="5" bgcolor="#FFFFFF" ALIGN="left"><SPAN STYLE="font-siz' +
               'e:large;">' + eName + '</SPAN>\n';
            eName = myData.elements[cnt].host + '/' + myData.elements[cnt].type;
            eName = eName.replace(' ', '');
            // loop over metrics of element:
            for ( var mName in myData.elements[cnt].metrics ) {
               if ( mName in siteMetricLabel ) {
                  myTableStr += '<TR>\n   <TD NOWRAP ALIGN="left"> &nbsp &nb' +
                     'sp ' + siteMetricLabel[mName] +
                     '\n   <TD NOWRAP>&nbsp;\n';
               } else {
                  myTableStr += '<TR>\n   <TD NOWRAP ALIGN="left"> &nbsp &nb' +
                     'sp ' + mName + '\n   <TD NOWRAP>&nbsp;\n';
               }
               if ( mName =="wlcgSAMservice" ) {
                  myTableStr += '   <TD COLSPAN="3"><A HREF="http://wlcg-sam' +
                     '-cms.cern.ch/templates/ember/#/historicalsmry/heatMap?' +
                     'profile=CMS_CRITICAL_FULL&site=' + myData.site +
                     '&flavours=' + myData.elements[cnt].type +
                     '&start_time=' + dateString3(myData.time - 38 * 86400) +
                     ' 00:00&end_time=' +
                     dateString3(myData.time - 8 * 86400) + ' 00:00&time=man' +
                     'ual&view=Service Availability"><CANVAS ID="cnvs_' +
                     eName + '_' + mName + '_s1" WIDTH="782" HEIGHT="18"></C' +
                     'ANVAS></A>\n';
               } else {
                  myTableStr += '   <TD COLSPAN="3"><CANVAS ID="cnvs_' +
                     eName + '_' + mName + '_s1" WIDTH="782" HEIGHT="18">' +
                     '</CANVAS>\n';
               }
            }
         }
      }
   }

   // add a row/line in case there is a message:
   if ( myData.msg != '' ) {
      myTableStr += '<TR>\n   <TD COLSPAN="5" ALIGN="left"><SPAN STYLE="colo' +
         'r:blue; font-weight:bold;">' + siteStatusInfo['msg'] + '</SPAN>\n';
   }

   // compose table trailer:
   myTableStr += '</TABLE>\n';


   // update main DIV section with table:
   document.getElementById("mainDIV").innerHTML = myTableStr;
}

function writePweekTable() {

   // compose table header:
   var myTableStr = '<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="0">\n<TR' +
      '>\n   <TH NOWRAP ALIGN="left"><BIG><B>Metric</B></BIG>\n   <TH NOWRAP' +
      '><BIG>&nbsp;</BIG>\n   <TH NOWRAP ALIGN="left"><BIG><B>' +
      dateString2(myData.time - 8 * 86400) + '</B></BIG>\n   <TH NOWRAP ALIG' +
      'N="center"><BIG><B>Previous Week</B></BIG>\n   <TH NOWRAP ALIGN="righ' +
      't"><BIG><B>' + dateString2(myData.time - 2 * 86400) + '</B></BIG>\n';


   // loop over metrics in siteMetricOrder and write a table row for each:
   for ( var mCnt=0; mCnt < siteMetricOrder.length; mCnt+=1 ) {
      if ( siteMetricOrder[mCnt] == "***LINE***" ) {
         myTableStr += '<TR>\n   <TD COLSPAN="5" bgcolor="#000000" STYLE="li' +
            'ne-height:2px;">&nbsp;\n<TR>\n   <TD COLSPAN="5" bgcolor="#FFFF' +
            'FF" STYLE="line-height:2px;">&nbsp;\n';
      } else if ( siteMetricOrder[mCnt] == "***GGUS***" ) {
         myTableStr += '<TR>\n   <TD ALIGN="left">GGUS tickets:\n' +
            '   <TD NOWRAP>&nbsp;';
         var nidnight = dateMidnight( myData.time );
         myData.ggus.sort();
         // GGUS tickets opened the previous week:
         myTableStr += '\n   <TD COLSPAN="3"><DIV STYLE="text-align: center"' +
            '>&nbsp;';
         for ( var iTckt = 0; iTckt < myData.ggus.length; iTckt += 1 ) {
            if (( myData.ggus[iTckt][1] >= nidnight - 691200 ) &&
                ( myData.ggus[iTckt][1] <= nidnight - 86400 )) {
               myTableStr += '[<A HREF="https://ggus.eu/?mode=ticket_info&ti' +
                  'cket_id=' + myData.ggus[iTckt][0] + '">' +
                  myData.ggus[iTckt][0] + '</A>]&nbsp;';
            }
         }
         myTableStr += '</DIV>\n';
      } else if ( siteMetricOrder[mCnt] in myData.metrics ) {
         var nName = siteMetricOrder[mCnt];
         if ( siteMetricOrder[mCnt] in siteMetricLabel ) {
            nName = siteMetricLabel[siteMetricOrder[mCnt]];
         }
         myTableStr += '<TR>\n   <TD NOWRAP ALIGN="left">' + nName + '\n   <' +
            'TD NOWRAP>&nbsp;\n';
         var urlStr = "";
         if ( siteMetricOrder[mCnt] == "wlcgSAMsite" ) {
            myTableStr += '   <TD COLSPAN="3"><A HREF="http://wlcg-sam-cms.c' +
               'ern.ch/templates/ember/#/historicalsmry/heatMap?profile=CMS_' +
               'CRITICAL_FULL&site=' + myData.site + '&start_time=' +
               dateString3(myData.time - 8 * 86400) + ' 00:00&end_time=' +
               dateString3(myData.time - 86400) + ' 00:00&time=manual&view=T' +
               'est History"><CANVAS ID="cnvs_' + siteMetricOrder[mCnt] +
               '_s2" WIDTH="730" HEIGHT="18"></CANVAS></A>\n';
         } else if ( siteMetricOrder[mCnt] == "HC15min" ) {
            myTableStr += '   <TD COLSPAN="3"><A HREF="http://dashb-ssb.cern' +
               '.ch/dashboard/request.py/siteviewhistory?columnid=217&debug=' +
               'false#time=custom&start_date=' +
               dateString4(myData.time - 8 * 86400) + '&end_date=' +
               dateString4(myData.time - 86400) + '&values=false&spline=fals' +
               'e&debug=false&resample=false&sites=one&clouds=all&site=' +
               myData.site + '"><CANVAS ID="cnvs_' + siteMetricOrder[mCnt] +
               '_s2" WIDTH="730" HEIGHT="18"></CANVAS></A>\n';
         } else {
            myTableStr += '   <TD COLSPAN="3"><CANVAS ID="cnvs_' +
               siteMetricOrder[mCnt] + '_s2" WIDTH="730" HEIGHT="18"></CANVA' +
               'S>\n';
         }
      } else if ( siteMetricOrder[mCnt] == "***Othr***" ) {
         // loop over site metrics and write any not in siteMetricOrder:
         for ( var mName in myData.metrics ) {
            if ( siteMetricOrder.indexOf(mName) >= 0 ) {
               continue;
            }
            myTableStr += '<TR>\n   <TD ALIGN="left">' + mName +
               '\n   <TD NOWRAP>&nbsp;\n';
            // previous week's, column:
            myTableStr += '   <TD COLSPAN="3"><CANVAS ID="cnvs_' + mName +
               '_s2" WIDTH="730" HEIGHT="18"></CANVAS>\n';
         }
      } else if ( siteMetricOrder[mCnt] == "**Elmnts**" ) {
         // loop over site elements and write the metrics of each:
         for ( var cnt=0; cnt < myData.elements.length; cnt+=1 ) {
            // concatenate host and type excluding domain
            var indx = myData.elements[cnt].host.indexOf('.');
            if ( indx <= 0 ) {
               indx = myData.elements[cnt].host.length;
            }
            var eName = myData.elements[cnt].host.substring(0,indx) + ' / ' +
               myData.elements[cnt].type;

            myTableStr += '<TR>\n   <TD COLSPAN="5" bgcolor="#000000" STYLE=' +
               '"line-height:2px;">&nbsp;\n<TR>\n   <TD COLSPAN="5" bgcolor=' +
               '"#FFFFFF" STYLE="line-height:8px;">&nbsp;\n<TR>\n   <TD COLS' +
               'PAN="5" bgcolor="#FFFFFF" ALIGN="left"><SPAN STYLE="font-siz' +
               'e:large;">' + eName + '</SPAN>\n';
            eName = myData.elements[cnt].host + '/' + myData.elements[cnt].type;
            eName = eName.replace(' ', '');
            // loop over metrics of element:
            for ( var mName in myData.elements[cnt].metrics ) {
               if ( mName in siteMetricLabel ) {
                  myTableStr += '<TR>\n   <TD NOWRAP ALIGN="left"> &nbsp &nb' +
                     'sp ' + siteMetricLabel[mName] +
                     '\n   <TD NOWRAP>&nbsp;\n';
               } else {
                  myTableStr += '<TR>\n   <TD NOWRAP ALIGN="left"> &nbsp &nb' +
                     'sp ' + mName + '\n   <TD NOWRAP>&nbsp;\n';
               }
               if ( mName =="wlcgSAMservice" ) {
                  myTableStr += '   <TD COLSPAN="3"><A HREF="http://wlcg-sam' +
                     '-cms.cern.ch/templates/ember/#/historicalsmry/heatMap?' +
                     'profile=CMS_CRITICAL_FULL&site=' + myData.site + '&hos' +
                     'tname=' + myData.elements[cnt].host + '&start_time=' +
                     dateString3(myData.time - 8 * 86400) +
                     ' 00:00&end_time=' + dateString3(myData.time - 86400) +
                     ' 00:00&time=manual&view=Test History"><CANVAS ID="cnvs' +
                     '_' + eName + '_' + mName + '_s2" WIDTH="730" HEIGHT="1' +
                     '8"></CANVAS></A>\n';
               } else {
                  myTableStr += '   <TD COLSPAN="3"><CANVAS ID="cnvs_' +
                     eName + '_' + mName + '_s2" WIDTH="730" HEIGHT="18">' +
                     '</CANVAS>\n';
               }
            }
         }
      }
   }

   // add a row/line in case there is a message:
   if ( myData.msg != '' ) {
      myTableStr += '<TR>\n   <TD COLSPAN="5" ALIGN="left"><SPAN STYLE="colo' +
         'r:blue; font-weight:bold;">' + siteStatusInfo['msg'] + '</SPAN>\n';
   }

   // compose table trailer:
   myTableStr += '</TABLE>\n';


   // update main DIV section with table:
   document.getElementById("mainDIV").innerHTML = myTableStr;
}

function writeYesterdayTable() {

   // compose table header:
   var myTableStr = '<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="0">\n<TR' +
      '>\n   <TH NOWRAP ALIGN="left"><BIG><B>Metric</B></BIG>\n   <TH NOWRAP' +
      '><BIG>&nbsp;</BIG>\n   <TH NOWRAP ALIGN="left"><BIG><B>00:00</B></BIG' +
      '>\n   <TH NOWRAP ALIGN="center"><BIG><B>Yesterday, ' +
      dateString2( myData.time - 86400 ) + '</B></BIG>\n   <TH NOWRAP ALIGN=' +
      '"right"><BIG><B>24:00</B></BIG>\n';


   // loop over metrics in siteMetricOrder and write a table row for each:
   for ( var mCnt=0; mCnt < siteMetricOrder.length; mCnt+=1 ) {
      if ( siteMetricOrder[mCnt] == "***LINE***" ) {
         myTableStr += '<TR>\n   <TD COLSPAN="5" bgcolor="#000000" STYLE="li' +
            'ne-height:2px;">&nbsp;\n<TR>\n   <TD COLSPAN="5" bgcolor="#FFFF' +
            'FF" STYLE="line-height:2px;">&nbsp;\n';
      } else if ( siteMetricOrder[mCnt] == "***GGUS***" ) {
         myTableStr += '<TR>\n   <TD ALIGN="left">GGUS tickets:\n' +
            '   <TD NOWRAP>&nbsp;';
         var nidnight = dateMidnight( myData.time );
         myData.ggus.sort();
         // GGUS tickets opened yesterday:
         myTableStr += '\n   <TD COLSPAN="3"><DIV STYLE="text-align: center"' +
            '>&nbsp;';
         for ( var iTckt = 0; iTckt < myData.ggus.length; iTckt += 1 ) {
            if (( myData.ggus[iTckt][1] >= nidnight - 86400 ) &&
                ( myData.ggus[iTckt][1] <= nidnight )) {
               myTableStr += '[<A HREF="https://ggus.eu/?mode=ticket_info&ti' +
                  'cket_id=' + myData.ggus[iTckt][0] + '">' +
                  myData.ggus[iTckt][0] + '</A>]&nbsp;';
            }
         }
         myTableStr += '</DIV>\n';
      } else if ( siteMetricOrder[mCnt] in myData.metrics ) {
         var nName = siteMetricOrder[mCnt];
         if ( siteMetricOrder[mCnt] in siteMetricLabel ) {
            nName = siteMetricLabel[siteMetricOrder[mCnt]];
         }
         myTableStr += '<TR>\n   <TD NOWRAP ALIGN="left">' + nName + '\n   <' +
            'TD NOWRAP>&nbsp;\n';
         var urlStr = "";
         if ( siteMetricOrder[mCnt] == "wlcgSAMsite" ) {
            myTableStr += '   <TD COLSPAN="3"><A HREF="http://wlcg-sam-cms.c' +
               'ern.ch/templates/ember/#/historicalsmry/heatMap?profile=CMS_' +
               'CRITICAL_FULL&site=' + myData.site + '&start_time=' +
               dateString3(myData.time - 86400) + ' 00:00&end_time=' +
               dateString3( myData.time) + ' 00:00&time=manual&view=Test His' +
               'tory"><CANVAS ID="cnvs_' + siteMetricOrder[mCnt] + '_s3" WID' +
               'TH="626" HEIGHT="18"></CANVAS></A>\n';
         } else if ( siteMetricOrder[mCnt] == "HC15min" ) {
            myTableStr += '   <TD COLSPAN="3"><A HREF="http://dashb-ssb.cern' +
               '.ch/dashboard/request.py/siteviewhistory?columnid=217&debug=' +
               'false#time=custom&start_date=' +
               dateString4(myData.time - 86400) + '&end_date=' +
               dateString4(myData.time) + '&values=false&spline=false&debug=' +
               'false&resample=false&sites=one&clouds=all&site=' +
               myData.site + '"><CANVAS ID="cnvs_' + siteMetricOrder[mCnt] +
               '_s3" WIDTH="626" HEIGHT="18"></CANVAS></A>\n';
         } else {
            myTableStr += '   <TD COLSPAN="3"><CANVAS ID="cnvs_' +
               siteMetricOrder[mCnt] + '_s3" WIDTH="626" HEIGHT="18"></CANVA' +
               'S>\n';
         }
      } else if ( siteMetricOrder[mCnt] == "***Othr***" ) {
         // loop over site metrics and write any not in siteMetricOrder:
         for ( var mName in myData.metrics ) {
            if ( siteMetricOrder.indexOf(mName) >= 0 ) {
               continue;
            }
            myTableStr += '<TR>\n   <TD ALIGN="left">' + mName +
               '\n   <TD NOWRAP>&nbsp;\n';
            // yesterday's, column:
            myTableStr += '   <TD COLSPAN="3"><CANVAS ID="cnvs_' + mName +
               '_s3" WIDTH="626" HEIGHT="18"></CANVAS>\n';
         }
      } else if ( siteMetricOrder[mCnt] == "**Elmnts**" ) {
         // loop over site elements and write the metrics of each:
         for ( var cnt=0; cnt < myData.elements.length; cnt+=1 ) {
            // concatenate host and type excluding domain
            var indx = myData.elements[cnt].host.indexOf('.');
            if ( indx <= 0 ) {
               indx = myData.elements[cnt].host.length;
            }
            var eName = myData.elements[cnt].host.substring(0,indx) + ' / ' +
               myData.elements[cnt].type;

            myTableStr += '<TR>\n   <TD COLSPAN="5" bgcolor="#000000" STYLE=' +
               '"line-height:2px;">&nbsp;\n<TR>\n   <TD COLSPAN="5" bgcolor=' +
               '"#FFFFFF" STYLE="line-height:8px;">&nbsp;\n<TR>\n   <TD COLS' +
               'PAN="5" bgcolor="#FFFFFF" ALIGN="left"><SPAN STYLE="font-siz' +
               'e:large;">' + eName + '</SPAN>\n';
            eName = myData.elements[cnt].host + '/' + myData.elements[cnt].type;
            eName = eName.replace(' ', '');
            // loop over metrics of element:
            for ( var mName in myData.elements[cnt].metrics ) {
               if ( mName in siteMetricLabel ) {
                  myTableStr += '<TR>\n   <TD NOWRAP ALIGN="left"> &nbsp &nb' +
                     'sp ' + siteMetricLabel[mName] +
                     '\n   <TD NOWRAP>&nbsp;\n';
               } else {
                  myTableStr += '<TR>\n   <TD NOWRAP ALIGN="left"> &nbsp &nb' +
                     'sp ' + mName + '\n   <TD NOWRAP>&nbsp;\n';
               }
               if ( mName =="wlcgSAMservice" ) {
                  myTableStr += '   <TD COLSPAN="3"><A HREF="http://wlcg-sam' +
                     '-cms.cern.ch/templates/ember/#/historicalsmry/heatMap?' +
                     'profile=CMS_CRITICAL_FULL&site=' + myData.site + '&hos' +
                     'tname=' + myData.elements[cnt].host + '&start_time=' +
                     dateString3(myData.time - 86400) + ' 00:00&end_time=' +
                     dateString3(myData.time) + ' 00:00&time=manual&view=Tes' +
                     't History"><CANVAS ID="cnvs' + '_' + eName + '_' +
                     mName + '_s3" WIDTH="626" HEIGHT="18"></CANVAS></A>\n';
               } else {
                  myTableStr += '   <TD COLSPAN="3"><CANVAS ID="cnvs_' +
                     eName + '_' + mName + '_s3" WIDTH="626" HEIGHT="18">' +
                     '</CANVAS>\n';
               }
            }
         }
      }
   }

   // add a row/line in case there is a message:
   if ( myData.msg != '' ) {
      myTableStr += '<TR>\n   <TD COLSPAN="5" ALIGN="left"><SPAN STYLE="colo' +
         'r:blue; font-weight:bold;">' + siteStatusInfo['msg'] + '</SPAN>\n';
   }

   // compose table trailer:
   myTableStr += '</TABLE>\n';


   // update main DIV section with table:
   document.getElementById("mainDIV").innerHTML = myTableStr;
}

function writeTodayTable() {

   // compose table header:
   var myTableStr = '<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="0">\n<TR' +
      '>\n   <TH NOWRAP ALIGN="left"><BIG><B>Metric</B></BIG>\n   <TH NOWRAP' +
      '><BIG>&nbsp;</BIG>\n   <TH NOWRAP ALIGN="left"><BIG><B>00:00</B></BIG' +
      '>\n   <TH NOWRAP ALIGN="center"><BIG><B>UTC Today</B></BIG>\n   <TH N' +
      'OWRAP ALIGN="right"><BIG><B>24:00</B></BIG>\n';


   // loop over metrics in siteMetricOrder and write a table row for each:
   for ( var mCnt=0; mCnt < siteMetricOrder.length; mCnt+=1 ) {
      if ( siteMetricOrder[mCnt] == "***LINE***" ) {
         myTableStr += '<TR>\n   <TD COLSPAN="5" bgcolor="#000000" STYLE="li' +
            'ne-height:2px;">&nbsp;\n<TR>\n   <TD COLSPAN="5" bgcolor="#FFFF' +
            'FF" STYLE="line-height:2px;">&nbsp;\n';
      } else if ( siteMetricOrder[mCnt] == "***GGUS***" ) {
         myTableStr += '<TR>\n   <TD ALIGN="left">GGUS tickets:\n' +
            '   <TD NOWRAP>&nbsp;';
         var nidnight = dateMidnight( myData.time );
         myData.ggus.sort();
         // GGUS tickets opened today:
         myTableStr += '\n   <TD COLSPAN="3"><DIV STYLE="text-align: center"' +
            '>&nbsp;';
         for ( var iTckt = 0; iTckt < myData.ggus.length; iTckt += 1 ) {
            if ( myData.ggus[iTckt][1] >= nidnight ) {
               myTableStr += '[<A HREF="https://ggus.eu/?mode=ticket_info&ti' +
                  'cket_id=' + myData.ggus[iTckt][0] + '">' +
                  myData.ggus[iTckt][0] + '</A>]&nbsp;';
            }
         }
         myTableStr += '</DIV>\n';
      } else if ( siteMetricOrder[mCnt] in myData.metrics ) {
         var nName = siteMetricOrder[mCnt];
         if ( siteMetricOrder[mCnt] in siteMetricLabel ) {
            nName = siteMetricLabel[siteMetricOrder[mCnt]];
         }
         myTableStr += '<TR>\n   <TD NOWRAP ALIGN="left">' + nName + '\n   <' +
            'TD NOWRAP>&nbsp;\n';
         var urlStr = "";
         if ( siteMetricOrder[mCnt] == "wlcgSAMsite" ) {
            myTableStr += '   <TD COLSPAN="3"><A HREF="http://wlcg-sam-cms.c' +
               'ern.ch/templates/ember/#/historicalsmry/heatMap?profile=CMS_' +
               'CRITICAL_FULL&site=' + myData.site + '&start_time=' +
               dateString3(myData.time) + ' 00:00&end_time=' +
               dateString3(myData.time + 86400) + ' 00:00&time=manual&view=T' +
               'est History"><CANVAS ID="cnvs_' + siteMetricOrder[mCnt] +
               '_s4" WIDTH="626" HEIGHT="18"></CANVAS></A>\n';
         } else if ( siteMetricOrder[mCnt] == "HC15min" ) {
            myTableStr += '   <TD COLSPAN="3"><A HREF="http://dashb-ssb.cern' +
               '.ch/dashboard/request.py/siteviewhistory?columnid=217&debug=' +
               'false#time=custom&start_date=' + dateString4(myData.time) +
               '&end_date=' + dateString4(myData.time + 86400) + '&values=fa' +
               'lse&spline=false&debug=false&resample=false&sites=one&clouds' +
               '=all&site=' + myData.site + '"><CANVAS ID="cnvs_' +
               siteMetricOrder[mCnt] + '_s4" WIDTH="626" HEIGHT="18">' +
               '</CANVAS></A>\n';
         } else {
            myTableStr += '   <TD COLSPAN="3"><CANVAS ID="cnvs_' +
               siteMetricOrder[mCnt] + '_s4" WIDTH="626" HEIGHT="18">' +
               '</CANVAS>\n';
         }
      } else if ( siteMetricOrder[mCnt] == "***Othr***" ) {
         // loop over site metrics and write any not in siteMetricOrder:
         for ( var mName in myData.metrics ) {
            if ( siteMetricOrder.indexOf(mName) >= 0 ) {
               continue;
            }
            myTableStr += '<TR>\n   <TD ALIGN="left">' + mName +
               '\n   <TD NOWRAP>&nbsp;\n';
            // fifth, today's, column:
            myTableStr += '   <TD COLSPAN="3"><CANVAS ID="cnvs_' + mName +
               '_s4" WIDTH="626" HEIGHT="18"></CANVAS>\n';
         }
      } else if ( siteMetricOrder[mCnt] == "**Elmnts**" ) {
         // loop over site elements and write the metrics of each:
         for ( var cnt=0; cnt < myData.elements.length; cnt+=1 ) {
            // concatenate host and type excluding domain
            var indx = myData.elements[cnt].host.indexOf('.');
            if ( indx <= 0 ) {
               indx = myData.elements[cnt].host.length;
            }
            var eName = myData.elements[cnt].host.substring(0,indx) + ' / ' +
               myData.elements[cnt].type;

            myTableStr += '<TR>\n   <TD COLSPAN="5" bgcolor="#000000" STYLE=' +
               '"line-height:2px;">&nbsp;\n<TR>\n   <TD COLSPAN="5" bgcolor=' +
               '"#FFFFFF" STYLE="line-height:8px;">&nbsp;\n<TR>\n   <TD COLS' +
               'PAN="5" bgcolor="#FFFFFF" ALIGN="left"><SPAN STYLE="font-siz' +
               'e:large;">' + eName + '</SPAN>\n';
            eName = myData.elements[cnt].host + '/' + myData.elements[cnt].type;
            eName = eName.replace(' ', '');
            // loop over metrics of element:
            for ( var mName in myData.elements[cnt].metrics ) {
               if ( mName in siteMetricLabel ) {
                  myTableStr += '<TR>\n   <TD NOWRAP ALIGN="left"> &nbsp &nb' +
                     'sp ' + siteMetricLabel[mName] +
                     '\n   <TD NOWRAP>&nbsp;\n';
               } else {
                  myTableStr += '<TR>\n   <TD NOWRAP ALIGN="left"> &nbsp &nb' +
                     'sp ' + mName + '\n   <TD NOWRAP>&nbsp;\n';
               }
               if ( mName =="wlcgSAMservice" ) {
                  myTableStr += '   <TD COLSPAN="3"><A HREF="http://wlcg-sam' +
                     '-cms.cern.ch/templates/ember/#/historicalsmry/heatMap?' +
                     'profile=CMS_CRITICAL_FULL&site=' + myData.site + '&hos' +
                     'tname=' + myData.elements[cnt].host + '&start_time=' +
                     dateString3(myData.time) + ' 00:00&end_time=' +
                     dateString3(myData.time + 86400) + ' 00:00&time=manual&' +
                     'view=Test History"><CANVAS ID="cnvs' + '_' + eName +
                     '_' + mName + '_s4" WIDTH="626" HEIGHT="18">' +
                     '</CANVAS></A>\n';
               } else {
                  myTableStr += '   <TD COLSPAN="3"><CANVAS ID="cnvs_' +
                     eName + '_' + mName + '_s4" WIDTH="626" HEIGHT="18">' +
                     '</CANVAS>\n';
               }
            }
         }
      }
   }

   // add a row/line in case there is a message:
   if ( myData.msg != '' ) {
      myTableStr += '<TR>\n   <TD COLSPAN="5" ALIGN="left"><SPAN STYLE="colo' +
         'r:blue; font-weight:bold;">' + siteStatusInfo['msg'] + '</SPAN>\n';
   }

   // compose table trailer:
   myTableStr += '</TABLE>\n';


   // update main DIV section with table:
   document.getElementById("mainDIV").innerHTML = myTableStr;
}

function writeFweekTable() {

   // compose table header:
   var myTableStr = '<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="0">\n<TR' +
      '>\n   <TH NOWRAP ALIGN="left"><BIG><B>Metric</B></BIG>\n   <TH NOWRAP' +
      '><BIG>&nbsp;</BIG>\n   <TH NOWRAP ALIGN="left"><BIG><B>' +
      dateString2(myData.time + 86400) + '</B></BIG>\n   <TH NOWRAP ALIGN="c' +
      'enter"><BIG><B>Following Week</B></BIG>\n   <TH NOWRAP ALIGN="right">' +
      '<BIG><B>' + dateString2(myData.time + 7 * 86400) + '</B></BIG>\n';


   // loop over metrics in siteMetricOrder and write a table row for each:
   for ( var mCnt=0; mCnt < siteMetricOrder.length; mCnt+=1 ) {
      if ( siteMetricOrder[mCnt] == "***LINE***" ) {
         myTableStr += '<TR>\n   <TD COLSPAN="5" bgcolor="#000000" STYLE="li' +
            'ne-height:2px;">&nbsp;\n<TR>\n   <TD COLSPAN="5" bgcolor="#FFFF' +
            'FF" STYLE="line-height:2px;">&nbsp;\n';
      } else if ( siteMetricOrder[mCnt] == "***GGUS***" ) {
         myTableStr += '<TR>\n   <TD ALIGN="left">GGUS tickets:\n' +
            '   <TD NOWRAP>&nbsp;';
         var nidnight = dateMidnight( myData.time );
         myData.ggus.sort();
         // GGUS tickets opened the following week:
         myTableStr += '\n   <TD COLSPAN="3"><DIV STYLE="text-align: center"' +
            '>&nbsp;';
         for ( var iTckt = 0; iTckt < myData.ggus.length; iTckt += 1 ) {
            if ( myData.ggus[iTckt][1] >= nidnight + 86400 ) {
               myTableStr += '[<A HREF="https://ggus.eu/?mode=ticket_info&ti' +
                  'cket_id=' + myData.ggus[iTckt][0] + '">' +
                  myData.ggus[iTckt][0] + '</A>]&nbsp;';
            }
         }
         myTableStr += '</DIV>\n';
      } else if ( siteMetricOrder[mCnt] in myData.metrics ) {
         var nName = siteMetricOrder[mCnt];
         if ( siteMetricOrder[mCnt] in siteMetricLabel ) {
            nName = siteMetricLabel[siteMetricOrder[mCnt]];
         }
         myTableStr += '<TR>\n   <TD NOWRAP ALIGN="left">' + nName + '\n   <' +
            'TD NOWRAP>&nbsp;\n';
         var urlStr = "";
         if ( siteMetricOrder[mCnt] == "wlcgSAMsite" ) {
            myTableStr += '   <TD COLSPAN="3"><A HREF="http://wlcg-sam-cms.c' +
               'ern.ch/templates/ember/#/historicalsmry/heatMap?profile=CMS_' +
               'CRITICAL_FULL&site=' + myData.site + '&start_time=' +
               dateString3(myData.time + 86400) + ' 00:00&end_time=' +
               dateString3(myData.time + 8 * 86400) + ' 00:00&time=manual&vi' +
               'ew=Test History"><CANVAS ID="cnvs_' + siteMetricOrder[mCnt] +
               '_s5" WIDTH="730" HEIGHT="18"></CANVAS></A>\n';
         } else if ( siteMetricOrder[mCnt] == "HC15min" ) {
            myTableStr += '   <TD COLSPAN="3"><A HREF="http://dashb-ssb.cern' +
               '.ch/dashboard/request.py/siteviewhistory?columnid=217&debug=' +
               'false#time=custom&start_date=' +
               dateString4(myData.time + 86400) + '&end_date=' +
               dateString4(myData.time + 8 * 86400) + '&values=false&spline=' +
               'false&debug=false&resample=false&sites=one&clouds=all&site=' +
               myData.site + '"><CANVAS ID="cnvs_' + siteMetricOrder[mCnt] +
               '_s5" WIDTH="730" HEIGHT="18"></CANVAS></A>\n';
         } else {
            myTableStr += '   <TD COLSPAN="3"><CANVAS ID="cnvs_' +
               siteMetricOrder[mCnt] + '_s5" WIDTH="730" HEIGHT="18"></CANVA' +
               'S>\n';
         }
      } else if ( siteMetricOrder[mCnt] == "***Othr***" ) {
         // loop over site metrics and write any not in siteMetricOrder:
         for ( var mName in myData.metrics ) {
            if ( siteMetricOrder.indexOf(mName) >= 0 ) {
               continue;
            }
            myTableStr += '<TR>\n   <TD ALIGN="left">' + mName +
               '\n   <TD NOWRAP>&nbsp;\n';
            // following week's, column:
            myTableStr += '   <TD COLSPAN="3"><CANVAS ID="cnvs_' + mName +
               '_s5" WIDTH="730" HEIGHT="18"></CANVAS>\n';
         }
      } else if ( siteMetricOrder[mCnt] == "**Elmnts**" ) {
         // loop over site elements and write the metrics of each:
         for ( var cnt=0; cnt < myData.elements.length; cnt+=1 ) {
            // concatenate host and type excluding domain
            var indx = myData.elements[cnt].host.indexOf('.');
            if ( indx <= 0 ) {
               indx = myData.elements[cnt].host.length;
            }
            var eName = myData.elements[cnt].host.substring(0,indx) + ' / ' +
               myData.elements[cnt].type;

            myTableStr += '<TR>\n   <TD COLSPAN="5" bgcolor="#000000" STYLE=' +
               '"line-height:2px;">&nbsp;\n<TR>\n   <TD COLSPAN="5" bgcolor=' +
               '"#FFFFFF" STYLE="line-height:8px;">&nbsp;\n<TR>\n   <TD COLS' +
               'PAN="5" bgcolor="#FFFFFF" ALIGN="left"><SPAN STYLE="font-siz' +
               'e:large;">' + eName + '</SPAN>\n';
            eName = myData.elements[cnt].host + '/' + myData.elements[cnt].type;
            eName = eName.replace(' ', '');
            // loop over metrics of element:
            for ( var mName in myData.elements[cnt].metrics ) {
               if ( mName in siteMetricLabel ) {
                  myTableStr += '<TR>\n   <TD NOWRAP ALIGN="left"> &nbsp &nb' +
                     'sp ' + siteMetricLabel[mName] +
                     '\n   <TD NOWRAP>&nbsp;\n';
               } else {
                  myTableStr += '<TR>\n   <TD NOWRAP ALIGN="left"> &nbsp &nb' +
                     'sp ' + mName + '\n   <TD NOWRAP>&nbsp;\n';
               }
               if ( mName =="wlcgSAMservice" ) {
                  myTableStr += '   <TD COLSPAN="3"><A HREF="http://wlcg-sam' +
                     '-cms.cern.ch/templates/ember/#/historicalsmry/heatMap?' +
                     'profile=CMS_CRITICAL_FULL&site=' + myData.site + '&hos' +
                     'tname=' + myData.elements[cnt].host + '&start_time=' +
                     dateString3(myData.time + 86400) + ' 00:00&end_time=' +
                     dateString3(myData.time + 8 * 86400) + ' 00:00&time=man' +
                     'ual&view=Test History"><CANVAS ID="cnvs_' + eName + '_' +
                     mName + '_s5" WIDTH="730" HEIGHT="18"></CANVAS></A>\n';
               } else {
                  myTableStr += '   <TD COLSPAN="3"><CANVAS ID="cnvs_' +
                     eName + '_' + mName + '_s5" WIDTH="730" HEIGHT="18">' +
                     '</CANVAS>\n';
               }
            }
         }
      }
   }

   // add a row/line in case there is a message:
   if ( myData.msg != '' ) {
      myTableStr += '<TR>\n   <TD COLSPAN="5" ALIGN="left"><SPAN STYLE="colo' +
         'r:blue; font-weight:bold;">' + siteStatusInfo['msg'] + '</SPAN>\n';
   }

   // compose table trailer:
   myTableStr += '</TABLE>\n';


   // update main DIV section with table:
   document.getElementById("mainDIV").innerHTML = myTableStr;
}

function updateTimestamps() {

   document.getElementById("titleSPAN").innerHTML = myData.site + ' Site Sta' +
      'tus Detail (' + dateString1( myData.time ) + ' GMT)';

   var timeObj = new Date( myData.time * 1000 );
   document.getElementById("legendSPAN").innerHTML =
      timeObj.toLocaleString(window.navigator.language, {weekday: "short",
         year: "numeric", month: "long", day: "numeric", hour: "numeric",
         minute: "2-digit", timeZoneName: "short" });

}

function fillPmonthCanvases() {

   // for the tic length we need to know the weekday:
   var dataDay  = ( new Date(myData.time * 1000) ).getDay();
   var cData;
   var cDom;
   var cCtx;
   var mData;

   // loop over site metrics and for each fill the s1 canvases:
   for ( var mName in myData.metrics ) {

      // s1 canvas, previous month, 120 six-hour/quarter-day entries:
      cData = myData.metrics[mName].pmonth.split("");
      cDom = document.getElementById('cnvs_' + mName + '_s1');
      cCtx = cDom.getContext("2d");
      mData = Math.min(cData.length, cDom.width / 6.50 );
      for ( var qday=0; qday < mData; qday+=1) {
         if ( qday % 4 == 0 ) {
            if ( (dataDay - 38 + Math.trunc(qday/4)) % 7 == 0 ) {
               // full scale tick at the start of the week, Sunday-to-Monday
               cCtx.fillStyle = "#000000";
               cCtx.fillRect(6*qday+2*Math.trunc(qday/4),0,2,18);
            } else {
               // 75% tick at the start of a day
               cCtx.fillStyle = "#000000";
               cCtx.fillRect(6*qday+2*Math.trunc(qday/4),4,2,14);
            }
         }
         switch ( cData[ qday ] ) {
            case "o":
               cCtx.fillStyle = "#80FF80";
               cCtx.fillRect(2+6*qday+2*Math.trunc(qday/4),0,6,18);
               break;
            case "w":
               cCtx.fillStyle = "#FFFF00";
               cCtx.fillRect(2+6*qday+2*Math.trunc(qday/4),0,6,18);
               break;
            case "e":
               cCtx.fillStyle = "#FF0000";
               cCtx.fillRect(2+6*qday+2*Math.trunc(qday/4),0,6,18);
               break;
            case "p":
               cCtx.fillStyle = "#6080FF";
               cCtx.fillRect(2+6*qday+2*Math.trunc(qday/4),0,6,6);
               cCtx.fillRect(2+6*qday+2*Math.trunc(qday/4),12,6,6);
               break;
            case "d":
               cCtx.fillStyle = "#6080FF";
               cCtx.fillRect(2+6*qday+2*Math.trunc(qday/4),0,6,18);
               break;
            case "a":
               cCtx.fillStyle = "#6080FF";
               cCtx.fillRect(2+6*qday+2*Math.trunc(qday/4),0,6,4);
               cCtx.fillRect(2+6*qday+2*Math.trunc(qday/4),6,6,2);
               cCtx.fillRect(2+6*qday+2*Math.trunc(qday/4),10,6,2);
               cCtx.fillRect(2+6*qday+2*Math.trunc(qday/4),14,6,4);
               break;
            case "W":
               cCtx.fillStyle = "#A000A0";
               cCtx.fillRect(2+6*qday+2*Math.trunc(qday/4),0,6,18);
               break;
            case "M":
               cCtx.fillStyle = "#663300";
               cCtx.fillRect(2+6*qday+2*Math.trunc(qday/4),0,6,18);
               break;
            default:
               cCtx.fillStyle = "#F4F4F4";
               cCtx.fillRect(2+6*qday+2*Math.trunc(qday/4),0,6,18);
         }
      }
   }

   // loop over site elements and fill the s1 canvases of each metric:
   for ( var cnt=0; cnt < myData.elements.length; cnt+=1 ) {
      var eName = myData.elements[cnt].host + '/' + myData.elements[cnt].type;
      eName = eName.replace(' ', '');
      // loop over metrics of element:
      for ( var mName in myData.elements[cnt].metrics ) {
         // s2 canvas, previous week, 7*24 one-hour entries:
         cData = myData.elements[cnt].metrics[mName].pmonth.split("");
         cDom = document.getElementById('cnvs_' + eName + '_' + mName + '_s1');
         cCtx = cDom.getContext("2d");
         mData = Math.min(cData.length, cDom.width / 6.50 );
         for ( var qday=0; qday < mData; qday+=1) {
            if ( qday % 4 == 0 ) {
               if ( (dataDay - 38 + Math.trunc(qday/4)) % 7 == 0 ) {
                  // full scale tick at the start of the week, Sunday-to-Monday
                  cCtx.fillStyle = "#000000";
                  cCtx.fillRect(6*qday+2*Math.trunc(qday/4),0,2,18);
               } else {
                  // 75% tick at the start of a day
                  cCtx.fillStyle = "#000000";
                  cCtx.fillRect(6*qday+2*Math.trunc(qday/4),4,2,14);
               }
            }
            switch ( cData[ qday ] ) {
               case "o":
                  cCtx.fillStyle = "#80FF80";
                  cCtx.fillRect(2+6*qday+2*Math.trunc(qday/4),0,6,18);
                  break;
               case "w":
                  cCtx.fillStyle = "#FFFF00";
                  cCtx.fillRect(2+6*qday+2*Math.trunc(qday/4),0,6,18);
                  break;
               case "e":
                  cCtx.fillStyle = "#FF0000";
                  cCtx.fillRect(2+6*qday+2*Math.trunc(qday/4),0,6,18);
                  break;
               case "p":
                  cCtx.fillStyle = "#6080FF";
                  cCtx.fillRect(2+6*qday+2*Math.trunc(qday/4),0,6,6);
                  cCtx.fillRect(2+6*qday+2*Math.trunc(qday/4),12,6,6);
                  break;
               case "d":
                  cCtx.fillStyle = "#6080FF";
                  cCtx.fillRect(2+6*qday+2*Math.trunc(qday/4),0,6,18);
                  break;
               case "a":
                  cCtx.fillStyle = "#6080FF";
                  cCtx.fillRect(2+6*qday+2*Math.trunc(qday/4),0,6,4);
                  cCtx.fillRect(2+6*qday+2*Math.trunc(qday/4),6,6,2);
                  cCtx.fillRect(2+6*qday+2*Math.trunc(qday/4),10,6,2);
                  cCtx.fillRect(2+6*qday+2*Math.trunc(qday/4),14,6,4);
                  break;
               case "W":
                  cCtx.fillStyle = "#A000A0";
                  cCtx.fillRect(2+6*qday+2*Math.trunc(qday/4),0,6,18);
                  break;
               case "M":
                  cCtx.fillStyle = "#663300";
                  cCtx.fillRect(2+6*qday+2*Math.trunc(qday/4),0,6,18);
                  break;
               default:
                  cCtx.fillStyle = "#F4F4F4";
                  cCtx.fillRect(2+6*qday+2*Math.trunc(qday/4),0,6,18);
            }
         }
      }
   }
}

function fillPweekCanvases() {

   // for the tic length we need to know the weekday:
   var dataDay  = ( new Date(myData.time * 1000) ).getDay();
   var cData;
   var cDom;
   var cCtx;
   var mData;

   // loop over site metrics and for each fill the s2 canvases:
   for ( var mName in myData.metrics ) {

      // s2 canvas, previous week, 7*24 one-hour entries:
      cData = myData.metrics[mName].pweek.split("");
      cDom = document.getElementById('cnvs_' + mName + '_s2');
      cCtx = cDom.getContext("2d");
      mData = Math.min(cData.length, cDom.width / 4.33 );
      for ( var hour=0; hour < mData; hour+=1) {
         if ( hour % 24 == 0 ) {
            if ( (dataDay - 8 + Math.trunc(hour/24)) % 7 == 0 ) {
               cCtx.fillStyle = "#000000";
               cCtx.fillRect(4*hour+2*Math.trunc(hour/6),0,2,18);
            } else {
               cCtx.fillStyle = "#000000";
               cCtx.fillRect(4*hour+2*Math.trunc(hour/6),4,2,14);
            }
         } else if ( hour % 6 == 0 ) {
            // 50% tick at the start of a six-hour/quarter-day period
            cCtx.fillStyle = "#000000";
            cCtx.fillRect(4*hour+2*Math.trunc(hour/6),9,2,9);
         }
         switch ( cData[ hour ] ) {
            case "o":
               cCtx.fillStyle = "#80FF80";
               cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
               break;
            case "w":
               cCtx.fillStyle = "#FFFF00";
               cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
               break;
            case "e":
               cCtx.fillStyle = "#FF0000";
               cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
               break;
            case "p":
               cCtx.fillStyle = "#6080FF";
               cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,6);
               cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),12,4,6);
               break;
            case "d":
               cCtx.fillStyle = "#6080FF";
               cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
               break;
            case "a":
               cCtx.fillStyle = "#6080FF";
               cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,4);
               cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),6,4,2);
               cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),10,4,2);
               cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),14,4,4);
               break;
            case "W":
               cCtx.fillStyle = "#A000A0";
               cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
               break;
            case "M":
               cCtx.fillStyle = "#663300";
               cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
               break;
            default:
               cCtx.fillStyle = "#F4F4F4";
               cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
         }
      }
   }

   // loop over site elements and fill the s2 canvases of each metric:
   for ( var cnt=0; cnt < myData.elements.length; cnt+=1 ) {
      var eName = myData.elements[cnt].host + '/' + myData.elements[cnt].type;
      eName = eName.replace(' ', '');
      // loop over metrics of element:
      for ( var mName in myData.elements[cnt].metrics ) {
         // s2 canvas, previous week, 7*24 one-hour entries:
         cData = myData.elements[cnt].metrics[mName].pweek.split("");
         cDom = document.getElementById('cnvs_' + eName + '_' + mName + '_s2');
         cCtx = cDom.getContext("2d");
         mData = Math.min(cData.length, cDom.width / 4.33 );
         for ( var hour=0; hour < mData; hour+=1) {
            if ( hour % 24 == 0 ) {
               if ( (dataDay - 8 + Math.trunc(hour/24)) % 7 == 0 ) {
                  cCtx.fillStyle = "#000000";
                  cCtx.fillRect(4*hour+2*Math.trunc(hour/6),0,2,18);
               } else {
                  cCtx.fillStyle = "#000000";
                  cCtx.fillRect(4*hour+2*Math.trunc(hour/6),4,2,14);
               }
            } else if ( hour % 6 == 0 ) {
               // 50% tick at the start of a six-hour/quarter-day period
               cCtx.fillStyle = "#000000";
               cCtx.fillRect(4*hour+2*Math.trunc(hour/6),9,2,9);
            }
            switch ( cData[ hour ] ) {
               case "o":
                  cCtx.fillStyle = "#80FF80";
                  cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
                  break;
               case "w":
                  cCtx.fillStyle = "#FFFF00";
                  cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
                  break;
               case "e":
                  cCtx.fillStyle = "#FF0000";
                  cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
                  break;
               case "p":
                  cCtx.fillStyle = "#6080FF";
                  cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,6);
                  cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),12,4,6);
                  break;
               case "d":
                  cCtx.fillStyle = "#6080FF";
                  cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
                  break;
               case "a":
                  cCtx.fillStyle = "#6080FF";
                  cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,4);
                  cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),6,4,2);
                  cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),10,4,2);
                  cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),14,4,4);
                  break;
               case "W":
                  cCtx.fillStyle = "#A000A0";
                  cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
                  break;
               case "M":
                  cCtx.fillStyle = "#663300";
                  cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
                  break;
               default:
                  cCtx.fillStyle = "#F4F4F4";
                  cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
            }
         }
      }
   }
}

function fillYesterdayCanvases() {

   // for the tic length we need to know the weekday:
   var dataDay  = ( new Date(myData.time * 1000) ).getDay();
   var cData;
   var cDom;
   var cCtx;
   var mData;

   // loop over site metrics and for each fill the s3 canvases:
   for ( var mName in myData.metrics ) {

      // s3 canvas, yesterday, 24*4 quarter-hour entries:
      cData = myData.metrics[mName].yesterday.split("");
      cDom = document.getElementById('cnvs_' + mName + '_s3');
      cCtx = cDom.getContext("2d");
      mData = Math.min(cData.length, cDom.width / 6.50 );
      for ( var qhour=0; qhour < mData; qhour+=1) {
         if ( qhour == 0 ) {
            if ( dataDay % 7 == 0 ) {
               cCtx.fillStyle = "#000000";
               cCtx.fillRect(6*qhour+2*Math.trunc(qhour/4),0,2,18);
            } else {
               cCtx.fillStyle = "#000000";
               cCtx.fillRect(6*qhour+2*Math.trunc(qhour/4),4,2,14);
            }
         } else if ( qhour % 24 == 0 ) {
            cCtx.fillStyle = "#000000";
            cCtx.fillRect(6*qhour+2*Math.trunc(qhour/4),9,2,9);
         } else if ( qhour % 4 == 0 ) {
            cCtx.fillStyle = "#000000";
            cCtx.fillRect(6*qhour+2*Math.trunc(qhour/4),14,2,4);
         }
         switch ( cData[ qhour ] ) {
            case "o":
               cCtx.fillStyle = "#80FF80";
               cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
               break;
            case "w":
               cCtx.fillStyle = "#FFFF00";
               cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
               break;
            case "e":
               cCtx.fillStyle = "#FF0000";
               cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
               break;
            case "p":
               cCtx.fillStyle = "#6080FF";
               cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,6);
               cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),12,6,6);
               break;
            case "d":
               cCtx.fillStyle = "#6080FF";
               cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
               break;
            case "a":
               cCtx.fillStyle = "#6080FF";
               cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,4);
               cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),6,6,2);
               cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),10,6,2);
               cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),14,6,4);
               break;
            case "W":
               cCtx.fillStyle = "#A000A0";
               cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
               break;
            case "M":
               cCtx.fillStyle = "#663300";
               cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
               break;
            default:
               cCtx.fillStyle = "#F4F4F4";
               cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
         }
      }
   }

   // loop over site elements and fill the s3 canvases of each metric:
   for ( var cnt=0; cnt < myData.elements.length; cnt+=1 ) {
      var eName = myData.elements[cnt].host + '/' + myData.elements[cnt].type;
      eName = eName.replace(' ', '');
      // loop over metrics of element:
      for ( var mName in myData.elements[cnt].metrics ) {
         // s3 canvas, yesterday, 24*4 quarter-hour entries:
         cData = myData.elements[cnt].metrics[mName].yesterday.split("");
         cDom = document.getElementById('cnvs_' + eName + '_' + mName + '_s3');
         cCtx = cDom.getContext("2d");
         mData = Math.min(cData.length, cDom.width / 6.50 );
         for ( var qhour=0; qhour < mData; qhour+=1) {
            if ( qhour == 0 ) {
               if ( dataDay % 7 == 0 ) {
                  cCtx.fillStyle = "#000000";
                  cCtx.fillRect(6*qhour+2*Math.trunc(qhour/4),0,2,18);
               } else {
                  cCtx.fillStyle = "#000000";
                  cCtx.fillRect(6*qhour+2*Math.trunc(qhour/4),4,2,14);
               }
            } else if ( qhour % 24 == 0 ) {
               cCtx.fillStyle = "#000000";
               cCtx.fillRect(6*qhour+2*Math.trunc(qhour/4),9,2,9);
            } else if ( qhour % 4 == 0 ) {
               cCtx.fillStyle = "#000000";
               cCtx.fillRect(6*qhour+2*Math.trunc(qhour/4),14,2,4);
            }
            switch ( cData[ qhour ] ) {
               case "o":
                  cCtx.fillStyle = "#80FF80";
                  cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
                  break;
               case "w":
                  cCtx.fillStyle = "#FFFF00";
                  cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
                  break;
               case "e":
                  cCtx.fillStyle = "#FF0000";
                  cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
                  break;
               case "p":
                  cCtx.fillStyle = "#6080FF";
                  cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,6);
                  cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),12,6,6);
                  break;
               case "d":
                  cCtx.fillStyle = "#6080FF";
                  cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
                  break;
               case "a":
                  cCtx.fillStyle = "#6080FF";
                  cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,4);
                  cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),6,6,2);
                  cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),10,6,2);
                  cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),14,6,4);
                  break;
               case "W":
                  cCtx.fillStyle = "#A000A0";
                  cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
                  break;
               case "M":
                  cCtx.fillStyle = "#663300";
                  cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
                  break;
               default:
                  cCtx.fillStyle = "#F4F4F4";
                  cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
            }
         }
      }
   }
}

function fillTodayCanvases() {

   // for the tic length we need to know the weekday:
   var dataDay  = ( new Date(myData.time * 1000) ).getDay();
   var cData;
   var cDom;
   var cCtx;
   var mData;

   // loop over site metrics and for each fill the s4 canvases:
   for ( var mName in myData.metrics ) {

      // s4 canvas, today, 24*4 quarter-hour entries:
      cData = myData.metrics[mName].today.split("");
      cDom = document.getElementById('cnvs_' + mName + '_s4');
      cCtx = cDom.getContext("2d");
      mData = Math.min(cData.length, cDom.width / 6.50 );
      for ( var qhour=0; qhour < mData; qhour+=1) {
         if ( qhour == 0 ) {
            if ( dataDay % 7 == 0 ) {
               cCtx.fillStyle = "#000000";
               cCtx.fillRect(6*qhour+2*Math.trunc(qhour/4),0,2,18);
            } else {
               cCtx.fillStyle = "#000000";
               cCtx.fillRect(6*qhour+2*Math.trunc(qhour/4),4,2,14);
            }
         } else if ( qhour % 24 == 0 ) {
            cCtx.fillStyle = "#000000";
            cCtx.fillRect(6*qhour+2*Math.trunc(qhour/4),9,2,9);
         } else if ( qhour % 4 == 0 ) {
            cCtx.fillStyle = "#000000";
            cCtx.fillRect(6*qhour+2*Math.trunc(qhour/4),14,2,4);
         }
         switch ( cData[ qhour ] ) {
            case "o":
               cCtx.fillStyle = "#80FF80";
               cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
               break;
            case "w":
               cCtx.fillStyle = "#FFFF00";
               cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
               break;
            case "e":
               cCtx.fillStyle = "#FF0000";
               cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
               break;
            case "p":
               cCtx.fillStyle = "#6080FF";
               cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,6);
               cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),12,6,6);
               break;
            case "d":
               cCtx.fillStyle = "#6080FF";
               cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
               break;
            case "a":
               cCtx.fillStyle = "#6080FF";
               cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,4);
               cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),6,6,2);
               cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),10,6,2);
               cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),14,6,4);
               break;
            case "W":
               cCtx.fillStyle = "#A000A0";
               cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
               break;
            case "M":
               cCtx.fillStyle = "#663300";
               cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
               break;
            default:
               cCtx.fillStyle = "#F4F4F4";
               cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
         }
      }
   }

   // loop over site elements and fill the s4 canvases of each metric:
   for ( var cnt=0; cnt < myData.elements.length; cnt+=1 ) {
      var eName = myData.elements[cnt].host + '/' + myData.elements[cnt].type;
      eName = eName.replace(' ', '');
      // loop over metrics of element:
      for ( var mName in myData.elements[cnt].metrics ) {
         // s4 canvas, today, 24*4 quarter-hour entries:
         cData = myData.elements[cnt].metrics[mName].today.split("");
         cDom = document.getElementById('cnvs_' + eName + '_' + mName + '_s4');
         cCtx = cDom.getContext("2d");
         mData = Math.min(cData.length, cDom.width / 6.50 );
         for ( var qhour=0; qhour < mData; qhour+=1) {
            if ( qhour == 0 ) {
               if ( dataDay % 7 == 0 ) {
                  cCtx.fillStyle = "#000000";
                  cCtx.fillRect(6*qhour+2*Math.trunc(qhour/4),0,2,18);
               } else {
                  cCtx.fillStyle = "#000000";
                  cCtx.fillRect(6*qhour+2*Math.trunc(qhour/4),4,2,14);
               }
            } else if ( qhour % 24 == 0 ) {
               cCtx.fillStyle = "#000000";
               cCtx.fillRect(6*qhour+2*Math.trunc(qhour/4),9,2,9);
            } else if ( qhour % 4 == 0 ) {
               cCtx.fillStyle = "#000000";
               cCtx.fillRect(6*qhour+2*Math.trunc(qhour/4),14,2,4);
            }
            switch ( cData[ qhour ] ) {
               case "o":
                  cCtx.fillStyle = "#80FF80";
                  cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
                  break;
               case "w":
                  cCtx.fillStyle = "#FFFF00";
                  cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
                  break;
               case "e":
                  cCtx.fillStyle = "#FF0000";
                  cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
                  break;
               case "p":
                  cCtx.fillStyle = "#6080FF";
                  cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,6);
                  cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),12,6,6);
                  break;
               case "d":
                  cCtx.fillStyle = "#6080FF";
                  cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
                  break;
               case "a":
                  cCtx.fillStyle = "#6080FF";
                  cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,4);
                  cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),6,6,2);
                  cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),10,6,2);
                  cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),14,6,4);
                  break;
               case "W":
                  cCtx.fillStyle = "#A000A0";
                  cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
                  break;
               case "M":
                  cCtx.fillStyle = "#663300";
                  cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
                  break;
               default:
                  cCtx.fillStyle = "#F4F4F4";
                  cCtx.fillRect(2+6*qhour+2*Math.trunc(qhour/4),0,6,18);
            }
         }
      }
   }
}

function fillFweekCanvases() {

   // for the tic length we need to know the weekday:
   var dataDay  = ( new Date(myData.time * 1000) ).getDay();
   var cData;
   var cDom;
   var cCtx;
   var mData;

   // loop over site metrics and for each fill the s5 canvases:
   for ( var mName in myData.metrics ) {

      // s5 canvas, following week, 7*24 one-hour entries:
      cData = myData.metrics[mName].fweek.split("");
      cDom = document.getElementById('cnvs_' + mName + '_s5');
      cCtx = cDom.getContext("2d");
      mData = Math.min(cData.length, cDom.width / 4.33 );
      for ( var hour=0; hour < mData; hour+=1) {
         if ( hour % 24 == 0 ) {
            if ( (dataDay - 8 + Math.trunc(hour/24)) % 7 == 0 ) {
               cCtx.fillStyle = "#000000";
               cCtx.fillRect(4*hour+2*Math.trunc(hour/6),0,2,18);
            } else {
               cCtx.fillStyle = "#000000";
               cCtx.fillRect(4*hour+2*Math.trunc(hour/6),4,2,14);
            }
         } else if ( hour % 6 == 0 ) {
            // 50% tick at the start of a six-hour/quarter-day period
            cCtx.fillStyle = "#000000";
            cCtx.fillRect(4*hour+2*Math.trunc(hour/6),9,2,9);
         }
         switch ( cData[ hour ] ) {
            case "o":
               cCtx.fillStyle = "#80FF80";
               cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
               break;
            case "w":
               cCtx.fillStyle = "#FFFF00";
               cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
               break;
            case "e":
               cCtx.fillStyle = "#FF0000";
               cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
               break;
            case "p":
               cCtx.fillStyle = "#6080FF";
               cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,6);
               cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),12,4,6);
               break;
            case "d":
               cCtx.fillStyle = "#6080FF";
               cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
               break;
            case "a":
               cCtx.fillStyle = "#6080FF";
               cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,4);
               cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),6,4,2);
               cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),10,4,2);
               cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),14,4,4);
               break;
            case "W":
               cCtx.fillStyle = "#A000A0";
               cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
               break;
            case "M":
               cCtx.fillStyle = "#663300";
               cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
               break;
            default:
               cCtx.fillStyle = "#F4F4F4";
               cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
         }
      }
   }

   // loop over site elements and fill the s5 canvases of each metric:
   for ( var cnt=0; cnt < myData.elements.length; cnt+=1 ) {
      var eName = myData.elements[cnt].host + '/' + myData.elements[cnt].type;
      eName = eName.replace(' ', '');
      // loop over metrics of element:
      for ( var mName in myData.elements[cnt].metrics ) {
         // s5 canvas, following week, 7*24 one-hour entries:
         cData = myData.elements[cnt].metrics[mName].fweek.split("");
         cDom = document.getElementById('cnvs_' + eName + '_' + mName + '_s5');
         cCtx = cDom.getContext("2d");
         mData = Math.min(cData.length, cDom.width / 4.33 );
         for ( var hour=0; hour < mData; hour+=1) {
            if ( hour % 24 == 0 ) {
               if ( (dataDay - 8 + Math.trunc(hour/24)) % 7 == 0 ) {
                  cCtx.fillStyle = "#000000";
                  cCtx.fillRect(4*hour+2*Math.trunc(hour/6),0,2,18);
               } else {
                  cCtx.fillStyle = "#000000";
                  cCtx.fillRect(4*hour+2*Math.trunc(hour/6),4,2,14);
               }
            } else if ( hour % 6 == 0 ) {
               // 50% tick at the start of a six-hour/quarter-day period
               cCtx.fillStyle = "#000000";
               cCtx.fillRect(4*hour+2*Math.trunc(hour/6),9,2,9);
            }
            switch ( cData[ hour ] ) {
               case "o":
                  cCtx.fillStyle = "#80FF80";
                  cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
                  break;
               case "w":
                  cCtx.fillStyle = "#FFFF00";
                  cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
                  break;
               case "e":
                  cCtx.fillStyle = "#FF0000";
                  cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
                  break;
               case "p":
                  cCtx.fillStyle = "#6080FF";
                  cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,6);
                  cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),12,4,6);
                  break;
               case "d":
                  cCtx.fillStyle = "#6080FF";
                  cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
                  break;
               case "a":
                  cCtx.fillStyle = "#6080FF";
                  cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,4);
                  cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),6,4,2);
                  cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),10,4,2);
                  cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),14,4,4);
                  break;
               case "W":
                  cCtx.fillStyle = "#A000A0";
                  cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
                  break;
               case "M":
                  cCtx.fillStyle = "#663300";
                  cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
                  break;
               default:
                  cCtx.fillStyle = "#F4F4F4";
                  cCtx.fillRect(2+4*hour+2*Math.trunc(hour/6),0,4,18);
            }
         }
      }
   }
}

function fillLegend() {
   var cCtx;

   cCtx = document.getElementById('cnvs_lgn_Ok').getContext('2d');
   cCtx.fillStyle = "#80FF80";
   cCtx.fillRect(0,0,6,18);
   cCtx = document.getElementById('cnvs_lgn_PartDowntime').getContext('2d');
   cCtx.fillStyle = "#6080FF";
   cCtx.fillRect(0,0,6,6);
   cCtx.fillRect(0,12,6,6);
   cCtx = document.getElementById('cnvs_lgn_WaitingRoom').getContext('2d');
   cCtx.fillStyle = "#A000A0";
   cCtx.fillRect(0,0,6,18);
   cCtx = document.getElementById('cnvs_lgn_Warning').getContext('2d');
   cCtx.fillStyle = "#FFFF00";
   cCtx.fillRect(0,0,6,18);
   cCtx = document.getElementById('cnvs_lgn_FullDowntime').getContext('2d');
   cCtx.fillStyle = "#6080FF";
   cCtx.fillRect(0,0,6,18);
   cCtx = document.getElementById('cnvs_lgn_Morgue').getContext('2d');
   cCtx.fillStyle = "#663300";
   cCtx.fillRect(0,0,6,18);
   cCtx = document.getElementById('cnvs_lgn_Error').getContext('2d');
   cCtx.fillStyle = "#FF0000";
   cCtx.fillRect(0,0,6,18);
   cCtx = document.getElementById('cnvs_lgn_AdhocDowntime').getContext('2d');
   cCtx.fillStyle = "#6080FF";
   cCtx.fillRect(0,0,6,4);
   cCtx.fillRect(0,6,6,2);
   cCtx.fillRect(0,10,6,2);
   cCtx.fillRect(0,14,6,4);
   cCtx = document.getElementById('cnvs_lgn_Unknown').getContext('2d');
   cCtx.fillStyle = "#F4F4F4";
   cCtx.fillRect(0,0,6,18);
}
