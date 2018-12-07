<style>
    html {
        background-color: #222222;
        background-image: url('<?php echo home_url('/Media/background-without-logo.png') ?>');
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-size: cover;
        background-position: left;
    }

    body {
        background: none;
        color: #778899;
    }

    #login {
        min-width: 320px;
        max-width: 600px;
        width: 40%;
        padding-top: 5%;
    }

    @media screen and (max-width: 782px) {
        #login {
            min-width: 0;
            width: 60%;
        }
    }

    @media only screen and (max-width: 400px) {
        #login {
            min-width: 0;
            width: 90%;
        }
    }

    .login h1 a,
    .login h1 a:focus,
    .login h1 a:active {
        background-image: url('<?php echo home_url('/Media/logo.png') ?>');
        background-size: contain;
        width: 100%;
        height: 150px;
        margin: 0 auto;
        box-shadow: none;
    }

    .login #nav a,
    .login #backtoblog a {
        color: #778899;
    }

        .login #nav a:active,
        .login #nav a:focus,
        .login #backtoblog a:active,
        .login #backtoblog a:focus {
            color: #a5b9ce;
            box-shadow: none;
        }

    .login form {
        background-color: rgba(20,25,30,0.9);
        box-shadow: 0 0 10px rgba(0,0,0,1);
        border-radius: 5px;
    }

    .login label {
        color: #C99921;
    }

    .login .button-primary,
    .login .button-primary:focus,
    .login .button-primary:active {
        box-shadow: 2px 2px 5px rgba(0,0,0,0.7);
    }

    .login .button-secondary.wp-hide-pw {
        border: 0px solid #778899;
        border-left-width: 5px;
        border-top-width: 1px;
        border-bottom-width: 1px;
        box-shadow: none;
        padding-top: 7px;
        padding-left: 14px;
        padding-right: 14px;
    }

    .login #pass-strength-result {
        margin-top: 5px;
    }

    .login form .input,
    .login input[type="text"],
    .login form input[type="checkbox"] {
        background: rgba(255,255,255,0.2);
        color: #DDDDDD;
    }

    .login form .input,
    .login input[type="text"] {
        padding: 2px 10px 5px 10px;
    }
</style>