/**
 * Created by odasteinlandskaug on 10.01.2018.
 */
$(function () {
    $.ajax({
        url: '/api/language',
        method: 'GET',
        data: {
            lang: 'nb_NO',
            path: window.location.pathname
        },
        success: function (data) {
            for (var p in data) {
                if (data.hasOwnProperty(p)) {
                    $("#" + p).html(data[p]);
                }
            }
        }
    });

    $('#index-norway').click(function () {
        $.ajax({
            url: '/api/language',
            method: 'GET',
            data: {
                lang: 'nb_NO',
                path: window.location.pathname
            },
            success: function (data) {
                for (var p in data) {
                    if (data.hasOwnProperty(p)) {
                        $("#" + p).html(data[p]);
                    }
                }
            }
        });
    });

    $('#index-england').click(function () {
        $.ajax({
            url: '/api/language',
            method: 'GET',
            data: {
                lang: 'en_US',
                path: window.location.pathname
            },
            success: function (data) {
                for (var p in data) {
                    if (data.hasOwnProperty(p)) {
                        $("#" + p).html(data[p]);
                    }
                }
            }
        });
    });
});

<<<<<<< HEAD

=======
>>>>>>> 5d15ac4df8e0a877860677071ea23f3cd94eca30