angular.module('ar', ['ui.bootstrap', 'btford.markdown', 'ngClipboard', 'ngAnimate'])
  .config(['ngClipProvider', function(ngClipProvider) {
    ngClipProvider.setPath("js/bower_components/zeroclipboard/dist/ZeroClipboard.swf");
  }])
  .controller('ReportCtrl', function($scope) {
    $scope.date = new Date();

    $scope.model = angular.fromJson(localStorage.model);
    if(typeof $scope.model == 'undefined')
    {
      $scope.model = {
        done: "1. [RED-123](https://jira.internal.syncplicity.com/browse/RED-123) Fixed. Please review.",
        inprogress: "* VPN connection problem _resolving_.",
        next: "* I'm going to call EMC support tomorrow, and ask to check my connection **again**.",
        reviewed: "* [RED-777](https://jira.internal.syncplicity.com/browse/RED-777) Looks good. Merged."
          + "\n * [DB Master PR](https://github.com/syncp/syncp-database/pull/531)",
        questions: "```NSLog (@\"Some smart question should be here\");```"
      }
    }

    $scope.$watchCollection('model', function(newValue) {
      localStorage.model = angular.toJson(newValue);
    });

    $scope.sendReport = function() {
      var link = "mailto:manager@localhost"
        + "?subject=" + encodeURIComponent($('.report .rName').text())
        + "&body=";

      angular.forEach($('.setup .form-group'), function (value, key) {
        var v = $(value).find('input, textarea').val();
        if (v.length > 0)
        {
          link += encodeURIComponent("#" + $(value).find('label').text() + "# \n ");
          link += encodeURIComponent(v + " \n\n ");
        }
      });

      window.location.href = link;
    }

    $scope.getReportHtmlToCopy = function() {
      return $('.report').html();
    }

    $scope.copyReportClick = function() {
      alert('Copied');
    }

    $scope.convertLinks = function(event, fieldName){
      
      // this regex changes all markdown links to raw
      // it is done to avoid affecting links in brackets
      $scope.model[fieldName] = $scope.model[fieldName].replace(/\[([-A-Za-z0-9]*)\]\((https:\/\/jira\.internal\.syncplicity\.com\/browse\/[-A-Za-z0-9]*)\)/g, '$2');
      
      // replaces all war links with markdown notation
      // the RED-<number> is used as link text
      $scope.model[fieldName] = $scope.model[fieldName].replace(/(https:\/\/jira\.internal\.syncplicity\.com\/browse\/)([-A-Za-z0-9]*)/g, '[$2]($1$2)');

    }
})

