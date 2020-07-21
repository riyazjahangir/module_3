(function(){
    'use strict';

    angular.module('NarrowItDownApp',[])
    .controller('NarrowItDownController',NarrowItDownController)
    .service('MenuSearchService',MenuSearchService)
    .constant('apibasepath','https://davids-restaurant.herokuapp.com/')
    .directive('foundItems',FoundItems);

    function FoundItems(){
        var ddo = {
            templateUrl : 'menuList.html',
            
            scope :{
                items : '<',
                onRemove: '&'
            },
            controller: foundItemsDirectiveController,
            controllerAs: 'list',
            bindToController: true,
            link : foundItemsDirectiveLink
        }
        return ddo;
    }

    function foundItemsDirectiveLink(scope,element,attrs,controller){
        scope.$watch('list.CheckEmptyList()',function(n,o){
            var i = 0;
            
            if(n === true && n!=o){
                i=1;
                displayEmptyWarning();
                
            }
            else { 
                removeEmptyWarning();
                console.log(i);
            }
        });
        function displayEmptyWarning(){
            var warningElem = element.find("div");
            warningElem.css('display','block');
        }
    
        function removeEmptyWarning(){
            var warningElem = element.find("div");
            warningElem.css('display','none');
        }
    }

    function foundItemsDirectiveController(){
        var list = this;
    
      list.CheckEmptyList = function () {
        if(list.items.length == 0){
            console.log("true");
            return true;
        }
        else{
            console.log("false")
            return false;
        }
      };
    }

    NarrowItDownController.$inject = ['MenuSearchService']
    function NarrowItDownController(MenuSearchService){
        var list = this;

        list.value = '';

        list.found = '';

        list.getMatchedMenuItems = function(){
            
            list.found = MenuSearchService.getMatchedMenuItems(list.value);
            
            
        }

        list.removeItem = function(index){
            list.found.splice(index,1);
        }
    }

    MenuSearchService.$inject = ['$http','apibasepath']
    function MenuSearchService($http,apibasepath){
        var Service = this;

        Service.getMatchedMenuItems = function(value){
            value = value.toLowerCase();
            var foundItems = [];
            var response = $http({
                method:"GET",
                url:(apibasepath + "menu_items.json")   
            }).then(function(response){
                var menu = response.data;
                

                for(var i = 0;i<menu.menu_items.length;i++){
                    if(menu.menu_items[i].description.toLowerCase().indexOf(value) >= 1){
                        foundItems.push(menu.menu_items[i]);
                    }
                }
                
            })
            .catch(function(error){
                console.log(error);
            });
            return foundItems;
        }

    }

})();