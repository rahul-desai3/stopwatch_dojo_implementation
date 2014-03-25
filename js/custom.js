dojoConfig = {
    parseOnLoad: true,
    async: true
};

resetStopwatch();

require(["dijit/form/ToggleButton", 
         "dijit/form/Button", 
         "dojo/dom", 
         "dojo/dom-attr", 
         "dojo/domReady!"], 
        function (ToggleButton, 
                  Button, 
                  dom, 
                  domAttr) {

    var timeUpdate;

    var toggleButton = new ToggleButton({
        showLabel: true,
        checked: false,
        label: "Start",
        onChange: function () {
            if (this.get('label') == "Start") {
                this.set('label', 'Stop');

                var milliseconds = seconds = minutes = hours = 0;

                timeUpdate = updateTime(domAttr, 0, 0, 0, 0);
            } else if (this.get('label') == "Resume") {
                this.set('label', 'Stop');

                // fetch current time in the stopwatch
                prev_milliseconds = parseInt(domAttr.get("milliseconds", "innerHTML"));
                prev_seconds = parseInt(domAttr.get("seconds", "innerHTML"));
                prev_minutes = parseInt(domAttr.get("minutes", "innerHTML"));
                prev_hours = parseInt(domAttr.get("hours", "innerHTML"));
                timeUpdate = updateTime(domAttr, prev_hours, prev_minutes, prev_seconds, prev_milliseconds);

            } else if (this.get('label') == "Stop") {
                this.set('label', 'Resume');
                clearInterval(timeUpdate);
            }
        }
    }, "start_stop_resume");

    var resetButton = new Button({
        label: "Reset",
        onClick: function () {
            toggleButton.set('label', "Start");
            clearInterval(timeUpdate);
            resetStopwatch();
            resumeFlag = false;
        }
    }, "reset");
});

function updateTime(domAttr, prev_hours, prev_minutes, prev_seconds, prev_milliseconds) {
    var startTime = new Date();
    timeUpdate = setInterval(function () {
        var timeElapsed = new Date().getTime() - startTime.getTime();

        // calculate hours                
        hours = parseInt(timeElapsed / 1000 / 60 / 60) + prev_hours;

        // calculate minutes
        minutes = parseInt(timeElapsed / 1000 / 60) + prev_minutes;
        if (minutes > 60) minutes %= 60;

        // calculate seconds
        seconds = parseInt(timeElapsed / 1000) + prev_seconds;
        if (seconds > 60) seconds %= 60;

        // calculate milliseconds 
        milliseconds = timeElapsed + prev_milliseconds;
        if (milliseconds > 1000) milliseconds %= 1000;

        // set the stopwatch
        setStopwatch(hours, minutes, seconds, milliseconds);

    }, 25); // update time in stopwatch after every 25ms

    return timeUpdate;

}

function resetStopwatch() {
    setStopwatch(0, 0, 0, 0);
}

function setStopwatch(hours, minutes, seconds, milliseconds) {
    require(["dojo/dom-attr"], function (domAttr) {
        domAttr.set("hours", "innerHTML", prependZero(hours, 2) + " ");
        domAttr.set("minutes", "innerHTML", prependZero(minutes, 2) + " ");
        domAttr.set("seconds", "innerHTML", prependZero(seconds, 2) + " ");
        domAttr.set("milliseconds", "innerHTML", prependZero(milliseconds, 3));
    });
}

function prependZero(time, length) {
    time = time + "";
    return new Array(Math.max(length - time.length + 1, 0)).join("0") + time;
}