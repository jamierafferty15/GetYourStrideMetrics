# GetYourStrideMetrics

GetYourStrideMetrics is a lightweight running calculator and race-planning web app.

It helps runners understand a completed run, estimate equivalent race performances, calculate suggested training paces, and plan target race pacing.

Live site:

https://getyourstridemetrics.com

## Features

### Analyse a Run

Enter a completed run using either kilometres or miles to calculate:

- pace per kilometre
- pace per mile
- speed in km/h
- speed in mph
- same-pace race equivalents
- predicted 5K, 10K, half-marathon and marathon performances
- suggested easy, steady, tempo and interval training pace ranges

### Plan a Race Goal

Choose a race distance and target finish time to calculate:

- required average pace per kilometre
- required average pace per mile
- average speed in km/h
- average speed in mph
- cumulative race splits
- every-kilometre or every-mile splits
- even-pacing strategy
- slight negative-split pacing strategy

Popular target-time shortcuts are included for:

- 5K
- 10K
- half marathon
- marathon

### Other features

- kilometres and miles
- automatic distance conversion when switching units
- dark mode
- saved inputs using browser local storage
- copyable run summaries
- shareable race plans
- responsive mobile layout
- keyboard-friendly controls
- accessible button states and semantic data tables
- installable web-app support

## Race predictions

Predicted race times use the Riegel formula:

```text
T₂ = T₁ × (D₂ / D₁)^1.06