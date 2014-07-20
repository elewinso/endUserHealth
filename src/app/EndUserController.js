angular.module('end-user-health.controllers').controller('EndUserController', [
	'$scope', '$log', 'irEndUserApi',
	function($scope, $log, endUserApi) {
		$scope.endUser = {end_user_id: "john@doe.com"};
		endUserApi.getScoreCard().then(function(result) {
            $scope.endUser.scoreCard = result;
        }, function(reason) {
            $log.error('error');
        });

       	endUserApi.getPageViews().then(function(result) {
            $scope.endUser.pageViews = result;
        }, function(reason) {
            $log.error('error');
        });

        endUserApi.getSessions().then(function(result) {
            $scope.endUser.sessions = result;
        }, function(reason) {
            $log.error('error');
        });
}]);
