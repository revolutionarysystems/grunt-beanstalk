/*
 * grunt-beanstalk
 * https://github.com/revolutionarysystems/grunt-beanstalk
 *
 * Copyright (c) 2015 Adam Knight
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var async = require('async');
var AWS = require('aws-sdk');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('beanstalk', 'Elastic Beanstalk integration with grunt', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      upload: true,
      deploy: false
    });

    if (options.upload) {
      if (!options.source) throw grunt.util.error("Required config property 'source' missing");
      if (!options.s3) throw grunt.util.error("Required config property 's3' missing");
      if (!options.s3.Bucket) throw grunt.util.error("Required config property 's3.Bucket' missing");
      if (!options.s3.Key) throw grunt.util.error("Required config property 's3.Key' missing");
      if (!options.eb) throw grunt.util.error("Required config property 'eb' missing");
      if (!options.eb.ApplicationName) throw grunt.util.error("Required config property 'eb.ApplicationName' missing");
      if (!options.eb.VersionLabel) throw grunt.util.error("Required config property 'eb.VersionLabel' missing");
    }
    if (options.deploy) {
      if (!options.eb) throw grunt.util.error("Required config property 'eb' missing");
      if (!options.eb.EnvironmentName) throw grunt.util.error("Required config property 'eb.EnvironmentName' missing");
      if (!options.eb.VersionLabel) throw grunt.util.error("Required config property 'eb.VersionLabel' missing");
    }

    var done = this.async();

    var s3 = new AWS.S3(options.aws || {});
    var eb = new AWS.ElasticBeanstalk(options.aws || {});

    async.series([function(done) {
      if (options.upload) {
        async.waterfall([function(done) {
          var sourcePath = options.source;
          grunt.log.writeln('Reading ' + sourcePath);
          fs.readFile(sourcePath, done);
        }, function(source, done) {
          grunt.log.writeln('Uploading to ' + options.s3.Bucket + "/" + options.s3.Key);
          var s3Params = options.s3;
          s3Params.ContentType = "application/octet-stream";
          s3Params.Body = source;
          s3.putObject(s3Params, done);
        }, function(data, done) {
          grunt.log.writeln('Creating version ' + options.eb.VersionLabel + ' for ' + options.eb.ApplicationName);
          eb.createApplicationVersion({
            ApplicationName: options.eb.ApplicationName,
            VersionLabel: options.eb.VersionLabel,
            SourceBundle: {
              S3Bucket: options.s3.Bucket,
              S3Key: options.s3.Key
            }
          }, done);
        }], done);
      }else{
        done();
      }
    }, function(done) {
      if (options.deploy) {
        grunt.log.writeln('Updating environment ' + options.eb.EnvironmentName + ' with version ' + options.eb.VersionLabel);
        eb.updateEnvironment({
          EnvironmentName: options.eb.EnvironmentName,
          VersionLabel: options.eb.VersionLabel
        }, function(err, data) {
          if(!err) grunt.log.writeln('Environment update running, please check AWS console for progress');
          done(err);
        });
      } else {
        done();
      }
    }], function(err) {
      done(err);
    });
  });

};