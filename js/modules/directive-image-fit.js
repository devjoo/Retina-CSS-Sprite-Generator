define(['angular', 'app', 'image-background'], function (angular, app, bgImage) {

    /* DIRECTIVE: (data-image-fit) Use on an image element. Gets the image and resizes it to fit the width and height of the container while
                maintaining the aspect ratio of the displayed image. If the image is smaller than the element, it is simply centered. */
    app.directive('imageFit', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {

                var currentSrc = null;
                elem.css('opacity', 0);

                function update(src) {
                    if (!src || currentSrc === src)
                        return;
                    
                    currentSrc = src;
                    
                    var image = new Image();
                    image.onload = function () {

                        var canvas = document.createElement('CANVAS');
                        var context = canvas.getContext('2d');
                        var rect = elem[0].getBoundingClientRect();
                        canvas.width = rect.width;
                        canvas.height = rect.height;

                        // draw background
                        var totalX = Math.ceil(canvas.width / bgImage.width);
                        var totalY = Math.ceil(canvas.height / bgImage.height);
                        for (var x = 0; x < totalX; x++) {
                            for (var y = 0; y < totalY; y++) {
                                context.drawImage(bgImage, x * bgImage.width, y * bgImage.height,
                                    bgImage.width, bgImage.height);
                            }
                        }

                        var width = image.width; // the new image draw width
                        var height = image.height; // the new image draw height

                        if (image.width > canvas.width || image.height > canvas.height) {

                            // get ratio of image width to height and make the image the same width as the container
                            var ratio = image.height / image.width;
                            width = canvas.width;
                            height = canvas.width * ratio; // maintain aspect ratio

                            // make sure the new size isn't taller than the container
                            if (height > canvas.height) {

                                // make the image the same height as the container
                                ratio = image.width / image.height;
                                width = canvas.height * ratio; // maintain aspect ratio
                                height = canvas.height;
                            }
                        }
                        
                        // center image
                        var top =  (canvas.height - height) / 2; // The offset of the image from the top of the container
                        var left = (canvas.width - width) / 2; // The offset of the image from the left of the container
                        
                        context.drawImage(image, left, top, width, height);
                        elem[0].src = canvas.toDataURL('image/png');
                        currentSrc = elem[0].src;
                        elem.css('opacity', 1);
                    }
                    image.src = src;
                }

                scope.$watch(function () {
                    return elem[0].src;
                }, function (src) {
                    src && update(src);
                })
            }
        }
    });


});