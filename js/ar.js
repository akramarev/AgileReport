angular.module('ar', ['ui.bootstrap', 'btford.markdown', 'ngClipboard'])
  .config(['ngClipProvider', function(ngClipProvider) {
    ngClipProvider.setPath("js/bower_components/zeroclipboard/ZeroClipboard.swf");
  }])
  .controller('ReportCtrl', function($scope) {
    $scope.date = new Date();
    $scope.done = "1. [RED-123](https://jira.internal.syncplicity.com/browse/RED-123) Fixed. Please review.";
    $scope.inprogress = "* VPN connection problem _resolving_, I'm going to call EMC support tomorrow **again**.";
    $scope.reviewed = "* [RED-777](https://jira.internal.syncplicity.com/browse/RED-777) Looks good. Merged.";
    $scope.reviewed += "\n * [DB Master PR](https://github.com/syncp/syncp-database/pull/531)";
    $scope.questions = "```NSLog (@\"Some smart question should be here\");```";

    $scope.sendReport = function() {
      var link = "mailto:manager@localhost"
        + "?subject=" + encodeURIComponent($('.report .rName').text())
        + "&body=";

      angular.forEach($('.setup .form-group'), function (value, key) {
        link += encodeURIComponent("#" + $(value).find('label').text() + "# \n ");
        link += encodeURIComponent($(value).find('textarea').val() + " \n\n ");
      });

      window.location.href = link;
    }

    $scope.getReportHtmlToCopy = function() {
      return $('.report').html();
    }

    $scope.copyReportClick = function() {
      alert('Copied');
    }
})