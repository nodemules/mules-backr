{
  const backup = require('s3-mongo-backup');
  const config = require('./config.js');
  const CronJob = require('cron').CronJob;
  const db = config.mongo;
  const bucket = config.bucket;

  console.log('Starting Mules Backup Service');

  const backupConfig = {
    mongodb: `mongodb://${db.user}:${db.key}@${db.host}:${db.port}/${db.name}`, // MongoDB Connection URI
    s3: {
      accessKey: bucket.accessKey, //AccessKey
      secretKey: bucket.secretKey, //SecretKey
      region: bucket.region, //S3 Bucket Region
      accessPerm: 'private', //S3 Bucket Privacy, Since, You'll be storing Database, Private is HIGHLY Recommended
      bucketName: bucket.name //Bucket Name
    },
    keepLocalBackups: false,
    timezoneOffset: config.timezoneOffset
  };
  new CronJob(config.backupTime, function() {
    console.log('Starting Backup at' + new Date());
    backup(backupConfig).then(() => {
      console.log('Successful Backup for ' + new Date());
    }, (err) => {
      console.log('There was an error backing up data on ' + new Date());
      console.log(err);
    });

  }, null, true, 'America/New_York');

}
