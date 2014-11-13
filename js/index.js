var myApp = angular.module('OpenCIn', []);

myApp.controller('MainCtrl', ['$scope',
    function ($scope) {
        $scope.text = "";
}]);

myApp.controller("ListCtrl",
    function ($scope, $rootScope) {
        $scope.data = [

            {
                title: "Title",
                desc: "Description",
                type: "clickable",
                queryValue: "",
                menuMatch: "academic"
            }];


     
        $scope.click = function (queryValue, menuMatch) {
		
		$scope.querySuccess = function (response) {
            var json = JSON.parse(response);
            var results = (json.results.bindings);
			console.log(results);
            var title = [], desc = [], type = [], queryValue = [], menuMatch = [];
            for(var i=0; i<results.length; i++){
                title[i] = results[i].title.value;
                desc[i] = results[i].desc.value;
                queryValue[i] = results[i].queryValue.value
                menuMatch[i] = "academic";
				
				$scope.data.push({"title": title[i], "desc": desc[i], "queryValue": queryValue[i], "menuMatch": menuMatch[i]});

				
            }
			$scope.$apply();
			
			
			



        }

          $scope.queryFail = function (response){
            console.log("Query Fail");
        }

            var queryString = getQuery(menuMatch, $rootScope.tree);
            var sparql = queryString.sparql;
            var sparql = sparql.replace("%%%", queryValue);
            console.log(sparql);
            $scope.data = [];
			
            query(
			sparql,
			"json", 
			$scope.querySuccess, 
			$scope.queryFail);
            $rootScope.$emit("menuChangeEvent", queryValue, menuMatch);
        };





        /*First menu is home*/
        $rootScope.$emit("menuChangeEvent", "", "academic");

    });


myApp.controller("MenuCtrl",
    function ($scope, $rootScope) {

        /*Static menu tree*/

        $rootScope.tree = {
            home: {
                title: "Home",
                query: {
                    sparql: "",
                    results: {
                        type: "clickable",
                        menuMatch: "academic"
                    }
                },
                academic: {
                    title: "Docentes",
                    query: {
                        sparql: "select ?teacher as ?title ?email as ?desc ?email as ?queryValue  where {?x rdf:type cin:academic . ?x cin:name ?teacher . ?x cin:email ?email} group by ?teacher order by ?teacher",
                        results: {
                            type: "clickable",
                            menuMatch: "profile"
                        }
                    },
                    profile: {
                        title: "Perfil",
                        query: {
                            sparql: "select ?nome ?desc where { ?x rdf:type cin:academic . ?x cin:name ?nome . ?x cin:email '%%%' . {{?x cin:office ?desc} UNION {?x cin:phone ?desc} UNION {?x cin:lattes ?desc} UNION {?x cin:homepage ?desc} UNION {?x cin:email ?desc}} } group by ?nome",
                            results: {
                                type: "none",
                                menuMatch: "none"
                            }
                        }
                    },
                    publications: {
                        title: "Publicações",
                        query: ""
                    },
                    projects: {
                        title: "Projetos",
                        query: ""
                    },
                    positions: {
                        title: "Cargos",
                        query: ""
                    }
                },
                expertiseAreas: {
                    title: "Áreas de Atuação",
                    query: ""

                },
                interestAreas: {
                    title: "Áreas de Interesse",
                    query: ""
                }
            }

        };


        /*Current menu handling*/
        ////////////////////////////////////////////////////////////////////
        /*{
            level: "home",
            queryValue: ""
        }*/
        $scope.currentMenuStack = [];
		
		$scope.selected = "";

        ///////////////////////////////////////////////////////////////////
        $rootScope.$on("menuChangeEvent", function (event, queryValue, menuMatch) {

			
			
            $scope.currentMenuStack.push({
                level: menuMatch,
                queryValue: queryValue
            });
            console.log(last($scope.currentMenuStack).level);

            var childMenu = getChildMenuKeys(last($scope.currentMenuStack).level, $rootScope.tree)[0];

            $scope.currentMenu = [];

            for (var key in childMenu) {
                if (key != "title" && key != "query") {
                    $scope.currentMenu.push(key);
                }
            }

            console.log(getQuery("academic", $rootScope.tree));
        });
        //////////////////////////////////////////////////////////////////


    });

function getQuery(key, obj) {
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {

        }
        if (i == key) {
            return (obj[i])[0].query;
        } else {
            return (getChildMenuKeys(key, obj[i]))[0].query;
        }
    }
}

function getChildMenuKeys(key, obj) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getChildMenuKeys(key, obj[i]));
        }
        if (i == key) {
            objects.push(obj[i]);
        }
    }
    return objects;
}


var last = function (array) {
    return array[array.length - 1];
}
