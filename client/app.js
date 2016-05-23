angular.module('MySimpleEditor', ['textAngular'])
.controller('MyController', ['$scope', function($scope){
    $scope.sample = 'Shout out from the javascript!';
    $scope.htmlContent = '<h2>Testing Content</h2>'
}]);