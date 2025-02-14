// xuất video utube lên trang web
document.addEventListener("DOMContentLoaded", function () {
    // Get the YouTube video iframe
    var iframe = document.querySelector('.youtube-video iframe');
    var player;

    // Create a YouTube player when the API is ready
    function onYouTubeIframeAPIReady() {
        player = new YT.Player(iframe, {
            events: {
                'onStateChange': onPlayerStateChange
            }
        });
    }

    // Load the YouTube IFrame API script
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Play video when the player is ready and visible
    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING) {
            // Video is playing
        }
    }

    // Observe when the video becomes visible in the viewport
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                // Autoplay video when it enters the viewport
                if (player && player.playVideo) {
                    player.playVideo();
                }
            }
        });
    }, { threshold: 0.5 });

    // Start observing the YouTube video element
    observer.observe(iframe);
});


