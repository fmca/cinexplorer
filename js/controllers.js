myApp.factory('focus', function ($timeout) {
    return function (id) {
        // timeout makes sure that is invoked after any other event has been triggered.
        // e.g. click events that need to run before the focus or
        // inputs elements that are in a disabled state but are enabled when those events
        // are triggered.
        $timeout(function () {

            var element = document.getElementById(id);
            if (element)
                element.focus();
        });
    };
});


myApp.filter('toHtml', function ($sce) {
    return $sce.trustAsHtml;
});


myApp.controller("LanguageCtrl",
    function ($scope, $rootScope, $cookieStore, strings) {



        $rootScope.changeLanguage = function (languageAbbreviation) {

            angular.forEach($rootScope.languages, function (element, index) {
                if (element.abbreviation == languageAbbreviation) {
                    $rootScope.lang = element;
                    $cookieStore.put("language", $rootScope.lang);
                    $rootScope.reload();
                    return;
                }
            });

        }

        $rootScope.languages = [{
            abbreviation: "pt_BR",
            title: "Portuguese"
        }, {
            abbreviation: "en_US",
            title: "English"
        }];



        $rootScope.lang = $cookieStore.get("language");
        if (!$rootScope.lang) {
            angular.forEach($rootScope.languages, function (element, index) {
                $rootScope.lang = element;
                return;
            });
        }

        /*Strings */
        $scope.strings = strings;

        $rootScope.getString = function (string) {
            for (var str in $scope.strings) {
                if (str == string) {
                    return (($scope.strings)[str])[$rootScope.lang.abbreviation];
                }
            }
        }

        $rootScope.getHtml = function (string) {
            return Autolinker.link(string, {
                "email": false
            });
        }





    });

/******************************************************************************/
/****************************ListCtrl******************************************/
/******************************************************************************/
myApp.controller("ListCtrl",
    function ($scope, $rootScope, menuTree, focus) {
        focus("filter");





        $scope.showGroupFilter = function (groupName) {
            if (groupName != 'none') return groupName;
        }

        $scope.addGroup = function (group) {

            var i = $.inArray(group, $scope.groups);
            if (i == -1) {
                $scope.groups.push(group);
                $scope.selectedGroups.push(group);
            }
        }

        $scope.toggleGroup = function (group) {
            var i = $.inArray(group, $scope.selectedGroups);
            if (i > -1) {
                console.log(group);
                $scope.selectedGroups.splice(i, 1);
                console.log($scope.selectedGroups);
            } else {
                $scope.selectedGroups.push(group);
            }
        }

        $scope.groupFilter = function (item) {
            if ($scope.selectedGroups.length > 0) {
                if ($.inArray(item.group, $scope.selectedGroups) >= 0)
                    return item;
            }

            return;
        }


        $scope.data = [

            {
                title: "Title",
                desc: "Description",
                clickable: true,
                queryValue: "",
                menuMatch: "academic"
            }];

        $rootScope.$on("requestList", function (event, queryValue, menu, strings) {



            $scope.groups = [];
            $scope.selectedGroups = [];

            $rootScope.listLoaded = false;
            $scope.listFilter = "";

            $scope.querySuccess = function (response) {
                var json = JSON.parse(response);
                var results = (json.results.bindings);

                var title = [],
                    desc = [],
                    clickable = [],
                    queryValue = [],
                    menuMatch = [],
                    group = [];

                var removeNamespace = function (item) {
                    if (item && item.hasOwnProperty("value")) {
                        var namespace = "http://www.cin.ufpe.br/opencin/";
                        item = item.value;
                        item = item.replace(namespace, "");
                        return item.charAt(0).toUpperCase() + item.slice(1);;
                    }
                    return item;

                }
                for (var i = 0; i < results.length; i++) {

                    title[i] = removeNamespace(results[i].title);
                    desc[i] = $scope.getHtml(results[i].desc.value);
                    queryValue[i] = results[i].queryValue.value;
                    menuMatch[i] = menu;
                    clickable[i] = getQuery(menu, menuTree).results.clickable;
                    group[i] = removeNamespace(results[i].group == null ? 'none' : results[i].group);
                    $scope.addGroup(group[i]);

                    $scope.data.push({
                        "title": title[i],
                        "desc": desc[i],
                        "clickable": clickable[i],
                        "queryValue": queryValue[i],
                        "menuMatch": menuMatch[i],
                        "group": group[i]
                    });


                }

                $rootScope.listLoaded = true;

                $scope.$apply();
            }

            $scope.queryFail = function (response) {

                $scope.data = [{
                    "title": $rootScope.getString("error"),
                    "desc": $rootScope.getString("error_cin_connection"),
                    "clickable": false,
                    "queryValue": "",
                    "menuMatch": $rootScope.selected.name
                }];

                $rootScope.listLoaded = true;

                $scope.$apply();
            }

            $scope.data = [];

            var queryString = getQuery(menu, menuTree);
            var sparql = queryString.sparql;
            var sparql = sparql.split("%%%").join(queryValue) //replace all occurences


            console.log("querying: " + sparql);
            query(
                sparql,
                "json",
                $scope.querySuccess,
                $scope.queryFail);

        });

        $scope.shouldShow = function (result) {
            if (result) {
                return true;
            } else {
                return false;
            }
        }


        $scope.click = function (queryValue, menuMatch, nextHeaderTitle) {
            $rootScope.$emit("menuChangeEvent", queryValue, menuMatch, nextHeaderTitle);
            $rootScope.$emit("requestList", queryValue, $rootScope.selected.name);

        }


        /*First menu is home*/
        $scope.click("", "home", "");


    });

/******************************************************************************/
/****************************MenuCtrl******************************************/
/******************************************************************************/

myApp.controller("MenuCtrl",
    function ($scope, $rootScope, $window, menuTree) {




        /*Current menu handling*/
        /*{
            level: "home",
            currentCategory: "academic",
            queryValue: ""
        }*/
        $scope.currentMenuStack = [];

        $rootScope.selected = {};

        $rootScope.$on("menuChangeEvent", function (event, queryValue, menu, headerTitle) {


            $scope.currentMenuStack.push({
                header: headerTitle,
                level: menu,
                currentCategory: "",
                title: $rootScope.getString(menu),
                queryValue: queryValue
            });

            $rootScope.header = headerTitle;

            var childMenu = getChildMenuKeys(menu, menuTree)[0];

            var key = childMenu["query"]["results"]["menuMatch"];
            $scope.currentMenu = [];
            $rootScope.selected.name = key;
            $rootScope.selected.title = $rootScope.getString(key);
            last($scope.currentMenuStack).currentCategory = key;
            
            
            var parent = getParent(key, menuTree);
            console.log(key, " -> parent: ", parent);

            var changedSelected = false;
            for (var key in parent) {
                if (key != "title" && key != "query" && key != "icon") {
                    if (!changedSelected) {
                        console.log("childMenu: ", key, childMenu);
                        changedSelected = true;

                    }

                    $scope.currentMenu.push({
                        name: key,
                        queryValue: queryValue,
                        currentCategory: $rootScope.selected.name,
                        title: $rootScope.getString(key),
                        icon: getAttribute(key, "icon", menuTree)
                    });
                }
            }

        });




        $rootScope.reload = function () {
            $window.location.reload();
        }
        $scope.click = function (queryValue, menuName) {
            $rootScope.$emit("requestList", queryValue, menuName);
            last($scope.currentMenuStack).currentCategory = menuName;
            console.log($scope.currentMenuStack);
            $rootScope.selected = {
                name: menuName,
                title: $rootScope.getString(menuName)
            }
        }

        $scope.back = function (itemStack) {

            var cms = $scope.currentMenuStack;
            if (!itemStack) {
                itemStack = cms[cms.length - 1];
            }



            for (var i = 0; i < cms.length; i++) {
                if (cms[i].level == itemStack.level) {
                    if (i != 0) {
                        $rootScope.$emit("menuChangeEvent", cms[i - 1].queryValue, cms[i - 1].level, cms[i - 1].header);

                        $scope.click(cms[i - 1].queryValue, itemStack.level);
                        $scope.currentMenuStack = cms.slice(0, i);

                        break;
                    } else {
                        $scope.reload();
                    }
                    break;
                }
            }
        }

        focus("filter");


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

function getParent(key, tree){
    var parent = undefined;
    for (var i in tree) {
        if (!tree.hasOwnProperty(i)) continue;
        if (typeof tree[i] == 'object') {
            var recursiveParent = getParent(key, tree[i]);
            if(recursiveParent){
                parent = recursiveParent;
                break;
            }
        }
        if (i == key) {
            parent = tree;
        }
    }
    
    return parent;
    
}


var last = function (array) {
    return array[array.length - 1];
}
