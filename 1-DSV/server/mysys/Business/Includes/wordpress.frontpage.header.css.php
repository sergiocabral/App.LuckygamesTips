<style>
    .site-info {
        display: none;
    }

    .site-branding-text a {
        text-shadow: 0 0 50px rgba(0, 0, 0, 0.5), 0 0 50px rgba(0, 0, 0, 0.5);
    }

    .site-branding-text p {
        text-shadow: 0 0 10px rgba(0, 0, 0, 1), 0 0 30px rgba(0, 0, 0, 1);
    }

    .custom-header-media {
        background-image: url('<?php echo \Mysys\Core\Base::GetWebsiteUrl('/Images/background-with-logo.png') ?>');
        background-position: top center;
        background-size: cover;
    }

    #wp-custom-header img {
        visibility: hidden;
    }

    .edit-link {
        display: none !important;
    }

    .menu-toggle {
        display: none !important;
    }

    .main-navigation > div > ul {
        display: block !important;
    }
</style>