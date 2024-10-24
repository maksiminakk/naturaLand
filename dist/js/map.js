document.addEventListener('DOMContentLoaded', function () {
    const map = document.getElementById('map');
    if (map) {
        ymaps.ready(function () {
            var myMap = new ymaps.Map(map, {
                center: [55.425646, 38.264243],
                zoom: 12,
                controls: ['zoomControl', 'rulerControl']
            });

            var placemark = new ymaps.Placemark([55.418098, 38.359850], {
                
            }, {
                preset: '',
                iconLayout: 'default#image',
                iconImageHref: 'img/icons/mark.svg',
                iconImageSize: [97, 108],
            });
            myMap.geoObjects.add(placemark);
            function setCoordinate(x) {
                if (x.matches) { // If media query matches
                    myMap.setCenter([55.457173, 38.374966]);
                }
            }
        
            var x = window.matchMedia("(max-width: 1023px)");
            setCoordinate(x);
            x.addListener(setCoordinate);
        });
        

    }
});