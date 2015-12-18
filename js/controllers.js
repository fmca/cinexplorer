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
            title: "Português"
        }, {
            abbreviation: "en_US",
            title: "English"
        }];



        $rootScope.lang = $cookieStore.get("language");
        if (!$rootScope.lang) {
                $rootScope.lang = $rootScope.languages[0];
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
    function ($scope, $rootScope, menuTree) {

	$scope.charts = [
		/*{
			title: "Test",
			labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
			series: ['Series A', 'Series B'],
			data: [
				[65, 59, 80, 81, 56, 55, 40],
				[28, 48, 40, 19, 86, 27, 90]
			]
		}*/
	]
  
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
                $scope.selectedGroups.splice(i, 1);
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
		
		$scope.filters = {};
		$scope.filters.listFilter = "";


        $scope.data = [

            {
                title: "Title",
                desc: "Description",
                clickable: true,
                queryValue: "",
                menuMatch: "academic"
            }];
			
		$scope.generateEachChart = function(count, menuTreeCharts, queryValue){
			
			if(count < menuTreeCharts.length){
				var title = $rootScope.getString(menuTreeCharts[count].id);
					var type = menuTreeCharts[count].type;
					var category  = menuTreeCharts[count].category;
					var sparqlQuery = (menuTreeCharts[count].sparql).split("%%%").join(queryValue);
					//console.log("query", menuTreeCharts[count])
					//TODO chart type
					query(
					sparqlQuery,
					"json",
					function(response){
						var json = JSON.parse(response);
						var results = (json.results.bindings);
						
						if(category == 'graph'){
							var labels = []
							var series = []
							var data = []
							for(var i=0; i<results.length; i++){
								if(labels.indexOf(removeNamespace(results[i].x)) == -1){
									labels.push(removeNamespace(results[i].x))
								}
								if(results[i].cat != undefined && series.indexOf(removeNamespace(results[i].cat)) == -1){
									series.push(removeNamespace(results[i].cat))
								}
							}
							
							if(series.length > 0){
								for(var i=0; i<series.length; i++){
									data.push([]);
									for(k=0; k<labels.length; k++){
										data[i].push(0);
									}
								}
							}
							
							for(var i=0; i<results.length; i++){
								var pushIndex = series.length > 0 ? data[series.indexOf(removeNamespace(results[i].cat))] : data;
								pushIndex[labels.indexOf(removeNamespace(results[i].x))] = removeNamespace(results[i].y);
							}
							$scope.charts.push({title: title, category: category, type: type, labels: labels, series: series, data: data});
							console.log("charts", $scope.charts)
							
						}else if(category == 'wordCloud'){
							var cloud = [];
							var totalWeight = 0;
							for(var i=0; i<results.length; i++){
								var word = removeNamespace(results[i].x);
								var weight = parseInt(results[i].y.value);
								totalWeight += weight;
								cloud.push({text: word, weight: weight});
							}
							
							
							console.log("cloud: ", cloud)
							console.log(totalWeight);
							
							$scope.charts.push({title: title, category: category, cloud: cloud, totalWeight: totalWeight})
						}
						
						
						if(++count < menuTreeCharts.length){
							$scope.generateEachChart(count, menuTreeCharts, queryValue);
						}else{
							$scope.$apply();
						}
						
					},
					function(){console.log("generateChart query fail")});
			}
			
		}

		$scope.generateCharts = function (menu, queryValue){
			
			var menuTreeCharts = getAttribute(menu, "charts", menuTree);
			$scope.menuHasChart = false;
			if(menuTreeCharts){				
				$scope.menuHasChart = true;
				$scope.generateEachChart(0, menuTreeCharts, queryValue)
				
			}
			
			
		}
		
        $rootScope.$on("requestList", function (event, queryValue, menu, strings) {
            $scope.groups = [];
            $scope.selectedGroups = [];

            $rootScope.listLoaded = false;
            $scope.filters.listFilter = "";
			
			$scope.charts = [];
			$scope.generateCharts(menu, queryValue);

            $scope.querySuccess = function (response) {
                var json = JSON.parse(response);
                var results = (json.results.bindings);

                var title = [],
                    desc = [],
                    clickable = [],
                    queryValue = [],
                    menuMatch = [],
                    group = [];

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


            //console.log("querying: " + sparql);
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


        $scope.listItemClick = function (queryValue, menuMatch, nextHeaderTitle) {
            $rootScope.$emit("menuChangeEvent", queryValue, menuMatch, nextHeaderTitle);
            $rootScope.$emit("requestList", queryValue, $rootScope.selected.name);
        }


        /*First menu is home*/
        $scope.listItemClick("", "home", "");


    });

/******************************************************************************/
/****************************MenuCtrl******************************************/
/******************************************************************************/

myApp.controller("MenuCtrl",
    function ($scope, $rootScope, $window, menuTree, $location) {

	
	/*$rootScope.$on("$locationChangeStart", function(args){
		console.log("test");
	})*/

		

        /*Current menu handling*/
        /*{
            level: "home",
            currentCategory: "academic",
            queryValue: ""
        }*/
        $scope.currentMenuStack = [];

        $rootScope.selected = {};

        $rootScope.$on("menuChangeEvent", function (event, queryValue, menu, headerTitle) {

		//$location.url('/test/year/' + new Date());
		console.log($location.url())

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

            var changedSelected = false;
            for (var key in parent) {
                if (key != "title" && key != "query" && key != "icon" && key!="charts") {
                    if (!changedSelected) {
                        //console.log("childMenu: ", key, childMenu);
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
        $scope.menuClick = function (queryValue, menuName) {
            $rootScope.$emit("requestList", queryValue, menuName);
            last($scope.currentMenuStack).currentCategory = menuName;
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

                        $scope.menuClick(cms[i - 1].queryValue, itemStack.level);
                        $scope.currentMenuStack = cms.slice(0, i);

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
 
function clearElem(element){
		$(element).val('')
}
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

var removeNamespace = function (item) {
                    if (item && item.hasOwnProperty("value")) {
                        var namespace = "http://www.cin.ufpe.br/opencin/";
                        item = item.value;
                        item = item.replace(namespace, "");
                        return item.charAt(0).toUpperCase() + item.slice(1);;
                    }
                    return item;

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

