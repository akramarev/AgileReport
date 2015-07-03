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

    $scope.convertLinks = function(fieldName) {
      var regex = /(https?:\/\/jira\.internal\.syncplicity\.com\/browse\/)([-A-Za-z0-9]*)/g;
      var result = convertLinks(regex, $scope.model[fieldName], '[$2]($1$2)');

      regex = /(http:\/\/redmine\.weezlabs\.com:8100\/redmine\/issues\/)([0-9]*)/g;
      result = convertLinks(regex, result, '[RM-$2]($1$2)');

      regex = /(https:\/\/github\.com\/syncp\/[-A-Za-z0-9]+\/pull\/)(\d+)/g;
      result = convertLinks(regex, result, '[PR #$2]($1$2)');

      $scope.model[fieldName] = result;
    }

    convertLinks = function(regex, text, format) {
      var shards = [];
      var matches = [];
      var m;
      while(m = regex.exec(text)) {
        matches.push(m);
      }

      var currentIndex = 0;
      for(var i = 0; i < matches.length; ++i) {
        shards.push(text.substr(currentIndex, matches[i].index - currentIndex));
        shards.push(text.substr(matches[i].index, matches[i][0].length));
        currentIndex = matches[i].index + matches[i][0].length;
      }
      shards.push(text.substr(currentIndex));

      for(var i = 1; i < shards.length; ++i) {
        if(shards[i].match(regex) && shards[i - 1].substr(shards[i - 1].length - 2) != '](') {
          shards[i] = shards[i].replace(regex, format);
        }
      }

      return shards.join('');
    }
  })