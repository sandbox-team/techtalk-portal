;(function(ng) {
	'use strict';

	ng.module('tp')
		.controller('DetailsCtrl', ['$scope', '$routeParams', 'data', 'helper',
			function($scope, $routeParams, dataProvider, helper) {
				var currentTalkId = $routeParams.talkId,
					oddAttendees =[],
					evenAttendees =[];

				$scope.global.pageTitle = 'talk: ' + currentTalkId;
				$scope._id = currentTalkId;

				if (ng.isDefined(currentTalkId)) {
					$scope.global.appPromise.then(function() {
						$scope.details = $scope.global.talks[currentTalkId];
						angular.forEach($scope.details.attendees, function(value, key){
							console.log(key);
							if ( key % 2 == 0 ){
								oddAttendees.push(value);
							} else{
								evenAttendees.push(value);
							}
						});
						$scope.details.oddAttendees = oddAttendees;
						$scope.details.evenAttendees = evenAttendees;
						$scope.details.date = new Date($scope.details.date);
						$scope.locationReturn = '/portal/calendar/' + $scope.details.date.getDate() + '/' + helper.getMonthName($scope.details.date.getMonth(), true) + '/' + $scope.details.date.getFullYear();
					});
				}

			}]);
})(angular);