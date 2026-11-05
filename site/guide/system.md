# System Architecture

## Observation and Memory

The Android demo phone and the twin-home laptop communicate over a private Tailscale network. Hub access is limited to the registered phone to protect images of the resident and living space.

A separately served vision-language model (VLM) proposes assistance from recent observations, the day’s procedural assistance memory (PAM), and a list of available actions. PAM uses a finite-state machine to store activity phases, appropriate assistance, and cues for moving to the next phase.

## Execution Checks

twin-home synchronizes physical appliance states through ThinQ and tracks CLOiD and its targets in the virtual home. The agent expands a proposal into steps and checks prerequisites, appliance capabilities, locations, and the resident’s authorization.

- If direct manipulation requires movement, the agent adds it as a prerequisite.
- If a step is blocked, the agent records the reason and the condition for resuming.
- If the resident responds or an appliance state changes, the agent revises unstarted steps and their order.

## Outcomes and Memory Updates

twin-home executes each ready step and updates the twin with the verified outcome before evaluating the next step.

The agent uses the same memory version throughout the day. At day’s end, it proposes revisions from observations, execution outcomes, and resident feedback. Revisions take effect the next day after state references and permitted actions pass validation.
