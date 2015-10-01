# grunt-beanstalk

> Elastic Beanstalk integration with grunt

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-beanstalk --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-beanstalk');
```

## The "beanstalk" task

### Overview
In your project's Gruntfile, add a section named `beanstalk` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  beanstalk: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.upload
Type: `Boolean`
Default value: `true`

Whether to upload a new application version

#### options.deploy
Type: `Boolean`
Default value: `false`

Whether to deploy the new application version to an environment

#### options.source
Type: `String`

The location of the zip file to upload

#### options.aws.accessKeyId
Type: `String`

The AWS access key

#### options.aws.secretKey
Type: `String`

The AWS secret key

#### options.aws.region
Type: `String`
Default value: `us-east-1`

The AWS region

#### options.s3.Bucket
Type: `String`

The AWS S3 bucket to upload the new version to

#### options.s3.Key
Type: `String`

The path inside the S3 bucket to store the new application to

#### options.eb.ApplicationName
Type: `String`

The name of the AWS Elastic Beanstalk application

#### options.eb.VersionLabel
Type: `String`

The label for the new application version

#### options.eb.EnvironmentName
Type: `String`

The name of the AWS Elastic Beanstalk environment to update

### Usage Examples

#### Upload only

```js
var now = new Date().getTime();
grunt.initConfig({
  beanstalk: {
    options: {
      source: "dist/myapp.zip",
      aws: {
        accessKeyId: 'AKIAXXXXXXXXXXXXXX',
        secretAccessKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        region: 'eu-west-1'
      },
      s3: {
        Bucket: "my-elastic-beanstalk-apps",
        Key: "myapp-" + now + ".zip",
      },
      eb: {
        ApplicationName: "My App",
        VersionLabel: "myapp-" + now
      }
    }
  }
});
```

#### Upload and deploy

```js
var now = new Date().getTime();
grunt.initConfig({
  beanstalk: {
    options: {
      deploy: true,
      source: "dist/myapp.zip",
      aws: {
        accessKeyId: 'AKIAXXXXXXXXXXXXXX',
        secretAccessKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        region: 'eu-west-1'
      },
      s3: {
        Bucket: "my-elastic-beanstalk-apps",
        Key: "myapp-" + now + ".zip",
      },
      eb: {
        ApplicationName: "My App",
        EnvironmentName: "myapp-dev",
        VersionLabel: "myapp-" + now
      }
    }
  }
});
```

#### Upload and deploy as seperate tasks

```js
var now = new Date().getTime();
grunt.initConfig({
  beanstalk: {
    options: {
      source: "dist/myapp.zip",
      aws: {
        accessKeyId: 'AKIAXXXXXXXXXXXXXX',
        secretAccessKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        region: 'eu-west-1'
      },
      s3: {
        Bucket: "my-elastic-beanstalk-apps",
        Key: "myapp-" + now + ".zip",
      },
      eb: {
        ApplicationName: "My App",
        EnvironmentName: "myapp-dev",
        VersionLabel: "myapp-" + now
      }
    },
    upload: {
      upload: true,
      deploy: false
    },
    deploy: {
      upload: false,
      deploy:true
    }
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
