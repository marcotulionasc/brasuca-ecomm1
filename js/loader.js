document.addEventListener("DOMContentLoaded", function() {
    // Set a timeout for the preloader
    setTimeout(function() {
        document.getElementById('preloader-active').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    }, 3000); // 3 seconds
});
