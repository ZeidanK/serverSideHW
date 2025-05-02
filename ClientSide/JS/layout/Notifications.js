$.notify.addStyle('midCenter', {
    html: "<div data-notify='container' class='col-xs-12 col-sm-4 alert alert-{0}' role='alert'>" +
          "<span data-notify='icon'></span> " +
          "<span data-notify='title'>{1}</span> " +
          "<span data-notify='message'>{2}</span>" +
          "</div>",
    classes: {
        success: {
            "background-color": "#4caf50",
            "color": "white"
        },
        error: {
            "background-color": "#f44336",
            "color": "white"
        },
        warning: {
            "background-color": "#ff9800",
            "color": "white"
        },
        info: {
            "background-color": "#2196f3",
            "color": "white"
        }
    }
});

function showNotification(message, type) {
    const validTypes = ['success', 'error', 'warning', 'info'];
    if (!validTypes.includes(type)) {
        console.error(`Invalid notification type: ${type}`);
        return;
    }

    $.notify({
        message: message
    }, {
        style: 'midCenter',
        className: type,
        autoHide: true,
        autoHideDelay: 5000,
        placement: {
            from: "top",
            align: "center"
        },
        offset: {
            y: ($(window).height() / 2) - 50,
            x: 0
        }
    });
}
// Example usage:
// showNotification('Operation successful!', 'success');
// showNotification('An error occurred.', 'error');
// showNotification('This is a warning.', 'warning');
// showNotification('Information message.', 'info');
