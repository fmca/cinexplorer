var myApp = angular.module('OpenCIn', []);

myApp.controller('MainCtrl', ['$scope',
    function ($scope) {
        $scope.text = "";
}]);

myApp.controller("ListCtrl",
    function ($scope, $rootScope) {
        $scope.data = [

            {
                title: "asdjhad",
                desc: "asdhasd",
                type: "clickable",
                queryValue: "acas@cin.ufpe.br",
                menuMatch: "profile"
            }, {
                title: "ashdasdlas",
                desc: "asdjhasdasd",
                type: "clickable",
                menuMatch: "academic"

            }];


     var querySuccess = function (response) {
            var json = JSON.parse(response);
            var results = (json.results.bindings);
            var title = [], desc = [], type = [], queryValue = [], menuMatch = [];
            for(var i=0; i<results.length; i++){
                title[i] = results[i].title;
                desc[i] = results[i].desc;
                queryValue[i] = results[i].queryValue;
                menuMatch[i] = "academic";
            }


        }

          var queryFail = function (response){
            console.log("Query Fail");
        }

        $scope.click = function (queryValue, menuMatch) {
            var query = getQuery(menuMatch, $rootScope.tree);
            var sparql = query.sparql;
            var sparql = sparql.replace("%%%", queryValue);
            console.log(sparql);
            $scope.data = [];

            query(sparql, "json", querySuccess, queryFail);
            $rootScope.$emit("menuChangeEvent", queryValue, menuMatch);
        };





        /*First menu is home*/
        $rootScope.$emit("menuChangeEvent", "", "home");

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
                        sparql: "select ?teacher as ?title, ?email as ?desc, ?email as ?queryValue  where {?x rdf:type cin:academic . ?x cin:name ?teacher } group by ?teacher order by ?teacher",
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
