(function() {
    angular.module('navApp', [])
    .controller('NavController' , function($scope) {

        pagespace.getData().then(function (data) {
            $scope.data = data;
            $scope.$apply();
        });

        $scope.save = function () {
            return pagespace.setData($scope.data).then(function () {
                pagespace.close();
            });
        }
    });
})();