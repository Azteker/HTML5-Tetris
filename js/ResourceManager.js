(function(window){
    'use strict';

    var cacheMap = new Map();

    var resourceTotalCount = 1;

    var currentLoaded = 0;

    var isAddLoaded = function(){
        currentLoaded+=1;
        if(currentLoaded === resourceTotalCount && typeof window.ResourceManager.onResourceLoaded === 'function'){
            window.ResourceManager.onResourceLoaded(); 
        }
    };

    var init = function(){
        var image = new Image();
        image.onload = function(){
            cacheMap.set('blocks', image);
            isAddLoaded();
        };
        image.src = 'images/blocks.png';

        console.log(image);
    };

    var getResource = function(key){
        return cacheMap.get(key);
    };

    window.ResourceManager = {
        getResource: getResource,
        init: init,
        onResourceLoaded: null
    };
})(window);