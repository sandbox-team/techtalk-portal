;(function(ng) {
  ng.module('tp.services', [])
    .factory('helper', [function() {
      var monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        shortMonthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      return {
        getMonthName: function(index, useShortFormat) {
          return (useShortFormat ? shortMonthNames : monthNames)[index];
        },
        //if you are using the format(first month has 1 index) set useHumanReadableMonthBase to true
        getDaysInMonth: function(month, year, useHumanReadableMonthBase) {
          return new Date(year, month + useHumanReadableMonthBase ? 0 : 1, 0).getDate();
        }
      }
    }]);
})(angular);