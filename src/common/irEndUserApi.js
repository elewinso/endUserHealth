angular.module('end-user-health.services').service('irEndUserApi', [
	'$log', '$q', '$http', '$timeout',
	function($log, $q, $http, $timeout){
		var self = this;
  //       self.orgId = window.orgId;
  //       self.domainId = window.domainId;
  //       self.endUserId = window.endUserId;

  		self.getScoreCard = function getScoreCard() {
  			var deferred = $q.defer();

  			var result = {
  				"health": "high", /* or "medium" or "low" */
  				"priority": "high", /* or "medium" or "low" */
  				"joined_at": Date.now(), 
  				"last_active": Date.now(),
  				"overall_time": 1571 /*time in seconds*/
  			};

  			$timeout(function(){
           		deferred.resolve(result);
  			},1000);
  			
            return deferred.promise;
  		};

  		self.getPageViews = function getPageViews() { 			
  			var deferred = $q.defer();

  			var result = [];

  			var randomDate = new Date();
  			for (var i = 0; i < 20; i++) {
  				result.push({
	  				"page_id": Math.floor(Math.random() * 1000),
	  				"url": "http://www.iridize.com/account",
	  				"title": "what's in the title tag",
	  				"name": "optional field",
	  				"date": randomDate.setDate(randomDate.getDate()-Math.floor(Math.random() * 7)),
	  				"hits": 7
  				});
  			};

  			//TODO: this list will be returned unsorted from the server side.
  			//it should be sorted here...

  			$timeout(function(){
           		deferred.resolve(result);
  			},1000);
  			
            return deferred.promise;
  		};

  		self.getSessions = function getSessions() {
  			var deferred = $q.defer();
  			var result = [];

			var randomDate = new Date();
  			for (var i = 0; i < 20; i++) {
  				result.push({
	  				"session_id": 6,
	  				"created_at": randomDate.setDate(randomDate.getDate()-Math.floor(Math.random() * 7)),
	  				"updated_at": randomDate.setMinutes(randomDate.getMinutes()+45)
	  			});
	  		};

  			//TODO: this list will be returned unsorted from the server side.
  			//it should be sorted here (according to created_at)...

  			//TODO: calculate the duration of each session and update in result array
  			//result[i].duration = ...

  			$timeout(function(){
           		deferred.resolve(result);
  			},1000);
  			
            return deferred.promise;
  		};


}]);