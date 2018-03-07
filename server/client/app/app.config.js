angular.
module('dependencyTreeApp').
config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
        // $locationProvider.hashPrefix('!');

        $routeProvider.
        when('/search', {
            template: '<dependency-search></dependency-search>'
        }).
        // when('/phones/:phoneID', {
            // template: '<phone-detail></phone-detail>'
        // }).
        otherwise('/search')
    }
]);
