module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  //grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-recess');
  //grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-compress');

  // Default task.
  /*
  grunt.registerTask('default', ['jshint','build','karma:unit']);
  grunt.registerTask('build', ['clean','html2js','concat','recess:build','copy:assets']);
  grunt.registerTask('release', ['clean','html2js','uglify','jshint','karma:unit','concat:index', 'recess:min','copy:assets']);
  grunt.registerTask('test-watch', ['karma:watch']);
  */
  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['clean','html2js','concat', 'recess:build', 'uglify', 'copy']);
  //grunt.registerTask('deploy', ['copy:dist']);



  // Print a timestamp (useful for when watching)
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  var karmaConfig = function(configFile, customOptions) {
    var options = { configFile: configFile, keepalive: true };
    var travisOptions = process.env.TRAVIS && { browsers: ['Firefox'], reporters: 'dots' };
    return grunt.util._.extend(options, customOptions, travisOptions);
  };

  // Project configuration.
  grunt.initConfig({
    distdir: 'dist',
    pkg: grunt.file.readJSON('package.json'),
    banner:
    '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n' +
    '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
    ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
    src: {
      js: ['src/**/*.js'],
      jsTpl: ['<%= distdir %>/templates/**/*.js'],
      specs: ['test/**/*.spec.js'],
      scenarios: ['test/**/*.scenario.js'],
      html: ['src/index.html'],
      tpl: {
        app: ['src/app/**/*.tpl.html'],
        common: ['src/common/**/*.tpl.html']
      },
      css: ['src/**/*.css'],
      less: ['src/style/theme.less'], // recess:build doesn't accept ** in its file patterns
      lessWatch: ['src/less/**/*.less']
    },
    clean: ['<%= distdir %>/*'],
    copy: {
      assets: {
        files: [{ dest: '<%= distdir %>', src : '**', expand: true, cwd: 'src/assets/' }]
      },
      views: {
        files: [{ dest: '<%= distdir %>/partials', src : '**', expand: true, cwd: 'src/views/' }]
      },
      css:{
        files: [{ dest: '<%= distdir %>/css/iframe.css', src : 'src/style/iframe.css' }]
      }
    },
    karma: {
      unit: { options: karmaConfig('test/config/unit.js') },
      watch: { options: karmaConfig('test/config/unit.js', { singleRun:false, autoWatch: true}) }
    },
    html2js: {
      app: {
        options: {
          base: 'src/app'
        },
        src: ['<%= src.tpl.app %>'],
        dest: '<%= distdir %>/templates/app.js',
        module: 'templates.app'
      },
      common: {
        options: {
          base: 'src/common'
        },
        src: ['<%= src.tpl.common %>'],
        dest: '<%= distdir %>/templates/common.js',
        module: 'templates.common'
      }
    },
    concat:{
      distMock:{
        options: {
          banner: "<%= banner %>"
        },
        src:['**/app.js', '<%= src.js %>', '<%= src.jsTpl %>', '!**/MceUtilService.js', '!**/MceNearoService.js', '!**/MceToolService.js', '!**/MceLanguageService.js'],
        dest:'<%= distdir %>/<%= pkg.name %>-mock.js'
      },
      dist:{
        options: {
          banner: "<%= banner %>"
        },
        src:['**/app.js', '<%= src.js %>', '<%= src.jsTpl %>', '!**/*Mock.js'],
        dest:'<%= distdir %>/<%= pkg.name %>.js'
      },      
      index: {
        src: ['src/index.html'],
        dest: '<%= distdir %>/index.html',
        options: {
          process: true
        }
      },
      css:{
        options: {
          banner: "<%= banner %>"
        },
        src:['<%= src.css %>', '!**/theme.css' , '!**/iframe.css'],
        dest:'<%= distdir %>/css/<%= pkg.name %>.css'
      },
      // angular: {
      //   src:['vendor/angular/angular.js', 'vendor/angular/angular-route.js', 'vendor/ui-bootstrap/ui-bootstrap-tpls-0.6.0.js', 'vendor/angular-gettext/angular-gettext.js'],
      //   dest: '<%= distdir %>/angular.js'
      // },
      // jquery: {
      //   src:['vendor/jquery/*.js'],
      //   dest: '<%= distdir %>/jquery.js'
      // },
      // bootstrap_js: {
      //   src:['vendor/bootstrap/**/bootstrap.js'],
      //   dest: '<%= distdir %>/bootstrap.js'
      // },
      common_css: {
        src:['vendor/bootstrap/css/bootstrap.css'],
        dest: '<%= distdir %>/css/common.css'
      },            
      common_js: {
        src:['vendor/jquery/*.js', 'vendor/bootstrap/**/bootstrap.js', 'vendor/angular/angular.js', 'vendor/angular/angular-route.js'],
        dest: '<%= distdir %>/common.js'        
      }     
    },
    uglify: {
      app:{
        options: {
          banner: "<%= banner %>"
        },
        src:['<%= distdir %>/<%= pkg.name %>.js'],
        dest:'<%= distdir %>/<%= pkg.name %>.min.js'
      },
      common: {
        src:['<%= distdir %>/common.js'],
        dest: '<%= distdir %>/common.min.js'
      }
    },
    recess: {
      build: {
        files: {
          '<%= distdir %>/css/theme.css':
          ['<%= src.less %>'] },
        options: {
          compile: true
        }
      },
      min: {
        files: {
          '<%= distdir %>/css/<%= pkg.name %>.css': ['<%= src.less %>']
        },
        options: {
          compress: true
        }
      }
    },
    watch:{
      all: {
        files:['<%= src.js %>', '<%= src.specs %>', '<%= src.lessWatch %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>'],
        tasks:['default','timestamp']
      },
      build: {
        files:['<%= src.js %>', '<%= src.specs %>', '<%= src.lessWatch %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>'],
        tasks:['build','timestamp']
      }
    },
    jshint:{
      files:['gruntFile.js', '<%= src.js %>', '<%= src.jsTpl %>', '<%= src.specs %>', '<%= src.scenarios %>'],
      options:{
        curly:true,
        eqeqeq:true,
        immed:true,
        latedef:true,
        newcap:true,
        noarg:true,
        sub:true,
        boss:true,
        eqnull:true,
        globals:{}
      }
    }
  });

};
