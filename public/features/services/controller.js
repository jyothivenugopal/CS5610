function ServicesCtrl($scope, $http) {

    var srclat = 0;
    var srclong = 0;
    var destlat = 0;
    var destlong = 0;
    //var mysrclat = 0;
    //var mysrclong = 0;

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
	    $scope.getUberSpecifics($scope, $http);
	}


    //new part

	$scope.userlocation = function ($scope) {
	    //var URL = "https://api.uber.com/v1/products?client_id=J2z1kmygRGKmvem0kFJczeJ4bA8I8o1r&client_secret=PS4vjomIGnaYm4iZ2RQUCPtUOYw6wwofBQ9LtQOX&server_token=VMSBIWPv7tRD5PpIPrLEVIa8ahfpMgs9FxxRM67f&latitude=STLAT&longitude=STLONG"

	    if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(function (position) {
	           
	                $scope.position = position;
	                srclat = position.coords.latitude;;
	                srclong = position.coords.longitude;
	                
	                /*console.log(srclat);
	                console.log(srclong);
	                console.log(destlat);
	                console.log(destlong);
                
	            // new part

	               var newurl = URL.replace("STLAT", srclat);
                        newurl = newurl.replace("STLONG", srclong);
                        $http.get(newurl).success(function (response) {
                            $scope.content = response;
                            console.log($scope.content);

                        });*/

                // end new part

	           
	        });
	    }
	}

    //end new part
	$scope.getUberSpecifics = function ($scope, $http) {
	    console.log("hi from uber function")
        console.log(srclat); // not loading the first time
        console.log(srclong);
        console.log(destlat);
        console.log(destlong);

        //$scope.dogs = ['Bernese', 'Husky', 'Goldendoodle'];

        //products
        /*var prodURL = "https://api.uber.com/v1/products?client_id=J2z1kmygRGKmvem0kFJczeJ4bA8I8o1r&client_secret=PS4vjomIGnaYm4iZ2RQUCPtUOYw6wwofBQ9LtQOX&server_token=VMSBIWPv7tRD5PpIPrLEVIa8ahfpMgs9FxxRM67f&latitude=STLAT&longitude=STLONG";
	    
        var purl = prodURL.replace("STLAT", srclat);
        purl = purl.replace("STLONG", srclong);
        //will work as long as cors plugin is enabled
        $http.get(purl).success(function (response) {
            $scope.products = response.products;
            //console.log($scope.products);

        });*/

        //for node rest api, works on localhost but not on openshift
        /*$http.get("/Uberresults")
		.success(function (response) {
		    $scope.uberresults = response;
		    console.log($scope.uberresults);
		});*/

        //price estimates

        var prestURL = "https://api.uber.com/v1/estimates/price?client_id=J2z1kmygRGKmvem0kFJczeJ4bA8I8o1r&client_secret=PS4vjomIGnaYm4iZ2RQUCPtUOYw6wwofBQ9LtQOX&server_token=VMSBIWPv7tRD5PpIPrLEVIa8ahfpMgs9FxxRM67f&start_latitude=STLAT&start_longitude=STLONG&end_latitude=ENDLAT&end_longitude=ENDLONG";

        var pesturl = prestURL.replace("STLAT", srclat);
        pesturl = pesturl.replace("STLONG", srclong);
        pesturl = pesturl.replace("ENDLAT", destlat);
        pesturl = pesturl.replace("ENDLONG", destlong);
	    //will work as long as cors plugin is enabled
        $http.get(pesturl).success(function (response) {
            $scope.prices = response.prices;
            //console.log($scope.prices);

        });

	    //eta estimates

        var etaURL = "https://api.uber.com/v1/estimates/time?client_id=J2z1kmygRGKmvem0kFJczeJ4bA8I8o1r&client_secret=PS4vjomIGnaYm4iZ2RQUCPtUOYw6wwofBQ9LtQOX&server_token=VMSBIWPv7tRD5PpIPrLEVIa8ahfpMgs9FxxRM67f&start_latitude=STLAT&start_longitude=STLONG";

        var etaesturl = etaURL.replace("STLAT", srclat);
        etaesturl = etaesturl.replace("STLONG", srclong);
        
	    //will work as long as cors plugin is enabled
        $http.get(etaesturl).success(function (response) {
            $scope.times = response.times;
            console.log($scope.times);

        });

	    //promotions

        var promoURL = "https://api.uber.com/v1/promotions?client_id=J2z1kmygRGKmvem0kFJczeJ4bA8I8o1r&client_secret=PS4vjomIGnaYm4iZ2RQUCPtUOYw6wwofBQ9LtQOX&server_token=VMSBIWPv7tRD5PpIPrLEVIa8ahfpMgs9FxxRM67f&start_latitude=STLAT&start_longitude=STLONG&end_latitude=DESTLAT&end_longitude=DESTLONG";

        var promoesturl = promoURL.replace("STLAT", srclat);
        promoesturl = promoesturl.replace("STLONG", srclong);
        promoesturl = promoesturl.replace("DESTLAT", destlat);
        promoesturl = promoesturl.replace("DESTLONG", destlong);

	    //will work as long as cors plugin is enabled
        $http.get(promoesturl).success(function (response) {
            $scope.promos = response;
            console.log($scope.promos);

        });

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
