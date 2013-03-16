#!/usr/bin/env node

var fs = require('fs');
var version = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version
var data = require('../data');
var request = require('request');
var filename = require('../lib/filename');

var opt = require('optimist')
    .usage('jQuery Builder '+ version +'\nUsage: $0')
    .options('e', {
      alias: 'exclude',
      describe: 'Modules to exclude [module,module]',
      type: 'string'
    })
    .option('m', {
      alias: 'minify',
      describe: 'Minify output',
      type: 'boolean'
    })
    .options('l', {
      alias: 'ls',
      describe: 'List available modules',
      type: 'boolean'
    })
    .options('v', {
      alias: 'version',
      describe: 'Version of jQuery',
      type: 'string',
      default: '1.9.1'
    })
    .options('s', {
      alias: 'versions',
      describe: 'List available versions'
    })
    .options('h', {
      alias: 'help',
      descripe: 'Show help info'
    });

var argv = opt.argv;

if (argv.help) {
  return opt.showHelp();
}

if (argv.ls) {
  var comp = data.modules;
  console.log('Modules:');
  comp.forEach(function(c) {
    console.log(c);
  });
  return;
}

if (argv.versions) {
  console.log('Versions:');
  data.versions.forEach(function(v) {
    console.log(v);
  });
  return;
}

var exclude = (argv.exclude) ? argv.exclude.split(',') : undefined;

var file = filename(exclude, argv.minify);
var url = 'https://raw.github.com/jgallen23/jquery-builder/gh-pages/dist/'+argv.version+'/'+file;
request.get(url, function(err, response, body) {
  if (err) {
    throw err;
  }
  process.stdout.write(body);
});

