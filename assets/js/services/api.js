(function() {
  'use strict';
  angular.module('hansei.services')
    .factory('api', ['$sails', '$state', function($sails, $state) {

      var debug = function(msg) {
        console.log(msg);
      };

      var info = function(msg) {
        console.log(msg);
      };

      var subs = [];  // our currently subscribed events

      var subscriber = {
        debug: function() {
          info('Subscriptions: ' + JSON.stringify(subs));
        },
        subscribe: function(e, cb) {
          var toSubscribe = [];
          if (typeof e === 'string') e = [e];
          for (var i in e) {
            if (subs.indexOf(e[i]) === -1) {
              toSubscribe.push(e[i]);
            }
            subs = subs.concat(e[i]);
          }
          if (!toSubscribe.length) return cb ? cb() : null;
          post('/api/subscribe', {events: toSubscribe}, cb);
        },
        unsubscribe: function(e, cb) {
          var toUnsubscribe = [];
          if (typeof e === 'string') e = [e];
          for (var i in e) {
            var idx = subs.indexOf(e[i]);
            if (idx === -1) {
              info("Subscription doesn't exist: " + e[i]);
            } else {
              subs.splice(idx, 1);
              toUnsubscribe.push(e[i]);
            }
          }
          if (!toUnsubscribe.length) return cb ? cb() : null;
          post('/api/unsubscribe', {events: toUnsubscribe}, cb);
        },
        resubscribe: function(cb) {
          post('/api/subscribe', {events: subs}, cb);
        }
      };

      var handleResponse = function(data, jwr, cb) {
        // if (data && data.location) {
        //   $location.path(data.location);
        // }
        // if (data && data.status === 'error') {
        //   data.err = data.message;
        //   FlashService.show(data.message);
        // }
        if (jwr.statusCode === 403) {
          $state.go('signin');
        }

        cb(data, jwr);
      };

      var get = function(target, cb) {
        $sails.get(target, function(data, jwr) {
          info('api get [' + target + ']: ' + JSON.stringify(data));
          handleResponse(data, jwr, function(data, jwr) {
            if (cb) cb(data, jwr);
          });
        });
      };

      var post = function(target, params, cb) {
        $sails.post(target, params, function(data, jwr) {
          info('api post [' + target + '][' + JSON.stringify(params) +
            ']: ' + JSON.stringify(data));
          handleResponse(data, jwr, function(data, jwr) {
            if (cb) cb(data, jwr);
          });
        });
      };

      return {
        login: function(user, pass, cb) {
          post('/api/signin', {username: user, password: pass}, cb);
        },
        getBoards: function(cb) {
          get('/api/boards', cb);
        }
      };
    }])
})();