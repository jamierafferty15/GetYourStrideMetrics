const KM_PER_MILE = 1.609344;
const RIEGEL_EXPONENT = 1.06;

const NEGATIVE_SPLIT_OPENING_FRACTION = 0.20;
const NEGATIVE_SPLIT_MIDDLE_FRACTION = 0.60;
const NEGATIVE_SPLIT_FINISH_FRACTION =
    1 -
    NEGATIVE_SPLIT_OPENING_FRACTION -
    NEGATIVE_SPLIT_MIDDLE_FRACTION;

const NEGATIVE_SPLIT_OPENING_FACTOR = 1.03;
const NEGATIVE_SPLIT_MIDDLE_FACTOR = 1.00;

const NEGATIVE_SPLIT_FINISH_FACTOR =
    (
        1 -
        (
            NEGATIVE_SPLIT_OPENING_FRACTION *
            NEGATIVE_SPLIT_OPENING_FACTOR
        ) -
        (
            NEGATIVE_SPLIT_MIDDLE_FRACTION *
            NEGATIVE_SPLIT_MIDDLE_FACTOR
        )
    ) /
    NEGATIVE_SPLIT_FINISH_FRACTION;


const raceDistances = {
    fiveK: 5,
    tenK: 10,
    halfMarathon: 21.0975,
    marathon: 42.195
};


const goalShortcuts = {

    "5k": [
        { label: "Sub-20", hours: 0, minutes: 20, seconds: 0 },
        { label: "Sub-25", hours: 0, minutes: 25, seconds: 0 },
        { label: "Sub-30", hours: 0, minutes: 30, seconds: 0 }
    ],

    "10k": [
        { label: "Sub-40", hours: 0, minutes: 40, seconds: 0 },
        { label: "Sub-45", hours: 0, minutes: 45, seconds: 0 },
        { label: "Sub-50", hours: 0, minutes: 50, seconds: 0 }
    ],

    "half": [
        { label: "Sub-1:30", hours: 1, minutes: 30, seconds: 0 },
        { label: "Sub-1:40", hours: 1, minutes: 40, seconds: 0 },
        { label: "Sub-1:45", hours: 1, minutes: 45, seconds: 0 },
        { label: "Sub-2:00", hours: 2, minutes: 0, seconds: 0 }
    ],

    "marathon": [
        { label: "Sub-3:00", hours: 3, minutes: 0, seconds: 0 },
        { label: "Sub-3:30", hours: 3, minutes: 30, seconds: 0 },
        { label: "Sub-4:00", hours: 4, minutes: 0, seconds: 0 },
        { label: "Sub-4:30", hours: 4, minutes: 30, seconds: 0 }
    ]

};


let showEverySplit = false;
let currentTargetRaceKey = "half";
let currentRaceStrategy = "even";


/* DOM */

const calculateButton = document.getElementById("calculate");
const resetButton = document.getElementById("reset");
const themeToggle = document.getElementById("themeToggle");

const presetButtons = document.querySelectorAll(".preset-button");
const customPreset = document.getElementById("customPreset");

const distanceInput = document.getElementById("distance");
const distanceUnitInput = document.getElementById("distanceUnit");
const hoursInput = document.getElementById("hours");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");

const errorMessage = document.getElementById("errorMessage");
const savedMessage = document.getElementById("savedMessage");


const targetPresetButtons =
    document.querySelectorAll(".target-preset-button");

const targetCustomPreset =
    document.getElementById("targetCustomPreset");

const targetDistanceInput =
    document.getElementById("targetDistance");

const targetDistanceUnitInput =
    document.getElementById("targetDistanceUnit");

const targetHoursInput =
    document.getElementById("targetHours");

const targetMinutesInput =
    document.getElementById("targetMinutes");

const targetSecondsInput =
    document.getElementById("targetSeconds");

const calculateTargetButton =
    document.getElementById("calculateTarget");

const resetTargetButton =
    document.getElementById("resetTarget");

const targetErrorMessage =
    document.getElementById("targetErrorMessage");


const goalShortcutsContainer =
    document.getElementById("goalShortcuts");

const goalShortcutButtons =
    document.getElementById("goalShortcutButtons");


const strategyButtons =
    document.querySelectorAll(".strategy-button");

const strategyExplanation =
    document.getElementById("strategyExplanation");

const strategyPhaseOneLabel =
    document.getElementById("strategyPhaseOneLabel");

const strategyPhaseTwoLabel =
    document.getElementById("strategyPhaseTwoLabel");

const strategyPhaseThreeLabel =
    document.getElementById("strategyPhaseThreeLabel");

const strategyPhaseOnePace =
    document.getElementById("strategyPhaseOnePace");

const strategyPhaseTwoPace =
    document.getElementById("strategyPhaseTwoPace");

const strategyPhaseThreePace =
    document.getElementById("strategyPhaseThreePace");

const strategyPhaseOneDistance =
    document.getElementById("strategyPhaseOneDistance");

const strategyPhaseTwoDistance =
    document.getElementById("strategyPhaseTwoDistance");

const strategyPhaseThreeDistance =
    document.getElementById("strategyPhaseThreeDistance");


const splitToggle =
    document.getElementById("splitToggle");

const splitRows =
    document.getElementById("splitRows");

const splitSummary =
    document.getElementById("splitSummary");


const copyRunButton =
    document.getElementById("copyRun");

const shareRunButton =
    document.getElementById("shareRun");

const copyRacePlanButton =
    document.getElementById("copyRacePlan");

const shareRacePlanButton =
    document.getElementById("shareRacePlan");

const runActionMessage =
    document.getElementById("runActionMessage");

const raceActionMessage =
    document.getElementById("raceActionMessage");


/* FORMATTING */

function formatTime(totalSeconds) {

    totalSeconds = Math.round(totalSeconds);

    const hours =
        Math.floor(totalSeconds / 3600);

    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );

    const seconds =
        totalSeconds % 60;


    if (hours > 0) {

        return (
            hours +
            ":" +
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0")
        );

    }


    return (
        minutes +
        ":" +
        String(seconds).padStart(2, "0")
    );

}


function formatPace(totalSeconds) {

    let minutes =
        Math.floor(totalSeconds / 60);

    let seconds =
        Math.round(totalSeconds % 60);


    if (seconds === 60) {

        minutes += 1;
        seconds = 0;

    }


    return (
        minutes +
        ":" +
        String(seconds).padStart(2, "0")
    );

}


function formatPaceRange(
    fasterSeconds,
    slowerSeconds
) {

    return (
        formatPace(fasterSeconds) +
        "–" +
        formatPace(slowerSeconds) +
        " /km"
    );

}


function formatMileRange(
    fasterSecondsKm,
    slowerSecondsKm
) {

    return (
        formatPace(
            fasterSecondsKm *
            KM_PER_MILE
        ) +
        "–" +
        formatPace(
            slowerSecondsKm *
            KM_PER_MILE
        ) +
        " /mile"
    );

}


function formatSplitDistance(
    distance,
    unit
) {

    const unitLabel =
        unit === "miles"
            ? "mi"
            : "km";


    if (Number.isInteger(distance)) {

        return (
            distance +
            " " +
            unitLabel
        );

    }


    return (
        distance.toFixed(2) +
        " " +
        unitLabel
    );

}


/* VALIDATION */

function validateInputs(
    distance,
    hours,
    minutes,
    seconds
) {

    if (
        !Number.isFinite(distance) ||
        distance <= 0
    ) {

        return "Please enter a distance greater than 0.";

    }


    if (
        !Number.isFinite(hours) ||
        hours < 0
    ) {

        return "Hours cannot be negative.";

    }


    if (
        !Number.isFinite(minutes) ||
        minutes < 0 ||
        minutes > 59
    ) {

        return "Minutes must be between 0 and 59.";

    }


    if (
        !Number.isFinite(seconds) ||
        seconds < 0 ||
        seconds > 59
    ) {

        return "Seconds must be between 0 and 59.";

    }


    const totalSeconds =
        (hours * 3600) +
        (minutes * 60) +
        seconds;


    if (totalSeconds <= 0) {

        return "Please enter a finishing time greater than 0.";

    }


    return "";

}


/* MESSAGES */

function showError(message) {

    errorMessage.textContent = message;
    errorMessage.style.display = "block";

}


function clearError() {

    errorMessage.textContent = "";
    errorMessage.style.display = "none";

}


function showTargetError(message) {

    targetErrorMessage.textContent = message;
    targetErrorMessage.style.display = "block";

}


function clearTargetError() {

    targetErrorMessage.textContent = "";
    targetErrorMessage.style.display = "none";

}


function showActionMessage(
    element,
    message
) {

    element.textContent = message;
    element.style.display = "block";


    window.setTimeout(
        function () {

            element.style.display = "none";
            element.textContent = "";

        },
        3000
    );

}


/* ACCESSIBLE BUTTON STATES */

function setButtonActive(
    button,
    isActive
) {

    button.classList.toggle(
        "active",
        isActive
    );


    button.setAttribute(
        "aria-pressed",
        isActive
            ? "true"
            : "false"
    );

}


function removeActive(buttons) {

    buttons.forEach(
        function (button) {

            setButtonActive(
                button,
                false
            );

        }
    );

}


/* CLEAR RESULTS */

function clearRunResults() {

    const ids = [
        "paceKmResult",
        "paceMileResult",
        "kmhResult",
        "mphResult",
        "same5k",
        "samePace5k",
        "same10k",
        "samePace10k",
        "sameHalf",
        "samePaceHalf",
        "sameMarathon",
        "samePaceMarathon",
        "predicted5k",
        "predictedPace5k",
        "predicted10k",
        "predictedPace10k",
        "predictedHalf",
        "predictedPaceHalf",
        "predictedMarathon",
        "predictedPaceMarathon",
        "easyPace",
        "easyPaceMile",
        "steadyPace",
        "steadyPaceMile",
        "tempoPace",
        "tempoPaceMile",
        "intervalPace",
        "intervalPaceMile"
    ];


    ids.forEach(
        function (id) {

            const element =
                document.getElementById(id);

            if (element) {
                element.textContent = "--";
            }

        }
    );

}


function clearTargetResults() {

    const ids = [
        "targetPaceKm",
        "targetPaceMile",
        "targetKmh",
        "targetMph"
    ];


    ids.forEach(
        function (id) {

            document
                .getElementById(id)
                .textContent = "--";

        }
    );


    strategyPhaseOnePace.textContent = "--";
    strategyPhaseTwoPace.textContent = "--";
    strategyPhaseThreePace.textContent = "--";

    strategyPhaseOneDistance.textContent = "--";
    strategyPhaseTwoDistance.textContent = "--";
    strategyPhaseThreeDistance.textContent = "--";

    splitRows.innerHTML = "";
    splitSummary.textContent = "";

}


/* RUN PRESETS */

function updatePresetSelection() {

    const distance =
        Number(distanceInput.value);

    const unit =
        distanceUnitInput.value;

    let matchedPreset = false;


    removeActive(presetButtons);


    if (unit === "km") {

        presetButtons.forEach(
            function (button) {

                if (!button.dataset.distance) {
                    return;
                }


                const presetDistance =
                    Number(
                        button.dataset.distance
                    );


                if (
                    Math.abs(
                        distance -
                        presetDistance
                    ) < 0.0001
                ) {

                    setButtonActive(
                        button,
                        true
                    );

                    matchedPreset = true;

                }

            }
        );

    }


    if (!matchedPreset) {

        setButtonActive(
            customPreset,
            true
        );

    }

}


/* GOAL SHORTCUTS */

function clearGoalShortcutSelection() {

    const buttons =
        goalShortcutButtons
            .querySelectorAll(
                ".goal-shortcut-button"
            );


    buttons.forEach(
        function (button) {

            setButtonActive(
                button,
                false
            );

        }
    );

}


function renderGoalShortcuts(raceKey) {

    goalShortcutButtons.innerHTML = "";


    if (!goalShortcuts[raceKey]) {

        goalShortcutsContainer
            .classList
            .add("hidden");

        return;

    }


    goalShortcutsContainer
        .classList
        .remove("hidden");


    goalShortcuts[raceKey].forEach(
        function (shortcut) {

            const button =
                document.createElement(
                    "button"
                );


            button.type = "button";
            button.className =
                "goal-shortcut-button";

            button.textContent =
                shortcut.label;

            button.setAttribute(
                "aria-pressed",
                "false"
            );


            button.addEventListener(
                "click",
                function () {

                    targetHoursInput.value =
                        shortcut.hours;

                    targetMinutesInput.value =
                        shortcut.minutes;

                    targetSecondsInput.value =
                        shortcut.seconds;


                    clearGoalShortcutSelection();


                    setButtonActive(
                        button,
                        true
                    );


                    calculateTargetPace();

                }
            );


            goalShortcutButtons
                .appendChild(button);

        }
    );

}


/* TARGET PRESETS */

function updateTargetPresetSelection() {

    const distance =
        Number(
            targetDistanceInput.value
        );

    const unit =
        targetDistanceUnitInput.value;

    let matchedPreset = false;
    let matchedRaceKey = null;


    removeActive(targetPresetButtons);


    if (unit === "km") {

        targetPresetButtons.forEach(
            function (button) {

                if (
                    !button.dataset.targetDistance
                ) {
                    return;
                }


                const presetDistance =
                    Number(
                        button.dataset.targetDistance
                    );


                if (
                    Math.abs(
                        distance -
                        presetDistance
                    ) < 0.0001
                ) {

                    setButtonActive(
                        button,
                        true
                    );


                    matchedPreset = true;
                    matchedRaceKey =
                        button.dataset.raceKey;

                }

            }
        );

    }


    if (!matchedPreset) {

        setButtonActive(
            targetCustomPreset,
            true
        );


        currentTargetRaceKey = null;


        renderGoalShortcuts(null);

        return;

    }


    const shortcutsMissing =
        goalShortcutButtons
            .children
            .length === 0;


    if (
        currentTargetRaceKey !==
        matchedRaceKey ||
        shortcutsMissing
    ) {

        currentTargetRaceKey =
            matchedRaceKey;


        renderGoalShortcuts(
            currentTargetRaceKey
        );

    }

}


/* RIEGEL PREDICTIONS */

function predictRaceTime(
    knownTime,
    knownDistance,
    targetDistance
) {

    return (
        knownTime *
        Math.pow(
            targetDistance /
            knownDistance,
            RIEGEL_EXPONENT
        )
    );

}


function displaySamePace(
    paceSecondsPerKm
) {

    const races = [

        {
            timeId: "same5k",
            paceId: "samePace5k",
            distance: raceDistances.fiveK
        },

        {
            timeId: "same10k",
            paceId: "samePace10k",
            distance: raceDistances.tenK
        },

        {
            timeId: "sameHalf",
            paceId: "samePaceHalf",
            distance:
                raceDistances.halfMarathon
        },

        {
            timeId: "sameMarathon",
            paceId: "samePaceMarathon",
            distance:
                raceDistances.marathon
        }

    ];


    races.forEach(
        function (race) {

            document
                .getElementById(
                    race.timeId
                )
                .textContent =
                formatTime(
                    paceSecondsPerKm *
                    race.distance
                );


            document
                .getElementById(
                    race.paceId
                )
                .textContent =
                formatPace(
                    paceSecondsPerKm
                ) +
                " /km";

        }
    );

}


function getPredictions(
    totalSeconds,
    distanceKm
) {

    return {

        fiveK:
            predictRaceTime(
                totalSeconds,
                distanceKm,
                raceDistances.fiveK
            ),

        tenK:
            predictRaceTime(
                totalSeconds,
                distanceKm,
                raceDistances.tenK
            ),

        half:
            predictRaceTime(
                totalSeconds,
                distanceKm,
                raceDistances.halfMarathon
            ),

        marathon:
            predictRaceTime(
                totalSeconds,
                distanceKm,
                raceDistances.marathon
            )

    };

}


function displayPredictions(
    predictions
) {

    const races = [

        {
            timeId: "predicted5k",
            paceId: "predictedPace5k",
            time: predictions.fiveK,
            distance: raceDistances.fiveK
        },

        {
            timeId: "predicted10k",
            paceId: "predictedPace10k",
            time: predictions.tenK,
            distance: raceDistances.tenK
        },

        {
            timeId: "predictedHalf",
            paceId: "predictedPaceHalf",
            time: predictions.half,
            distance:
                raceDistances.halfMarathon
        },

        {
            timeId: "predictedMarathon",
            paceId: "predictedPaceMarathon",
            time: predictions.marathon,
            distance:
                raceDistances.marathon
        }

    ];


    races.forEach(
        function (race) {

            document
                .getElementById(
                    race.timeId
                )
                .textContent =
                formatTime(
                    race.time
                );


            document
                .getElementById(
                    race.paceId
                )
                .textContent =
                formatPace(
                    race.time /
                    race.distance
                ) +
                " /km";

        }
    );

}


/* TRAINING PACES */

function displayTrainingPaces(
    predictions
) {

    const predicted10kPace =
        predictions.tenK /
        raceDistances.tenK;

    const predicted5kPace =
        predictions.fiveK /
        raceDistances.fiveK;


    const trainingRanges = {

        easy: {
            fast:
                predicted10kPace + 60,
            slow:
                predicted10kPace + 90
        },

        steady: {
            fast:
                predicted10kPace + 30,
            slow:
                predicted10kPace + 60
        },

        tempo: {
            fast:
                predicted10kPace + 10,
            slow:
                predicted10kPace + 25
        },

        interval: {
            fast:
                predicted5kPace - 5,
            slow:
                predicted5kPace + 5
        }

    };


    function displayRange(
        range,
        kmId,
        mileId
    ) {

        document
            .getElementById(kmId)
            .textContent =
            formatPaceRange(
                range.fast,
                range.slow
            );


        document
            .getElementById(mileId)
            .textContent =
            formatMileRange(
                range.fast,
                range.slow
            );

    }


    displayRange(
        trainingRanges.easy,
        "easyPace",
        "easyPaceMile"
    );

    displayRange(
        trainingRanges.steady,
        "steadyPace",
        "steadyPaceMile"
    );

    displayRange(
        trainingRanges.tempo,
        "tempoPace",
        "tempoPaceMile"
    );

    displayRange(
        trainingRanges.interval,
        "intervalPace",
        "intervalPaceMile"
    );

}


/* STORAGE */

function saveInputs() {

    const settings = {

        distance:
            distanceInput.value,

        distanceUnit:
            distanceUnitInput.value,

        hours:
            hoursInput.value,

        minutes:
            minutesInput.value,

        seconds:
            secondsInput.value

    };


    localStorage.setItem(
        "strideMetricsInputs",
        JSON.stringify(settings)
    );


    savedMessage.textContent =
        "Run details saved automatically.";

}


function loadSavedInputs() {

    const savedInputs =
        localStorage.getItem(
            "strideMetricsInputs"
        );


    if (!savedInputs) {
        return;
    }


    try {

        const settings =
            JSON.parse(savedInputs);


        distanceInput.value =
            settings.distance ?? "10";

        distanceUnitInput.value =
            settings.distanceUnit ?? "km";

        hoursInput.value =
            settings.hours ?? "0";

        minutesInput.value =
            settings.minutes ?? "45";

        secondsInput.value =
            settings.seconds ?? "0";


        savedMessage.textContent =
            "Your last run details were restored.";

    } catch (error) {

        console.log(
            "Could not restore saved inputs."
        );

    }

}


function saveTargetInputs() {

    const settings = {

        distance:
            targetDistanceInput.value,

        distanceUnit:
            targetDistanceUnitInput.value,

        hours:
            targetHoursInput.value,

        minutes:
            targetMinutesInput.value,

        seconds:
            targetSecondsInput.value,

        raceKey:
            currentTargetRaceKey,

        strategy:
            currentRaceStrategy

    };


    localStorage.setItem(
        "strideMetricsTargetInputs",
        JSON.stringify(settings)
    );

}


function loadSavedTargetInputs() {

    const savedInputs =
        localStorage.getItem(
            "strideMetricsTargetInputs"
        );


    if (!savedInputs) {
        return false;
    }


    try {

        const settings =
            JSON.parse(savedInputs);


        targetDistanceInput.value =
            settings.distance ??
            "21.0975";

        targetDistanceUnitInput.value =
            settings.distanceUnit ??
            "km";

        targetHoursInput.value =
            settings.hours ??
            "1";

        targetMinutesInput.value =
            settings.minutes ??
            "40";

        targetSecondsInput.value =
            settings.seconds ??
            "0";

        currentTargetRaceKey =
            settings.raceKey ??
            null;

        currentRaceStrategy =
            settings.strategy ??
            "even";


        return true;

    } catch (error) {

        console.log(
            "Could not restore saved race-planning inputs."
        );


        return false;

    }

}


/* THEME */

function saveTheme(theme) {

    localStorage.setItem(
        "strideMetricsTheme",
        theme
    );

}


function updateThemeButton() {

    const darkMode =
        document.body
            .classList
            .contains("dark-mode");


    themeToggle.textContent =
        darkMode
            ? "☀️ Light"
            : "🌙 Dark";


    themeToggle.setAttribute(
        "aria-pressed",
        darkMode
            ? "true"
            : "false"
    );

}


function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "strideMetricsTheme"
        );


    if (savedTheme === "dark") {

        document.body
            .classList
            .add("dark-mode");

    }


    updateThemeButton();

}


function toggleTheme() {

    document.body
        .classList
        .toggle("dark-mode");


    const darkMode =
        document.body
            .classList
            .contains("dark-mode");


    saveTheme(
        darkMode
            ? "dark"
            : "light"
    );


    updateThemeButton();

}


/* RUN CALCULATOR */

function getRunValues() {

    const distance =
        Number(distanceInput.value);

    const unit =
        distanceUnitInput.value;

    const hours =
        Number(hoursInput.value);

    const minutes =
        Number(minutesInput.value);

    const seconds =
        Number(secondsInput.value);


    const validationMessage =
        validateInputs(
            distance,
            hours,
            minutes,
            seconds
        );


    if (validationMessage !== "") {

        return {
            error:
                validationMessage
        };

    }


    const totalSeconds =
        (hours * 3600) +
        (minutes * 60) +
        seconds;


    const distanceKm =
        unit === "miles"

            ? distance *
              KM_PER_MILE

            : distance;


    return {
        distance,
        unit,
        totalSeconds,
        distanceKm
    };

}


function calculatePace() {

    clearError();


    const run =
        getRunValues();


    if (run.error) {

        clearRunResults();
        showError(run.error);

        return false;

    }


    const paceSecondsPerKm =
        run.totalSeconds /
        run.distanceKm;


    const paceSecondsPerMile =
        paceSecondsPerKm *
        KM_PER_MILE;


    const speedKmh =
        run.distanceKm /
        (
            run.totalSeconds /
            3600
        );


    const speedMph =
        speedKmh /
        KM_PER_MILE;


    document
        .getElementById("paceKmResult")
        .textContent =
        formatPace(
            paceSecondsPerKm
        ) +
        " /km";


    document
        .getElementById("paceMileResult")
        .textContent =
        formatPace(
            paceSecondsPerMile
        ) +
        " /mile";


    document
        .getElementById("kmhResult")
        .textContent =
        speedKmh.toFixed(2) +
        " km/h";


    document
        .getElementById("mphResult")
        .textContent =
        speedMph.toFixed(2) +
        " mph";


    displaySamePace(
        paceSecondsPerKm
    );


    const predictions =
        getPredictions(
            run.totalSeconds,
            run.distanceKm
        );


    displayPredictions(
        predictions
    );


    displayTrainingPaces(
        predictions
    );


    updatePresetSelection();
    saveInputs();


    return true;

}


/* TARGET CALCULATOR */

function getTargetValues() {

    const distance =
        Number(
            targetDistanceInput.value
        );

    const unit =
        targetDistanceUnitInput.value;

    const hours =
        Number(
            targetHoursInput.value
        );

    const minutes =
        Number(
            targetMinutesInput.value
        );

    const seconds =
        Number(
            targetSecondsInput.value
        );


    const validationMessage =
        validateInputs(
            distance,
            hours,
            minutes,
            seconds
        );


    if (validationMessage !== "") {

        return {
            error:
                validationMessage
        };

    }


    const totalSeconds =
        (hours * 3600) +
        (minutes * 60) +
        seconds;


    const distanceKm =
        unit === "miles"

            ? distance *
              KM_PER_MILE

            : distance;


    return {
        distance,
        unit,
        totalSeconds,
        distanceKm
    };

}


function calculateTargetPace() {

    clearTargetError();


    const target =
        getTargetValues();


    if (target.error) {

        clearTargetResults();
        showTargetError(target.error);

        return false;

    }


    const paceSecondsPerKm =
        target.totalSeconds /
        target.distanceKm;


    const paceSecondsPerMile =
        paceSecondsPerKm *
        KM_PER_MILE;


    const speedKmh =
        target.distanceKm /
        (
            target.totalSeconds /
            3600
        );


    const speedMph =
        speedKmh /
        KM_PER_MILE;


    document
        .getElementById("targetPaceKm")
        .textContent =
        formatPace(
            paceSecondsPerKm
        ) +
        " /km";


    document
        .getElementById("targetPaceMile")
        .textContent =
        formatPace(
            paceSecondsPerMile
        ) +
        " /mile";


    document
        .getElementById("targetKmh")
        .textContent =
        speedKmh.toFixed(2) +
        " km/h";


    document
        .getElementById("targetMph")
        .textContent =
        speedMph.toFixed(2) +
        " mph";


    updateTargetPresetSelection();
    updateStrategyDisplay(target);
    renderSplits(target);
    saveTargetInputs();


    return true;

}


/* RACE STRATEGY */

function updateStrategyButtonState() {

    strategyButtons.forEach(
        function (button) {

            setButtonActive(
                button,
                button.dataset.strategy ===
                    currentRaceStrategy
            );

        }
    );

}


function getStrategyPaces(target) {

    const averagePacePerUnit =
        target.totalSeconds /
        target.distance;


    if (
        currentRaceStrategy ===
        "negative"
    ) {

        return {
            opening:
                averagePacePerUnit *
                NEGATIVE_SPLIT_OPENING_FACTOR,

            middle:
                averagePacePerUnit *
                NEGATIVE_SPLIT_MIDDLE_FACTOR,

            finish:
                averagePacePerUnit *
                NEGATIVE_SPLIT_FINISH_FACTOR
        };

    }


    return {
        opening:
            averagePacePerUnit,

        middle:
            averagePacePerUnit,

        finish:
            averagePacePerUnit
    };

}


function formatStrategyPace(
    pacePerInputUnit,
    unit
) {

    if (unit === "miles") {

        const paceKm =
            pacePerInputUnit /
            KM_PER_MILE;


        return (
            formatPace(paceKm) +
            " /km"
        );

    }


    return (
        formatPace(
            pacePerInputUnit
        ) +
        " /km"
    );

}


function updateStrategyDisplay(target) {

    updateStrategyButtonState();


    const paces =
        getStrategyPaces(target);


    if (
        currentRaceStrategy ===
        "negative"
    ) {

        strategyExplanation.textContent =
            "Start the first 20% around 3% slower than your average target pace, settle into target pace for the middle 60%, then run the final 20% around 3% faster. The phases balance to preserve your exact target finish time.";


        strategyPhaseOneLabel.textContent =
            "Opening 20%";

        strategyPhaseTwoLabel.textContent =
            "Middle 60%";

        strategyPhaseThreeLabel.textContent =
            "Final 20%";

    } else {

        strategyExplanation.textContent =
            "Maintain the same average pace from the start line to the finish. This is the simplest pacing plan and produces evenly spaced cumulative splits.";


        strategyPhaseOneLabel.textContent =
            "Opening";

        strategyPhaseTwoLabel.textContent =
            "Middle";

        strategyPhaseThreeLabel.textContent =
            "Finish";

    }


    strategyPhaseOnePace.textContent =
        formatStrategyPace(
            paces.opening,
            target.unit
        );


    strategyPhaseTwoPace.textContent =
        formatStrategyPace(
            paces.middle,
            target.unit
        );


    strategyPhaseThreePace.textContent =
        formatStrategyPace(
            paces.finish,
            target.unit
        );


    if (
        currentRaceStrategy ===
        "negative"
    ) {

        strategyPhaseOneDistance.textContent =
            "First " +
            formatSplitDistance(
                target.distance *
                NEGATIVE_SPLIT_OPENING_FRACTION,
                target.unit
            );


        strategyPhaseTwoDistance.textContent =
            "Next " +
            formatSplitDistance(
                target.distance *
                NEGATIVE_SPLIT_MIDDLE_FRACTION,
                target.unit
            );


        strategyPhaseThreeDistance.textContent =
            "Final " +
            formatSplitDistance(
                target.distance *
                NEGATIVE_SPLIT_FINISH_FRACTION,
                target.unit
            );

    } else {

        const thirds =
            target.distance / 3;


        strategyPhaseOneDistance.textContent =
            "Approx. first " +
            formatSplitDistance(
                thirds,
                target.unit
            );


        strategyPhaseTwoDistance.textContent =
            "Approx. middle " +
            formatSplitDistance(
                thirds,
                target.unit
            );


        strategyPhaseThreeDistance.textContent =
            "Approx. final " +
            formatSplitDistance(
                thirds,
                target.unit
            );

    }

}


function getStrategyCumulativeTime(
    checkpoint,
    target
) {

    if (
        currentRaceStrategy ===
        "even"
    ) {

        return (
            target.totalSeconds *
            (
                checkpoint /
                target.distance
            )
        );

    }


    const averagePacePerUnit =
        target.totalSeconds /
        target.distance;


    const openingPace =
        averagePacePerUnit *
        NEGATIVE_SPLIT_OPENING_FACTOR;


    const middlePace =
        averagePacePerUnit *
        NEGATIVE_SPLIT_MIDDLE_FACTOR;


    const finishPace =
        averagePacePerUnit *
        NEGATIVE_SPLIT_FINISH_FACTOR;


    const openingEnd =
        target.distance *
        NEGATIVE_SPLIT_OPENING_FRACTION;


    const middleEnd =
        target.distance *
        (
            NEGATIVE_SPLIT_OPENING_FRACTION +
            NEGATIVE_SPLIT_MIDDLE_FRACTION
        );


    if (
        checkpoint <=
        openingEnd
    ) {

        return (
            checkpoint *
            openingPace
        );

    }


    const openingTime =
        openingEnd *
        openingPace;


    if (
        checkpoint <=
        middleEnd
    ) {

        return (
            openingTime +
            (
                checkpoint -
                openingEnd
            ) *
            middlePace
        );

    }


    const middleDistance =
        middleEnd -
        openingEnd;


    const middleTime =
        middleDistance *
        middlePace;


    return (
        openingTime +
        middleTime +
        (
            checkpoint -
            middleEnd
        ) *
        finishPace
    );

}


function selectRaceStrategy(strategy) {

    currentRaceStrategy =
        strategy;


    updateStrategyButtonState();


    const target =
        getTargetValues();


    if (!target.error) {

        updateStrategyDisplay(target);
        renderSplits(target);
        saveTargetInputs();

    }

}


/* SPLITS */

function getKeySplitDistances(
    distance,
    unit
) {

    let candidates;


    if (unit === "miles") {

        candidates = [
            1,
            3,
            5,
            10,
            15,
            20,
            25
        ];

    } else {

        candidates = [
            1,
            5,
            10,
            15,
            20,
            30,
            40
        ];

    }


    return candidates.filter(
        function (checkpoint) {

            return (
                checkpoint <
                distance
            );

        }
    );

}


function getEverySplitDistances(
    distance
) {

    const splits = [];

    const fullUnits =
        Math.floor(distance);


    for (
        let i = 1;
        i <= fullUnits;
        i++
    ) {

        if (i < distance) {

            splits.push(i);

        }

    }


    return splits;

}


function createSplitRow(
    checkpoint,
    time,
    unit,
    isFinish
) {

    const row =
        document.createElement("div");


    row.className =
        isFinish
            ? "split-row finish"
            : "split-row";


    const distanceCell =
        document.createElement("span");


    distanceCell.className =
        "split-distance";


    distanceCell.textContent =
        isFinish

            ? "FINISH · " +
              formatSplitDistance(
                  checkpoint,
                  unit
              )

            : formatSplitDistance(
                  checkpoint,
                  unit
              );


    const timeCell =
        document.createElement("span");


    timeCell.className =
        "split-time";


    timeCell.textContent =
        formatTime(time);


    row.appendChild(distanceCell);
    row.appendChild(timeCell);


    return row;

}


function renderSplits(target) {

    splitRows.innerHTML = "";


    const splitDistances =
        showEverySplit

            ? getEverySplitDistances(
                target.distance
            )

            : getKeySplitDistances(
                target.distance,
                target.unit
            );


    splitDistances.forEach(
        function (checkpoint) {

            const checkpointTime =
                getStrategyCumulativeTime(
                    checkpoint,
                    target
                );


            const row =
                createSplitRow(
                    checkpoint,
                    checkpointTime,
                    target.unit,
                    false
                );


            splitRows.appendChild(row);

        }
    );


    const finishRow =
        createSplitRow(
            target.distance,
            target.totalSeconds,
            target.unit,
            true
        );


    splitRows.appendChild(
        finishRow
    );


    const unitWord =
        target.unit === "miles"
            ? "mile"
            : "kilometre";


    const strategyName =
        currentRaceStrategy === "negative"
            ? "slight negative split"
            : "even pace";


    if (showEverySplit) {

        splitSummary.textContent =
            "Showing every " +
            unitWord +
            " split using a " +
            strategyName +
            " strategy.";

    } else {

        splitSummary.textContent =
            "Showing key race checkpoints using a " +
            strategyName +
            " strategy.";

    }

}


/* PRESET SELECTION */

function selectPreset(button) {

    if (
        button.dataset.custom ===
        "true"
    ) {

        removeActive(presetButtons);

        setButtonActive(
            button,
            true
        );


        distanceInput.focus();
        distanceInput.select();

        return;

    }


    distanceInput.value =
        button.dataset.distance;


    distanceUnitInput.value =
        "km";


    calculatePace();

}


function selectTargetPreset(button) {

    if (
        button.dataset.targetCustom ===
        "true"
    ) {

        removeActive(
            targetPresetButtons
        );


        setButtonActive(
            button,
            true
        );


        currentTargetRaceKey = null;


        renderGoalShortcuts(null);


        targetDistanceInput.focus();
        targetDistanceInput.select();

        return;

    }


    targetDistanceInput.value =
        button.dataset.targetDistance;


    targetDistanceUnitInput.value =
        "km";


    currentTargetRaceKey =
        button.dataset.raceKey;


    renderGoalShortcuts(
        currentTargetRaceKey
    );


    calculateTargetPace();

}


/* RESET */

function resetStrideMetrics() {

    distanceInput.value = "10";
    distanceUnitInput.value = "km";

    hoursInput.value = "0";
    minutesInput.value = "45";
    secondsInput.value = "0";


    localStorage.removeItem(
        "strideMetricsInputs"
    );


    clearError();
    calculatePace();


    savedMessage.textContent =
        "Reset to default 10K in 45:00.";

}


function resetTargetCalculator() {

    targetDistanceInput.value =
        "21.0975";

    targetDistanceUnitInput.value =
        "km";

    targetHoursInput.value =
        "1";

    targetMinutesInput.value =
        "40";

    targetSecondsInput.value =
        "0";


    currentTargetRaceKey =
        "half";


    currentRaceStrategy =
        "even";


    renderGoalShortcuts(
        currentTargetRaceKey
    );


    clearGoalShortcutSelection();


    showEverySplit = false;


    splitToggle.textContent =
        "Show every split";


    splitToggle.setAttribute(
        "aria-pressed",
        "false"
    );


    updateStrategyButtonState();


    localStorage.removeItem(
        "strideMetricsTargetInputs"
    );


    clearTargetError();
    calculateTargetPace();

}


/* SPLIT TOGGLE */

function toggleSplits() {

    showEverySplit =
        !showEverySplit;


    splitToggle.textContent =
        showEverySplit
            ? "Show key splits"
            : "Show every split";


    splitToggle.setAttribute(
        "aria-pressed",
        showEverySplit
            ? "true"
            : "false"
    );


    const target =
        getTargetValues();


    if (target.error) {

        clearTargetResults();
        showTargetError(target.error);

        return;

    }


    clearTargetError();
    renderSplits(target);

}


/* COPY / SHARE */

function getRunSummary() {

    const valid =
        calculatePace();


    if (!valid) {
        return "";
    }


    const run =
        getRunValues();


    if (run.error) {
        return "";
    }


    const unitLabel =
        run.unit === "miles"
            ? "miles"
            : "km";


    const lines = [

        "GetYourStrideMetrics – Run Analysis",

        "",

        run.distance +
        " " +
        unitLabel +
        " in " +
        formatTime(
            run.totalSeconds
        ),

        "",

        "Pace: " +
        document
            .getElementById(
                "paceKmResult"
            )
            .textContent +
        " · " +
        document
            .getElementById(
                "paceMileResult"
            )
            .textContent,

        "Speed: " +
        document
            .getElementById(
                "kmhResult"
            )
            .textContent +
        " · " +
        document
            .getElementById(
                "mphResult"
            )
            .textContent,

        "",

        "Predicted race times:",

        "5K – " +
        document
            .getElementById(
                "predicted5k"
            )
            .textContent,

        "10K – " +
        document
            .getElementById(
                "predicted10k"
            )
            .textContent,

        "Half marathon – " +
        document
            .getElementById(
                "predictedHalf"
            )
            .textContent,

        "Marathon – " +
        document
            .getElementById(
                "predictedMarathon"
            )
            .textContent,

        "",

        "getyourstridemetrics.com"

    ];


    return lines.join("\n");

}


function getRacePlanSummary() {

    const valid =
        calculateTargetPace();


    if (!valid) {
        return "";
    }


    const target =
        getTargetValues();


    if (target.error) {
        return "";
    }


    const unitLabel =
        target.unit === "miles"
            ? "miles"
            : "km";


    const strategyName =
        currentRaceStrategy ===
        "negative"

            ? "Slight negative split"

            : "Even pace";


    const lines = [

        "GetYourStrideMetrics – Race Plan",

        "",

        "Target: " +
        target.distance +
        " " +
        unitLabel +
        " in " +
        formatTime(
            target.totalSeconds
        ),

        "",

        "Required average pace: " +
        document
            .getElementById(
                "targetPaceKm"
            )
            .textContent +
        " · " +
        document
            .getElementById(
                "targetPaceMile"
            )
            .textContent,

        "Average speed: " +
        document
            .getElementById(
                "targetKmh"
            )
            .textContent +
        " · " +
        document
            .getElementById(
                "targetMph"
            )
            .textContent,

        "",

        "Race strategy: " +
        strategyName,

        "Opening: " +
        strategyPhaseOnePace.textContent,

        "Middle: " +
        strategyPhaseTwoPace.textContent,

        "Finish: " +
        strategyPhaseThreePace.textContent,

        "",

        showEverySplit
            ? "Every split:"
            : "Key race splits:"

    ];


    const rows =
        splitRows.querySelectorAll(
            ".split-row"
        );


    rows.forEach(
        function (row) {

            const distanceCell =
                row.querySelector(
                    ".split-distance"
                );


            const timeCell =
                row.querySelector(
                    ".split-time"
                );


            if (
                distanceCell &&
                timeCell
            ) {

                lines.push(
                    distanceCell.textContent +
                    " – " +
                    timeCell.textContent
                );

            }

        }
    );


    lines.push(
        "",
        "getyourstridemetrics.com"
    );


    return lines.join("\n");

}


async function copyText(text) {

    if (!text) {

        throw new Error(
            "No valid summary available."
        );

    }


    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        await navigator.clipboard
            .writeText(text);

        return;

    }


    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value = text;

    textarea.style.position =
        "fixed";

    textarea.style.opacity =
        "0";


    document.body.appendChild(
        textarea
    );


    textarea.focus();
    textarea.select();


    document.execCommand(
        "copy"
    );


    textarea.remove();

}


async function shareText(
    title,
    text,
    messageElement
) {

    if (!text) {

        showActionMessage(
            messageElement,
            "Please correct the highlighted inputs before sharing."
        );

        return;

    }


    if (navigator.share) {

        try {

            await navigator.share({
                title,
                text
            });


            showActionMessage(
                messageElement,
                "Share completed."
            );


            return;

        } catch (error) {

            if (
                error.name ===
                "AbortError"
            ) {

                return;

            }

        }

    }


    try {

        await copyText(text);


        showActionMessage(
            messageElement,
            "Sharing isn't available here, so the summary was copied instead."
        );

    } catch (error) {

        showActionMessage(
            messageElement,
            "Unable to share or copy the summary."
        );

    }

}


/* EVENTS */

calculateButton.addEventListener(
    "click",
    calculatePace
);


resetButton.addEventListener(
    "click",
    resetStrideMetrics
);


themeToggle.addEventListener(
    "click",
    toggleTheme
);


calculateTargetButton.addEventListener(
    "click",
    calculateTargetPace
);


resetTargetButton.addEventListener(
    "click",
    resetTargetCalculator
);


splitToggle.addEventListener(
    "click",
    toggleSplits
);


strategyButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                selectRaceStrategy(
                    button.dataset.strategy
                );

            }
        );

    }
);


copyRunButton.addEventListener(
    "click",
    async function () {

        const summary =
            getRunSummary();


        if (!summary) {

            showActionMessage(
                runActionMessage,
                "Please correct the run details before copying."
            );

            return;

        }


        try {

            await copyText(summary);


            showActionMessage(
                runActionMessage,
                "Run summary copied."
            );

        } catch (error) {

            showActionMessage(
                runActionMessage,
                "Unable to copy the run summary."
            );

        }

    }
);


shareRunButton.addEventListener(
    "click",
    function () {

        const summary =
            getRunSummary();


        shareText(
            "GetYourStrideMetrics – Run Analysis",
            summary,
            runActionMessage
        );

    }
);


copyRacePlanButton.addEventListener(
    "click",
    async function () {

        const summary =
            getRacePlanSummary();


        if (!summary) {

            showActionMessage(
                raceActionMessage,
                "Please correct the race-plan details before copying."
            );

            return;

        }


        try {

            await copyText(summary);


            showActionMessage(
                raceActionMessage,
                "Race plan copied."
            );

        } catch (error) {

            showActionMessage(
                raceActionMessage,
                "Unable to copy the race plan."
            );

        }

    }
);


shareRacePlanButton.addEventListener(
    "click",
    function () {

        const summary =
            getRacePlanSummary();


        shareText(
            "GetYourStrideMetrics – Race Plan",
            summary,
            raceActionMessage
        );

    }
);


presetButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                selectPreset(button);

            }
        );

    }
);


targetPresetButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                selectTargetPreset(
                    button
                );

            }
        );

    }
);


distanceInput.addEventListener(
    "input",
    updatePresetSelection
);


targetDistanceInput.addEventListener(
    "input",
    function () {

        clearGoalShortcutSelection();
        updateTargetPresetSelection();

    }
);


distanceUnitInput.addEventListener(
    "change",
    function () {

        updatePresetSelection();
        calculatePace();

    }
);


targetDistanceUnitInput.addEventListener(
    "change",
    function () {

        clearGoalShortcutSelection();
        updateTargetPresetSelection();
        calculateTargetPace();

    }
);


const enterInputs = [
    distanceInput,
    hoursInput,
    minutesInput,
    secondsInput
];


enterInputs.forEach(
    function (input) {

        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Enter"
                ) {

                    calculatePace();

                }

            }
        );

    }
);


const targetEnterInputs = [
    targetDistanceInput,
    targetHoursInput,
    targetMinutesInput,
    targetSecondsInput
];


targetEnterInputs.forEach(
    function (input) {

        input.addEventListener(
            "input",
            function () {

                clearGoalShortcutSelection();

            }
        );


        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Enter"
                ) {

                    calculateTargetPace();

                }

            }
        );

    }
);


/* INITIALISE */

loadTheme();

loadSavedInputs();

calculatePace();


const restoredTargetInputs =
    loadSavedTargetInputs();


if (restoredTargetInputs) {

    updateTargetPresetSelection();

} else {

    currentTargetRaceKey =
        "half";

    currentRaceStrategy =
        "even";


    renderGoalShortcuts(
        currentTargetRaceKey
    );

}


updateStrategyButtonState();

calculateTargetPace();