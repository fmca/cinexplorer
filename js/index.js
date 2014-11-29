var myApp = angular.module('OpenCIn', []);


/******************************************************************************/
/****************************ListCtrl******************************************/
/******************************************************************************/
myApp.controller("ListCtrl",
    function ($scope, $rootScope) {
        $scope.data = [

            {
                title: "Title",
                desc: "Description",
                clickable: true,
                queryValue: "",
                menuMatch: "academic"
            }];

        $rootScope.$on("requestList", function (event, queryValue, menu) {

            $rootScope.listLoaded = false;

            $scope.querySuccess = function (response) {
                var json = JSON.parse(response);
                var results = (json.results.bindings);
                console.log(results);

                var title = [],
                    desc = [],
                    clickable = [],
                    queryValue = [],
                    menuMatch = [];
                for (var i = 0; i < results.length; i++) {
                    title[i] = results[i].title.value;
                    desc[i] = results[i].desc.value;
                    queryValue[i] = results[i].queryValue.value;
                    menuMatch[i] = menu;
                    clickable[i] = getQuery(menu, $rootScope.tree).results.clickable;

                    $scope.data.push({
                        "title": title[i],
                        "desc": desc[i],
                        "clickable": clickable[i],
                        "queryValue": queryValue[i],
                        "menuMatch": menuMatch[i]
                    });


                }

                $rootScope.listLoaded = true;

                $scope.$apply();
            }

            $scope.queryFail = function (response) {

                $scope.data = [{
                    "title": "Falha",
                    "desc": "Não foi possível realizar a busca. Verifique se está conectado à rede do CIn",
                    "clickable": false,
                    "queryValue": "",
                    "menuMatch": $rootScope.selected.name
                }];

                $rootScope.listLoaded = true;

                $scope.$apply();
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


            $rootScope.$emit("menuChangeEvent", queryValue, menuMatch);
            $rootScope.$emit("requestList", queryValue, $rootScope.selected.name);

        }


        /*First menu is home*/
        $scope.click("", "home");


    });

/******************************************************************************/
/****************************MenuCtrl******************************************/
/******************************************************************************/

myApp.controller("MenuCtrl",
    function ($scope, $rootScope, $window) {

        /*Static menu tree*/

        $rootScope.tree = {
            home: {
                title: "Início",
                icon: "fa-home",
                query: {
                    sparql: "",
                    results: {
                        clickable: true,
                        menuMatch: "academic"
                    }
                },
                academic: {
                    title: "Docentes",
                    icon: "fa-users",
                    query: {
                        sparql: "select ?teacher as ?title ?email as ?desc ?email as ?queryValue  where {?x rdf:type cin:academic . ?x cin:name ?teacher . ?x cin:email ?email} group by ?teacher order by ?teacher",
                        results: {
                            clickable: true,
                            menuMatch: "profile"
                        }
                    },
                    profile: {
                        title: "Perfil",
                        icon: "fa-user",
                        query: {
                            sparql: "select ?title ?desc ?email as ?queryValue where { ?x rdf:type cin:academic . ?x cin:name ?nome . ?x cin:email '%%%' . ?x cin:email ?email . ?x ?title ?desc . {?x cin:office ?desc } UNION {?x cin:phone ?desc} UNION {?x cin:lattes ?desc} UNION {?x cin:homepage ?desc} } group by ?nome",
                            results: {
                                clickable: false,
                                menuMatch: "none"
                            }
                        }
                    },
                    publications: {
                        title: "Publicações",
                        icon: "fa-quote-right",
                        query: {
                            sparql: "select ?type as ?title ?name as ?desc ?public as ?queryValue where {?x cin:email '%%%' . ?public ?idProfessor ?x . ?public rdf:type ?type . ?public cin:title ?name} group by ?name order by ?type",
                            results: {
                                clickable: false,
                                menuMatch: "none"
                            }
                        }
                    },
                    projects: {
                        title: "Projetos",
                        icon: "fa-gears",
                        query: {
                            sparql: "",
                            results: {
                                clickable: false,
                                menuMatch: "none"
                            }
                        }
                    },
                    positions: {
                        title: "Cargos",
                        icon: "fa-suitcase",
                        query: {
                            sparql: "",
                            results: {
                                clickable: false,
                                menuMatch: "none"
                            }
                        }
                    }
                },
                expertiseAreas: {
                    title: "Áreas de Atuação",
                    icon: "fa-graduation-cap",
                    query: {
                        sparql: "select ?ea as ?title ?eaname as ?desc ?ea as ?queryValue where {?x rdf:type cin:academic . ?x cin:hasAreaExpertise ?ea . ?ea cin:name ?eaname} group by ?ea order by ?desc",
                        results: {
                            clickable: false,
                            menuMatch: "none"
                        }
                    }

                },
                interestAreas: {
                    title: "Áreas de Interesse",
                    icon: "fa-heart",
                    query: {
                        sparql: "select ?ia as ?title ?ianame as ?desc ?ia as ?queryValue where {?x rdf:type cin:academic . ?x cin:hasAreaInterest ?ia . ?ia cin:name ?ianame} group by ?ianame order by ?desc",
                        results: {
                            clickable: false,
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

        $rootScope.selected = {};

        $rootScope.$on("menuChangeEvent", function (event, queryValue, menuMatch) {


            var lFilter = $rootScope.listFilter;

            $scope.currentMenuStack.push({
                level: menuMatch,
                title: getAttribute(menuMatch, "title", $rootScope.tree),
                queryValue: queryValue,
                filter: lFilter
            });

            $rootScope.listFilter = "";
            console.log("menuEvent");
            console.log($scope.currentMenuStack);

            var childMenu = getChildMenuKeys(last($scope.currentMenuStack).level, $rootScope.tree)[0];

            $scope.currentMenu = [];

            var changedSelected = false;
            for (var key in childMenu) {
                if (key != "title" && key != "query" && key != "icon") {
                    if (!changedSelected) {
                        changedSelected = true;
                        $rootScope.selected.name = key;
                        $rootScope.selected.title = getAttribute(key, "title", $rootScope.tree);
                    }
                    $scope.currentMenu.push({
                        name: key,
                        queryValue: queryValue,
                        title: getAttribute(key, "title", $rootScope.tree),
                        icon: getAttribute(key, "icon", $rootScope.tree)
                    });
                }
            }

        });




        $scope.reload = function () {
            $window.location.reload();
        }
        $scope.click = function (queryValue, menuName) {
            $rootScope.$emit("requestList", queryValue, menuName);
            $rootScope.selected = {
                name: menuName,
                title: getAttribute(menuName, "title", $rootScope.tree)
            }
        }


        $scope.back = function (itemStack) {
            var cms = $scope.currentMenuStack;
            console.log(cms);
            for (var i = 0; i < cms.length; i++) {
                if (cms[i].level == itemStack.level) {
                    if (i != 0) {
                        $scope.currentMenuStack = cms.slice(0, i - 1);
                        $scope.click(itemStack.queryValue, itemStack.level);
                        console.log(itemStack.filter);
                        $scope.listFilter = itemStack.filter;

                        $rootScope.$emit("menuChangeEvent", cms[i - 1].queryValue, cms[i - 1].level);
                        break;
                    } else {
                        $scope.reload();
                    }
                    break;
                }
            }
        }


    });


/******************************************************************************/
/****************************Other Functions***********************************/
/******************************************************************************/


function getAttribute(level, attribute, obj) {
    if (level == "home") return "Home";
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {

        }
        if (i == level) {
            return ((obj[i])[0])[attribute];
        } else {
            var t = (getChildMenuKeys(level, obj[i]))[0];
            return t[attribute];
        }
    }
}

function getQuery(key, obj) {

    var attr = getAttribute(key, "query", obj);

    return attr;

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
