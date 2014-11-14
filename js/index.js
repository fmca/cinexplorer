var myApp = angular.module('OpenCIn', []);

myApp.controller('MainCtrl', ['$scope',
    function ($scope) {
        $scope.text = "";
}]);

/******************************************************************************/
/****************************ListCtrl******************************************/
/******************************************************************************/
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

        $rootScope.$on("requestList", function (event, queryValue, menu) {
            $scope.querySuccess = function (response) {
                var json = JSON.parse(response);
                var results = (json.results.bindings);

                var title = [],
                    desc = [],
                    type = [],
                    queryValue = [],
                    menuMatch = [];
                for (var i = 0; i < results.length; i++) {
                    title[i] = results[i].title.value;
                    desc[i] = results[i].desc.value;
                    queryValue[i] = results[i].queryValue.value
                    menuMatch[i] = menu;

                    $scope.data.push({
                        "title": title[i],
                        "desc": desc[i],
                        "queryValue": queryValue[i],
                        "menuMatch": menuMatch[i]
                    });


                }
                $scope.$apply();
            }

            $scope.queryFail = function (response) {
                console.log("Query Fail");
            }

            $scope.data = [];

            var queryString = getQuery(menu, $rootScope.tree);
            var sparql = queryString.sparql;
            var sparql = sparql.replace("%%%", queryValue);


            query(
                sparql,
                "json",
                $scope.querySuccess,
                $scope.queryFail);

        });




        $scope.click = function (queryValue, menuMatch) {

            $rootScope.$emit("requestList", queryValue, menuMatch);
            $rootScope.$emit("menuChangeEvent", queryValue, menuMatch);

        }


        /*First menu is home*/
        $scope.click("", "home");


    });

/******************************************************************************/
/****************************MenuCtrl******************************************/
/******************************************************************************/

myApp.controller("MenuCtrl",
    function ($scope, $rootScope) {

        /*Static menu tree*/

        $rootScope.tree = {
            home: {
                title: "Home",
                query: {
                    sparql: "select ?title ?desc where{ ?x cin:nothing ?title . ?x cin:nothing ?desc}",
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
                            sparql: "select ?nome as ?title ?desc ?email as ?queryValue where { ?x rdf:type cin:academic . ?x cin:name ?nome . ?x cin:email '%%%' . {{?x cin:office ?desc} UNION {?x cin:phone ?desc} UNION {?x cin:lattes ?desc} UNION {?x cin:homepage ?desc} UNION {?x cin:email ?desc}} } group by ?nome",
                            results: {
                                type: "none",
                                menuMatch: "none"
                            }
                        }
                    },
                    publications: {
                        title: "Publicações",
                        query: {
                            sparql: "",
                            results: {
                                type: "none",
                                menuMatch: "none"
                            }
                        }
                    },
                    projects: {
                        title: "Projetos",
                        query: {
                            sparql: "",
                            results: {
                                type: "none",
                                menuMatch: "none"
                            }
                        }
                    },
                    positions: {
                        title: "Cargos",
                        query: {
                            sparql: "",
                            results: {
                                type: "none",
                                menuMatch: "none"
                            }
                        }
                    }
                },
                expertiseAreas: {
                    title: "Áreas de Atuação",
                    query: {
                        sparql: "",
                        results: {
                            type: "none",
                            menuMatch: "none"
                        }
                    }

                },
                interestAreas: {
                    title: "Áreas de Interesse",
                    query: {
                        sparql: "",
                        results: {
                            type: "none",
                            menuMatch: "none"
                        }
                    }
                }
            }

        };


        /*Current menu handling*/
        /*{
            level: "home",
            queryValue: ""
        }*/
        $scope.currentMenuStack = [];

        $scope.selected = "";

        $rootScope.$on("menuChangeEvent", function (event, queryValue, menuMatch) {



            $scope.currentMenuStack.push({
                level: menuMatch,
                queryValue: queryValue
            });

            var childMenu = getChildMenuKeys(last($scope.currentMenuStack).level, $rootScope.tree)[0];

            $scope.currentMenu = [];

            var changedSelected = false;
            for (var key in childMenu) {
                if (key != "title" && key != "query") {
                    if (!changedSelected) {
                        changedSelected = true;
                        $scope.selected = key;
                    }
                    $scope.currentMenu.push({
                        name: key,
                        queryValue: queryValue
                    });
                }
            }

        });


        $scope.click = function (queryValue, menuName) {
            $rootScope.$emit("requestList", queryValue, menuName);
            $scope.selected = menuName;
        }


        $scope.click("", "academic");



    });


/******************************************************************************/
/****************************Other Functions***********************************/
/******************************************************************************/


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
