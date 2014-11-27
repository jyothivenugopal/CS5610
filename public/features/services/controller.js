function ServicesCtrl($scope, $http) {

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
		    console.log($scope.businesses);
		});
	}

	$scope.choose = function (b) {
	    console.log(b);
	    var lat = b.location.coordinate.latitude;// latitude of the destination
	    var long = b.location.coordinate.longitude;// longitude of the destination
	    console.log(lat);
	    console.log(long);
	    $scope.userlocation(b);
	}


    //new part

	$scope.userlocation = function ($scope) {
	    if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(function (position) {
	           
	                $scope.position = position;
	                console.log("hi from choose function");
	                console.log($scope.position);
	           
	        });
	    }
	}

    //end new part
    
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
