function ServicesCtrl($scope, $http) {

    var srclat = 0;
    var srclong = 0;
    var destlat = 0;
    var destlong = 0;

	$scope.create = function () {
		$http.post("/serviceClients", $scope.serviceClient)
		.success(function (response) {
			$scope.all();
		});
	}

	$scope.getresults = function () {
	    console.log("Hello from getresults")
	    var sterm = $scope.searchterm;
	    var sloc = $scope.searchlocation;
	    $http.get("/getresults/" + sterm + "/" + sloc)
		.success(function (response) {
		    $scope.businesses = response.businesses;
		    //console.log($scope.businesses);
		});
	}

	$scope.choose = function (b) {
	    //console.log(b);
	    $scope.destlat = b.location.coordinate.latitude;// latitude of the destination
	    $scope.destlong = b.location.coordinate.longitude;// longitude of the destination
	    destlat = $scope.destlat;
	    destlong = $scope.destlong;
	    $scope.userlocation(b);
	    $scope.getUberSpecifics();
	}


    //new part

	$scope.userlocation = function ($scope) {
	    if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(function (position) {
	           
	                $scope.position = position;
	                //$scope.srclat = position.coords.latitude; 
	                srclat = position.coords.latitude;;
	                //$scope.srclong = position.coords.longitude;
	                srclong = position.coords.longitude;
	                //console.log($scope.srclat);
	                //console.log($scope.srclong);
	           
	        });
	    }
	}

    //end new part
	$scope.getUberSpecifics = function ($scope) {
        console.log("hi from uber function")
        console.log(srclat);
        console.log(srclong);
        console.log(destlat);
        console.log(destlong);
	    

	}
    
	$scope.renderServiceClients = function (response) {
		$scope.serviceClients = response;
	};

	$scope.remove = function (id) {
		$http.delete("/serviceClients/" + id)
		.success(function (response) {
			$scope.all();
		});
	};

	$scope.update = function () {
		$http.put("/serviceClients/" + $scope.serviceClient._id, $scope.serviceClient)
		.success(function(response) {
				$scope.all();
		});
	};

	$scope.select = function (id) {
		$http.get("/serviceClients/" + id)
		.success(function (response) {
			$scope.serviceClient = response;
		});
	};

	$scope.all = function () {
		$http.get("/serviceClients")
		.success($scope.renderServiceClients);
	}

	$scope.all();
}
