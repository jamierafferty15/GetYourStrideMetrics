const APP_VERSION = "v1.0.0-rc2";

const KM_PER_MILE = 1.609344;
const RIEGEL_EXPONENT = 1.06;


/* NEGATIVE SPLIT MODEL */

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


/* STORAGE */

const STORAGE_KEYS = {
    run: "strideMetricsInputs",
    target: "strideMetricsTargetInputs",
    theme: "strideMetricsTheme"
};


/* RACE DISTANCES */

const raceDistances = {
    fiveK: 5,
    tenK: 10,
    halfMarathon: 21.0975,
    marathon: 42.195
};


const raceLabels = {
    "5k": "5K",
    "10k": "10K",
    "half": "Half marathon",
    "marathon": "Marathon"
};


/* POPULAR GOALS */

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


/* APP STATE */

let showEverySplit = false;
let currentTargetRaceKey = "half";
let currentRaceStrategy = "even";


/* DOM */

const calculateButton =
    document.getElementById("calculate");

const resetButton =
    document.getElementById("reset");

const themeToggle =
    document.getElementById("themeToggle");

const presetButtons =
    document.querySelectorAll(".preset-button");

const customPreset =
    document.getElementById("customPreset");

const distanceInput =
    document.getElementById("distance");

const distanceUnitInput =
    document.getElementById("distanceUnit");

const hoursInput =
    document.getElementById("hours");

const minutesInput =
    document.getElementById("minutes");

const secondsInput =
    document.getElementById("seconds");

const errorMessage =
    document.getElementById("errorMessage");

const savedMessage =
    document.getElementById("savedMessage");


const targetPresetButtons =
    document.querySelectorAll(
        ".target-preset-button"
    );

const targetCustomPreset =
    document.getElementById(
        "targetCustomPreset"
    );

const targetDistanceInput =
    document.getElementById(
        "targetDistance"
    );

const targetDistanceUnitInput =
    document.getElementById(
        "targetDistanceUnit"
    );

const targetHoursInput =
    document.getElementById(
        "targetHours"
    );

const targetMinutesInput =
    document.getElementById(
        "targetMinutes"
    );

const targetSecondsInput =
    document.getElementById(
        "targetSeconds"
    );

const calculateTargetButton =
    document.getElementById(
        "calculateTarget"
    );

const resetTargetButton =
    document.getElementById(
        "resetTarget"
    );

const targetErrorMessage =
    document.getElementById(
        "targetErrorMessage"
    );

const goalShortcutsContainer =
    document.getElementById(
        "goalShortcuts"
    );

const goalShortcutButtons =
    document.getElementById(
        "goalShortcutButtons"
    );

const strategyButtons =
    document.querySelectorAll(
        ".strategy-button"
    );

const strategyExplanation =
    document.getElementById(
        "strategyExplanation"
    );

const strategyPhaseOneLabel =
    document.getElementById(
        "strategyPhaseOneLabel"
    );

const strategyPhaseTwoLabel =
    document.getElementById(
        "strategyPhaseTwoLabel"
    );

const strategyPhaseThreeLabel =
    document.getElementById(
        "strategyPhaseThreeLabel"
    );

const strategyPhaseOnePace =
    document.getElementById(
        "strategyPhaseOnePace"
    );

const strategyPhaseTwoPace =
    document.getElementById(
        "strategyPhaseTwoPace"
    );

const strategyPhaseThreePace =
    document.getElementById(
        "strategyPhaseThreePace"
    );

const strategyPhaseOneDistance =
    document.getElementById(
        "strategyPhaseOneDistance"
    );

const strategyPhaseTwoDistance =
    document.getElementById(
        "strategyPhaseTwoDistance"
    );

const strategyPhaseThreeDistance =
    document.getElementById(
        "strategyPhaseThreeDistance"
    );

const splitToggle =
    document.getElementById(
        "splitToggle"
    );

const splitRows =
    document.getElementById(
        "splitRows"
    );

const splitSummary =
    document.getElementById(
        "splitSummary"
    );

const copyRunButton =
    document.getElementById(
        "copyRun"
    );

const shareRunButton =
    document.getElementById(
        "shareRun"
    );

const copyRacePlanButton =
    document.getElementById(
        "copyRacePlan"
    );

const shareRacePlanButton =
    document.getElementById(
        "shareRacePlan"
    );

const runActionMessage =
    document.getElementById(
        "runActionMessage"
    );

const raceActionMessage =
    document.getElementById(
        "raceActionMessage"
    );


/* FIELD GROUPS */

const runFields = {
    distance: distanceInput,
    unit: distanceUnitInput,
    hours: hoursInput,
    minutes: minutesInput,
    seconds: secondsInput
};


const targetFields = {
    distance: targetDistanceInput,
    unit: targetDistanceUnitInput,
    hours: targetHoursInput,
    minutes: targetMinutesInput,
    seconds: targetSecondsInput
};


const runDefaults = {
    distance: "10",
    unit: "km",
    hours: "0",
    minutes: "45",
    seconds: "0"
};


const targetDefaults = {
    distance: "21.0975",
    unit: "km",
    hours: "1",
    minutes: "40",
    seconds: "0"
};


/* GENERIC HELPERS */

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {
        element.textContent = value;
    }

}


function setButtonActive(
    button,
    isActive
) {

    if (!button) {
        return;
    }


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


function setFieldValues(
    fields,
    values
) {

    fields.distance.value =
        values.distance;

    fields.unit.value =
        values.unit;

    fields.hours.value =
        values.hours;

    fields.minutes.value =
        values.minutes;

    fields.seconds.value =
        values.seconds;

}


function readCalculatorValues(fields) {

    const distance =
        Number(
            fields.distance.value
        );

    const unit =
        fields.unit.value;

    const hours =
        Number(
            fields.hours.value
        );

    const minutes =
        Number(
            fields.minutes.value
        );

    const seconds =
        Number(
            fields.seconds.value
        );


    const validationMessage =
        validateInputs(
            distance,
            hours,
            minutes,
            seconds
        );


    if (validationMessage) {

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
        hours,
        minutes,
        seconds,
        totalSeconds,
        distanceKm
    };

}


function getCalculatedMetrics(values) {

    const paceSecondsPerKm =
        values.totalSeconds /
        values.distanceKm;


    const paceSecondsPerMile =
        paceSecondsPerKm *
        KM_PER_MILE;


    const speedKmh =
        values.distanceKm /
        (
            values.totalSeconds /
            3600
        );


    const speedMph =
        speedKmh /
        KM_PER_MILE;


    return {
        paceSecondsPerKm,
        paceSecondsPerMile,
        speedKmh,
        speedMph
    };

}


function getStoredFields(fields) {

    return {

        distance:
            fields.distance.value,

        unit:
            fields.unit.value,

        hours:
            fields.hours.value,

        minutes:
            fields.minutes.value,

        seconds:
            fields.seconds.value

    };

}


function saveJson(
    storageKey,
    value
) {

    localStorage.setItem(
        storageKey,
        JSON.stringify(value)
    );

}


function loadJson(storageKey) {

    const storedValue =
        localStorage.getItem(
            storageKey
        );


    if (!storedValue) {
        return null;
    }


    try {

        return JSON.parse(
            storedValue
        );

    } catch (error) {

        console.log(
            `Could not restore ${storageKey}.`
        );


        return null;

    }

}


function loadFields(
    storageKey,
    fields,
    defaults
) {

    const settings =
        loadJson(
            storageKey
        );


    if (!settings) {
        return false;
    }


    setFieldValues(
        fields,
        {

            distance:
                settings.distance ??
                defaults.distance,

            unit:
                settings.unit ??
                settings.distanceUnit ??
                defaults.unit,

            hours:
                settings.hours ??
                defaults.hours,

            minutes:
                settings.minutes ??
                defaults.minutes,

            seconds:
                settings.seconds ??
                defaults.seconds

        }
    );


    return settings;

}


function clearElements(ids) {

    ids.forEach(
        function (id) {

            setText(
                id,
                "--"
            );

        }
    );

}


/* FORMATTING */

function formatTime(totalSeconds) {

    totalSeconds =
        Math.round(
            totalSeconds
        );


    const hours =
        Math.floor(
            totalSeconds /
            3600
        );


    const minutes =
        Math.floor(
            (
                totalSeconds %
                3600
            ) /
            60
        );


    const seconds =
        totalSeconds %
        60;


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
        Math.floor(
            totalSeconds /
            60
        );


    let seconds =
        Math.round(
            totalSeconds %
            60
        );


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


    if (
        Number.isInteger(distance)
    ) {

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

        return (
            "Please enter a distance greater than 0."
        );

    }


    if (
        !Number.isFinite(hours) ||
        hours < 0
    ) {

        return (
            "Hours cannot be negative."
        );

    }


    if (
        !Number.isFinite(minutes) ||
        minutes < 0 ||
        minutes > 59
    ) {

        return (
            "Minutes must be between 0 and 59."
        );

    }


    if (
        !Number.isFinite(seconds) ||
        seconds < 0 ||
        seconds > 59
    ) {

        return (
            "Seconds must be between 0 and 59."
        );

    }


    const totalSeconds =
        (hours * 3600) +
        (minutes * 60) +
        seconds;


    if (totalSeconds <= 0) {

        return (
            "Please enter a finishing time greater than 0."
        );

    }


    return "";

}


/* MESSAGES */

function showMessage(
    element,
    message
) {

    element.textContent =
        message;

    element.style.display =
        "block";

}


function clearMessage(element) {

    element.textContent =
        "";

    element.style.display =
        "none";

}


function showError(message) {

    showMessage(
        errorMessage,
        message
    );

}


function clearError() {

    clearMessage(
        errorMessage
    );

}


function showTargetError(message) {

    showMessage(
        targetErrorMessage,
        message
    );

}


function clearTargetError() {

    clearMessage(
        targetErrorMessage
    );

}


function showActionMessage(
    element,
    message
) {

    showMessage(
        element,
        message
    );


    window.setTimeout(
        function () {

            clearMessage(
                element
            );

        },
        3000
    );

}


/* CLEAR RESULTS */

function clearRunResults() {

    clearElements(
        [
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
        ]
    );

}


function clearTargetResults() {

    clearElements(
        [
            "targetPaceKm",
            "targetPaceMile",
            "targetKmh",
            "targetMph"
        ]
    );


    strategyPhaseOnePace.textContent =
        "--";

    strategyPhaseTwoPace.textContent =
        "--";

    strategyPhaseThreePace.textContent =
        "--";


    strategyPhaseOneDistance.textContent =
        "--";

    strategyPhaseTwoDistance.textContent =
        "--";

    strategyPhaseThreeDistance.textContent =
        "--";


    splitRows.innerHTML =
        "";

    splitSummary.textContent =
        "";

}


/* PRESET HELPERS */

function findMatchingPreset(
    buttons,
    distance,
    unit,
    distanceAttribute
) {

    if (unit !== "km") {
        return null;
    }


    return (
        Array.from(
            buttons
        ).find(
            function (button) {

                const rawDistance =
                    button.dataset[
                        distanceAttribute
                    ];


                if (!rawDistance) {
                    return false;
                }


                return (
                    Math.abs(
                        distance -
                        Number(rawDistance)
                    ) <
                    0.0001
                );

            }
        ) ??
        null
    );

}


function updatePresetSelection() {

    const distance =
        Number(
            distanceInput.value
        );


    const unit =
        distanceUnitInput.value;


    removeActive(
        presetButtons
    );


    const matchedButton =
        findMatchingPreset(
            presetButtons,
            distance,
            unit,
            "distance"
        );


    setButtonActive(
        matchedButton ??
        customPreset,
        true
    );

}


function updateTargetPresetSelection() {

    const distance =
        Number(
            targetDistanceInput.value
        );


    const unit =
        targetDistanceUnitInput.value;


    removeActive(
        targetPresetButtons
    );


    const matchedButton =
        findMatchingPreset(
            targetPresetButtons,
            distance,
            unit,
            "targetDistance"
        );


    if (!matchedButton) {

        setButtonActive(
            targetCustomPreset,
            true
        );


        currentTargetRaceKey =
            null;


        renderGoalShortcuts(
            null
        );


        return;

    }


    setButtonActive(
        matchedButton,
        true
    );


    const matchedRaceKey =
        matchedButton.dataset.raceKey;


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


    updateGoalShortcutSelection();

}


/* POPULAR GOALS */

function clearGoalShortcutSelection() {

    const buttons =
        goalShortcutButtons
            .querySelectorAll(
                ".goal-shortcut-button"
            );


    removeActive(
        buttons
    );

}


function updateGoalShortcutSelection() {

    const shortcuts =
        goalShortcuts[
            currentTargetRaceKey
        ];


    const buttons =
        goalShortcutButtons
            .querySelectorAll(
                ".goal-shortcut-button"
            );


    if (
        !shortcuts ||
        buttons.length === 0
    ) {

        return;

    }


    const currentHours =
        Number(
            targetHoursInput.value
        );


    const currentMinutes =
        Number(
            targetMinutesInput.value
        );


    const currentSeconds =
        Number(
            targetSecondsInput.value
        );


    buttons.forEach(
        function (
            button,
            index
        ) {

            const shortcut =
                shortcuts[index];


            if (!shortcut) {

                setButtonActive(
                    button,
                    false
                );

                return;

            }


            const matches =
                currentHours ===
                    shortcut.hours &&
                currentMinutes ===
                    shortcut.minutes &&
                currentSeconds ===
                    shortcut.seconds;


            setButtonActive(
                button,
                matches
            );

        }
    );

}


function renderGoalShortcuts(raceKey) {

    goalShortcutButtons.innerHTML =
        "";


    const shortcuts =
        goalShortcuts[
            raceKey
        ];


    if (!shortcuts) {

        goalShortcutsContainer
            .classList
            .add(
                "hidden"
            );

        return;

    }


    goalShortcutsContainer
        .classList
        .remove(
            "hidden"
        );


    const raceLabel =
        raceLabels[raceKey] ??
        "race";


    shortcuts.forEach(
        function (shortcut) {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";

            button.className =
                "goal-shortcut-button";

            button.textContent =
                shortcut.label;

            button.setAttribute(
                "aria-pressed",
                "false"
            );

            button.setAttribute(
                "aria-label",
                shortcut.label +
                " " +
                raceLabel +
                " target"
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
                .appendChild(
                    button
                );

        }
    );


    updateGoalShortcutSelection();

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
            distance:
                raceDistances.fiveK
        },

        {
            timeId: "same10k",
            paceId: "samePace10k",
            distance:
                raceDistances.tenK
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

            setText(
                race.timeId,
                formatTime(
                    paceSecondsPerKm *
                    race.distance
                )
            );


            setText(
                race.paceId,
                formatPace(
                    paceSecondsPerKm
                ) +
                " /km"
            );

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


function displayPredictions(predictions) {

    const races = [

        {
            timeId: "predicted5k",
            paceId: "predictedPace5k",
            time:
                predictions.fiveK,
            distance:
                raceDistances.fiveK
        },

        {
            timeId: "predicted10k",
            paceId: "predictedPace10k",
            time:
                predictions.tenK,
            distance:
                raceDistances.tenK
        },

        {
            timeId: "predictedHalf",
            paceId: "predictedPaceHalf",
            time:
                predictions.half,
            distance:
                raceDistances.halfMarathon
        },

        {
            timeId: "predictedMarathon",
            paceId: "predictedPaceMarathon",
            time:
                predictions.marathon,
            distance:
                raceDistances.marathon
        }

    ];


    races.forEach(
        function (race) {

            setText(
                race.timeId,
                formatTime(
                    race.time
                )
            );


            setText(
                race.paceId,
                formatPace(
                    race.time /
                    race.distance
                ) +
                " /km"
            );

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
                predicted10kPace +
                60,

            slow:
                predicted10kPace +
                90
        },

        steady: {
            fast:
                predicted10kPace +
                30,

            slow:
                predicted10kPace +
                60
        },

        tempo: {
            fast:
                predicted10kPace +
                10,

            slow:
                predicted10kPace +
                25
        },

        interval: {
            fast:
                predicted5kPace -
                5,

            slow:
                predicted5kPace +
                5
        }

    };


    const displayRange =
        function (
            range,
            kmId,
            mileId
        ) {

            setText(
                kmId,
                formatPaceRange(
                    range.fast,
                    range.slow
                )
            );


            setText(
                mileId,
                formatMileRange(
                    range.fast,
                    range.slow
                )
            );

        };


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

    saveJson(
        STORAGE_KEYS.run,
        getStoredFields(
            runFields
        )
    );


    savedMessage.textContent =
        "Run details saved automatically.";

}


function loadSavedInputs() {

    const restored =
        loadFields(
            STORAGE_KEYS.run,
            runFields,
            runDefaults
        );


    if (restored) {

        savedMessage.textContent =
            "Your last run details were restored.";

    }

}


function saveTargetInputs() {

    saveJson(
        STORAGE_KEYS.target,
        {

            ...getStoredFields(
                targetFields
            ),

            raceKey:
                currentTargetRaceKey,

            strategy:
                currentRaceStrategy

        }
    );

}


function loadSavedTargetInputs() {

    const settings =
        loadFields(
            STORAGE_KEYS.target,
            targetFields,
            targetDefaults
        );


    if (!settings) {
        return false;
    }


    currentTargetRaceKey =
        settings.raceKey ??
        null;


    currentRaceStrategy =
        settings.strategy ??
        "even";


    return true;

}


/* THEME */

function saveTheme(theme) {

    localStorage.setItem(
        STORAGE_KEYS.theme,
        theme
    );

}


function updateThemeButton() {

    const darkMode =
        document.body
            .classList
            .contains(
                "dark-mode"
            );


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

    if (
        localStorage.getItem(
            STORAGE_KEYS.theme
        ) ===
        "dark"
    ) {

        document.body
            .classList
            .add(
                "dark-mode"
            );

    }


    updateThemeButton();

}


function toggleTheme() {

    document.body
        .classList
        .toggle(
            "dark-mode"
        );


    const darkMode =
        document.body
            .classList
            .contains(
                "dark-mode"
            );


    saveTheme(
        darkMode
            ? "dark"
            : "light"
    );


    updateThemeButton();

}


/* RUN CALCULATOR */

function getRunValues() {

    return readCalculatorValues(
        runFields
    );

}


function calculatePace() {

    clearError();


    const run =
        getRunValues();


    if (run.error) {

        clearRunResults();


        showError(
            run.error
        );


        return false;

    }


    const metrics =
        getCalculatedMetrics(
            run
        );


    setText(
        "paceKmResult",
        formatPace(
            metrics.paceSecondsPerKm
        ) +
        " /km"
    );


    setText(
        "paceMileResult",
        formatPace(
            metrics.paceSecondsPerMile
        ) +
        " /mile"
    );


    setText(
        "kmhResult",
        metrics.speedKmh.toFixed(2) +
        " km/h"
    );


    setText(
        "mphResult",
        metrics.speedMph.toFixed(2) +
        " mph"
    );


    displaySamePace(
        metrics.paceSecondsPerKm
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

    return readCalculatorValues(
        targetFields
    );

}


function calculateTargetPace() {

    clearTargetError();


    const target =
        getTargetValues();


    if (target.error) {

        clearTargetResults();


        showTargetError(
            target.error
        );


        return false;

    }


    const metrics =
        getCalculatedMetrics(
            target
        );


    setText(
        "targetPaceKm",
        formatPace(
            metrics.paceSecondsPerKm
        ) +
        " /km"
    );


    setText(
        "targetPaceMile",
        formatPace(
            metrics.paceSecondsPerMile
        ) +
        " /mile"
    );


    setText(
        "targetKmh",
        metrics.speedKmh.toFixed(2) +
        " km/h"
    );


    setText(
        "targetMph",
        metrics.speedMph.toFixed(2) +
        " mph"
    );


    updateTargetPresetSelection();


    updateStrategyDisplay(
        target
    );


    renderSplits(
        target
    );


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

    const unitLabel =
        unit === "miles"
            ? "/mile"
            : "/km";


    return (
        formatPace(
            pacePerInputUnit
        ) +
        " " +
        unitLabel
    );

}


function updateStrategyDisplay(target) {

    updateStrategyButtonState();


    const paces =
        getStrategyPaces(
            target
        );


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


        return;

    }


    const thirds =
        target.distance /
        3;


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


    if (target.error) {
        return;
    }


    updateStrategyDisplay(
        target
    );


    renderSplits(
        target
    );


    saveTargetInputs();

}


/* SPLITS */

function getKeySplitDistances(
    distance,
    unit
) {

    const candidates =
        unit === "miles"

            ? [
                1,
                3,
                5,
                10,
                15,
                20,
                25
            ]

            : [
                1,
                5,
                10,
                15,
                20,
                30,
                40
            ];


    return candidates.filter(
        function (checkpoint) {

            return (
                checkpoint <
                distance
            );

        }
    );

}


function getEverySplitDistances(distance) {

    const splits =
        [];


    const fullUnits =
        Math.floor(
            distance
        );


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
        document.createElement(
            "tr"
        );


    row.className =
        isFinish
            ? "split-row finish"
            : "split-row";


    const distanceCell =
        document.createElement(
            "th"
        );


    distanceCell.scope =
        "row";


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
        document.createElement(
            "td"
        );


    timeCell.className =
        "split-time";


    timeCell.textContent =
        formatTime(
            time
        );


    row.appendChild(
        distanceCell
    );


    row.appendChild(
        timeCell
    );


    return row;

}


function renderSplits(target) {

    splitRows.innerHTML =
        "";


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


            splitRows.appendChild(
                createSplitRow(
                    checkpoint,
                    checkpointTime,
                    target.unit,
                    false
                )
            );

        }
    );


    splitRows.appendChild(
        createSplitRow(
            target.distance,
            target.totalSeconds,
            target.unit,
            true
        )
    );


    const unitWord =
        target.unit === "miles"
            ? "mile"
            : "kilometre";


    const strategyName =
        currentRaceStrategy ===
        "negative"

            ? "slight negative split"

            : "even pace";


    splitSummary.textContent =
        showEverySplit

            ? "Showing every " +
              unitWord +
              " split using a " +
              strategyName +
              " strategy."

            : "Showing key race checkpoints using a " +
              strategyName +
              " strategy.";

}


/* PRESET SELECTION */

function selectPreset(button) {

    if (
        button.dataset.custom ===
        "true"
    ) {

        removeActive(
            presetButtons
        );


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


        currentTargetRaceKey =
            null;


        renderGoalShortcuts(
            null
        );


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

    setFieldValues(
        runFields,
        runDefaults
    );


    localStorage.removeItem(
        STORAGE_KEYS.run
    );


    clearError();


    calculatePace();


    savedMessage.textContent =
        "Reset to default 10K in 45:00.";

}


function resetTargetCalculator() {

    setFieldValues(
        targetFields,
        targetDefaults
    );


    currentTargetRaceKey =
        "half";


    currentRaceStrategy =
        "even";


    showEverySplit =
        false;


    renderGoalShortcuts(
        currentTargetRaceKey
    );


    clearGoalShortcutSelection();


    splitToggle.textContent =
        "Show every split";


    splitToggle.setAttribute(
        "aria-pressed",
        "false"
    );


    updateStrategyButtonState();


    localStorage.removeItem(
        STORAGE_KEYS.target
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


        showTargetError(
            target.error
        );


        return;

    }


    clearTargetError();


    renderSplits(
        target
    );

}


/* COPY / SHARE */

function getRunSummary() {

    if (!calculatePace()) {
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


    return [

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

    ].join("\n");

}


function getRacePlanSummary() {

    if (!calculateTargetPace()) {
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
        strategyPhaseOnePace
            .textContent,

        "Middle: " +
        strategyPhaseTwoPace
            .textContent,

        "Finish: " +
        strategyPhaseThreePace
            .textContent,

        "",

        showEverySplit
            ? "Every split:"
            : "Key race splits:"

    ];


    splitRows
        .querySelectorAll(
            ".split-row"
        )
        .forEach(
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


    textarea.value =
        text;

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


/* VERSION */

function updateVersionDisplay() {

    const versionElement =
        document.querySelector(
            ".version"
        );


    if (versionElement) {

        versionElement.textContent =
            APP_VERSION;

    }

}


/* ACCESSIBILITY SETUP */

function initialiseAccessibility() {

    if (goalShortcutButtons) {

        goalShortcutButtons.setAttribute(
            "role",
            "group"
        );

    }


    const strategyContainer =
        document.querySelector(
            ".strategy-buttons"
        );


    if (strategyContainer) {

        strategyContainer.setAttribute(
            "role",
            "group"
        );


        strategyContainer.setAttribute(
            "aria-label",
            "Race pacing strategy"
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

        shareText(
            "GetYourStrideMetrics – Run Analysis",
            getRunSummary(),
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

        shareText(
            "GetYourStrideMetrics – Race Plan",
            getRacePlanSummary(),
            raceActionMessage
        );

    }
);


presetButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                selectPreset(
                    button
                );

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


[
    distanceInput,
    hoursInput,
    minutesInput,
    secondsInput
].forEach(
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


[
    targetDistanceInput,
    targetHoursInput,
    targetMinutesInput,
    targetSecondsInput
].forEach(
    function (input) {

        input.addEventListener(
            "input",
            clearGoalShortcutSelection
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

updateVersionDisplay();

initialiseAccessibility();

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