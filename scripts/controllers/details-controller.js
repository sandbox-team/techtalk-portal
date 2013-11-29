;(function(ng) {
	'use strict';
var polygon = function(ctx, x, y, radius, sides, startAngle) {
        if (sides < 3) return;
        var a = (Math.PI * 2)/sides;
        ctx.save();
        ctx.translate(x,y);
        ctx.rotate(startAngle);
        ctx.moveTo(radius,0);
        for (var i = 1; i < sides; i++) {
            ctx.lineTo(radius*Math.cos(a*i),radius*Math.sin(a*i));
        }
        ctx.closePath();
        ctx.restore();
    };
var drawTechTalkLocation = function(id, location, x, y, radius, color){
console.log(location);
	var canvas = document.getElementById(id);
	var context = canvas.getContext("2d");
    context.beginPath();
    polygon(context, x, y, radius, 6, 0);
    context.strokeStyle = color;
    context.shadowColor = color;
    context.shadowBlur = 10;
    context.lineWidth = 2;
    context.stroke();
    context.textBaseline = 'top';
    context.font = "8pt Arial";
	context.textAlign = 'center';
    context.fillStyle = color;
    context.fillText(location, canvas.width/2, canvas.height-20);
};
var drawTechTalkLevel = function(id, level, x, y, radius, color){
	//total number of levels=5
    var inactiveLevels=5-level;
    var canvas = document.getElementById(id);
    var context = canvas.getContext("2d");
    context.beginPath();
    for(var i=0; i<level; i++){
        if(i%2==0){
            polygon(context, x+16*i, y, radius, 6, 0);
        }else{
            polygon(context, x+16*i, y+8, radius, 6, 0);
        }
    }
    context.save();
    context.strokeStyle = color;
    context.shadowColor = color;
    context.shadowBlur = 10;
    context.lineWidth = 2;
    context.stroke();
    context.restore();
    context.beginPath();
    for(var j=level; j<5; j++){
        if(j%2==0){
            polygon(context, x+16*j, y, radius, 6, 0);
        }else{
            polygon(context, x+16*j, y+8, radius, 6, 0);
        }
    }
    context.strokeStyle = '#666666';
    context.shadowColor = '#666666';
    context.shadowBlur = 10;
    context.lineWidth = 2;
    context.stroke();
};
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
						console.log($scope.details);
						angular.forEach($scope.details.attendees, function(value, key){
							if ( key % 2 == 0 ){
								oddAttendees.push(value);
							} else{
								evenAttendees.push(value);
							}
						});
						console.log(oddAttendees);
						$scope.details.oddAttendees = oddAttendees;
						$scope.details.evenAttendees = evenAttendees;
						$scope.details.date = new Date($scope.details.date);
						$scope.locationReturn = '/portal/calendar/' + $scope.details.date.getDate() + '/' + helper.getMonthName($scope.details.date.getMonth(), true) + '/' + $scope.details.date.getFullYear();
						drawTechTalkLocation('location', $scope.details.location, 25, 20, 8, '#60e3ff');
						//drawTechTalkLevel('level', 5, 20, 15, 8, '#fefe85');
					});
				}

			}]);
})(angular);