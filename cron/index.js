/**
 * File: index
 * Created by zouyi on 2017/1/28.
 */
var CronJob = require('cron').CronJob;
var job = require('../bin/index').default;
var jobs = [
  /**
   Seconds: 0-59
   Minutes: 0-59
   Hours: 0-23
   Day of Month: 1-31
   Months: 0-11
   Day of Week: 0-6
   */
  // 秒 分 时 日期 月份 周
  {'cronTime': '00 01 * * * *', 'onTick': job.searchTopUser},
  {'cronTime': '00 01 * * * *', 'onTick': job.searchChinaUser},
  {'cronTime': '00 01 * * * *', 'onTick': job.searchChinaPHPUser},
  {'cronTime': '00 01 * * * *', 'onTick': job.searchTopOrg},
  {'cronTime': '00 01 * * * *', 'onTick': job.searchChinaOrg},
  {'cronTime': '00 01 * * * *', 'onTick': job.searchChinaPHPOrg},
  {'cronTime': '00 01 * * * *', 'onTick': job.searchTopRepo},
  {'cronTime': '00 01 * * * *', 'onTick': job.searchPHPRepo},
  {'cronTime': '00 01 * * * *', 'onTick': job.searchJSRepo},
]

for (var i = 0; i < jobs.length; i++) {
  var work = jobs[i];
  (new CronJob({cronTime: work['cronTime'], onTick: work['onTick'], start: false, timeZone: 'PRC'})).start();
}