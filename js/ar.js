angular.module('ar', ['ui.bootstrap', 'btford.markdown', 'ngClipboard', 'ngCookies'])
  .config(['ngClipProvider', function(ngClipProvider) {
    ngClipProvider.setPath("js/bower_components/zeroclipboard/dist/ZeroClipboard.swf");
  }])
  .controller('ReportCtrl', function($scope, $cookieStore) {
    $scope.date = new Date();

    $scope.model = $cookieStore.get('model');
    if(typeof $scope.model == 'undefined')
    {
      $scope.model = {
        done: "1. [RED-123](https://jira.internal.syncplicity.com/browse/RED-123) Fixed. Please review.",
        inprogress: "* VPN connection problem _resolving_, I'm going to call EMC support tomorrow **again**.",
        reviewed: "* [RED-777](https://jira.internal.syncplicity.com/browse/RED-777) Looks good. Merged."
          + "\n * [DB Master PR](https://github.com/syncp/syncp-database/pull/531)",
        questions: "```NSLog (@\"Some smart question should be here\");```"
      }
    }

    $scope.$watchCollection('model', function(newValue) {
      $cookieStore.put('model', newValue);
    });

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