(function() {
  'use strict';
  angular.module('hansei.services')
    .factory('config', ['$q', 'api', function($q, api) {

      var defer = $q.defer();

      return {
        signin:  null,
        colsets: [],
        regex:   {},
        loaded:  false,
        promise: function() { return defer.promise; },
        load:    function() {
          if (!this.loaded) {
            api.getConfig(function(config) {
              Object.keys(config.regex).forEach(function(name) {
                this.regex[name] = new RegExp(config.regex[name]);
              }.bind(this));
              this.signin  = config.signin;
              this.colsets = config.colsets;
              this.loaded  = true;
              defer.resolve();
            }.bind(this));
          }
          return defer.promise;
        }
      };

    }])
})();
