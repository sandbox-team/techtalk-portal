;(function(ng) {
  ng.module('tp')
    .factory('helper', [function() {
      var monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        shortMonthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      return {
        getMonthName: function(index, useShortFormat) {
          return (useShortFormat ? shortMonthNames : monthNames)[index];
        }
      }
    }]);
})(angular);