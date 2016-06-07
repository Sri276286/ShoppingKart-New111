var myApp = angular.module('myApp', ['infinite-scroll']);

//to find unique items
var uniqueItems = function (data, key) {
    var result = [];
    
    for (var i = 0; i < data.length; i++) {
        var value = data[i][key];
 
        if (result.indexOf(value) == -1) {
            result.push(value);
        }
    
    }
    return result;
};

myApp.controller('DemoController', function($scope,$http,$timeout) {

 $scope.counter = 0;
 $scope.useCategory = [];
    $scope.onTimeout = function(){
        $scope.counter++;
		mytimeout = $timeout($scope.onTimeout,1000);
    }
	var mytimeout = $timeout($scope.onTimeout,1000);
	$scope.progressValue = $scope.counter*20;
	
	$http.get('https://test-prod-api.herokuapp.com/products').then(function(response){
	$('#myModal').modal('hide');
	$timeout.cancel(mytimeout);
	$scope.productList = [];
	for(var i=0;i<9;i++){
	$scope.productList.push(response.data.products[i]);
	}
	console.log($scope.productList.length);
	$scope.initial = 9;
	$scope.check = 18;
	$scope.loadMore = function() {
  for(var j = $scope.initial; j < $scope.check && $scope.productList.length<1000; j++) {
	$scope.productList.push(response.data.products[j]);
	 
   }
   $scope.initial = j;
   $scope.check = $scope.initial+9;
};
	$scope.category = uniqueItems($scope.productList, 'cat');
	});

	 $scope.filterCategory = function (productList) {
        return function (p) {
            var noneSelected = true;
            for (var i in $scope.useCategory) {
                if ($scope.useCategory[i]) {
                    noneSelected = false;
                    if (p.cat == $scope.category[i]) {
                        return true;
                    }
                }
            }
            return noneSelected;
        };
		
    };
 });

myApp.filter('orderObjectBy', function(){
 return function(input, attribute) {
 
    if (!angular.isObject(input)) return input;

    var array = [];
    for(var objectKey in input) {
        array.push(input[objectKey]);
    }

    array.sort(function(a, b){
   if(attribute == 'price'){
        a = parseInt(a[attribute]);
        b = parseInt(b[attribute]);
		}
		else{
		 a = parseFloat(a[attribute]);
        b = parseFloat(b[attribute]);
		}
        return a - b;
    });
    return array;
 }
});