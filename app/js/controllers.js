

var app = angular.module('widget',['ngResource','LocalStorageModule']);

//factory
app.factory('Weather', ['$resource', function($resource){
  return $resource('http://api.openweathermap.org/data/2.5/weather?q=:city&lang=ru&appid=2de143494c0b295cca9337e1e96b00e0',
      null,{} )
}]);


app.controller('mainCtrl', ['$scope','$http','Weather','localStorageService',function($scope, $http, Weather,localStorageService){

  function submit(key, val){
    return localStorageService.set(key, val)
  }
  function getItem(key){
    return localStorageService.get(key);
  }


  $scope.locations= getItem('locList') ? getItem('locList'):['New York','Kiev' ];
  $scope.err = false;
  $scope.activeTab = getItem('tab') ? getItem('tab'): 0;
  $scope.isEmpty = !$scope.locations;
  $scope.errorMsg = '';

  var regVal = /[0-9!&:]/g;


  $scope.add = function () {
    if (validate($scope.city)){
      $scope.err = true;
      $scope.errorMsg = 'Название должно содержать тулько буквы латинского алфавита';
      return;
    }

    if ($scope.city )
      Weather.get({city: $scope.city}).$promise.then(function (loc) {
        //$scope.gotLoc = loc.name;
        if (loc.cod == 200) {
          addItem(loc.name)
        }
        else {
          $scope.err = true;
          $scope.errorMsg = 'City is not found';
        }
    });
  };

  var addItem = function (loc) {
    if ($scope.locations.indexOf(loc) == -1){
      $scope.locations.push(loc);

      submit('locList', $scope.locations);//save to local storage

      $scope.showWeather($scope.locations.length - 1);

      $scope.city = '';
      $scope.err = false;
    } else {
      $scope.err = true;
      $scope.errorMsg = 'такой город уже есть';
    }
  };

  $scope.removeItem = function (i) {
    $scope.locations.splice(i, 1);
    submit('locList', $scope.locations);//save to local storage
    if (i == 0){
      $scope.showWeather(i);
    } else {
      $scope.showWeather(i-1);//display data
    }
  };

  $scope.showWeather = function ( i) {
    if ($scope.locations.length == 0){return}
    if (i !== undefined || i >=0 ) {
      $scope.activeTab = i;
      submit('tab', $scope.activeTab );//save tabs to local storage
    }
    $scope.view = Weather.get({city: $scope.locations[$scope.activeTab]});
    $scope.isLoaded = true;
    submit('isLoaded', $scope.isLoaded);
  };

  $scope.trasnfrmFromK = function (val) {
    return Math.round(val - 273);
  };

  function validate (val){
    console.log(regVal.test(val));
    return regVal.test(val);
  }

}]);

