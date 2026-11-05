# System Architecture

## Components

| Component | Tech stack | Role |
| --- | --- | --- |
| CLOiD's Eye (phone) | Android Chrome, WebXR, WebCodecs (H.264), WebSocket | Knows its own position, sends camera frames and state, and shows the demonstrator what to do |
| CLOiD's Brain (hub) | Node.js 22, TypeScript, matter.js, React, three.js, ThinQ API | Holds the twin state, checks and runs steps, controls ThinQ and the virtual devices, and serves the dashboard |
| CLOiD's Memory (PAM model) | Python, Qwen3.5-27B, vLLM | Reads recent photos and the day's memory, and returns one action or "wait" |
| CLOiD's Attention (observation server) | Python 3.11, YOLO26n, SQLite, AES-256-GCM, TLS 1.3 | Collects frames and appliance states, skips idle periods, and keeps the history |

The phone and the laptop connect over a private Tailscale network, and only the registered demo phone can reach the hub.

## One Decision, Step by Step

1. **Observe.** twin-home collects five photos taken two seconds apart, covering the last eight seconds.
2. **Get a proposal.** It sends the photos, the day's PAM memory, and the list of available actions to the model. The model returns an action number, or -1 to wait. A timeout, an answer that doesn't match the request, or a number outside the list is logged as an error, and goals already in progress stay active.
3. **Break it down.** It splits the proposal into steps. For each step it checks the prerequisites, the appliance's state and capabilities, where CLOiD and the target are, and whether the resident wants it and has allowed it. If CLOiD has to move first, that move becomes a step of its own.
4. **Compare.** It applies each option's effects to a copy of the current state and weighs acting against waiting by expected result, disruption, and delay.
5. **Run.** It sends ready steps through whichever route is available: ThinQ, the virtual devices, or the demonstrator through the phone. Each device takes one step at a time, and the target, state, and permission are checked again right before sending. Execution IDs keep the same action from running twice.
6. **Verify.** The twin changes only with a verified result, and then the next step is assessed. A blocked step records why it stopped and what lets it resume. When the resident answers or the state changes, steps that haven't started yet are revised.

## Task Rules

**Refrigerator door.** NOONCHI matches the door state with phone photos by door ID and time. It waits while the resident is taking out ingredients, comes back to the refrigerator, blocks the view of the door, or observations stop, and it cancels any instruction not yet carried out. It steps in when the door stays open, the resident keeps working at the counter, and the area around the door is clear. The phone shows the demonstrator the task ID, the door, the action, and the reason. The task is done when ThinQ reads the same door back as closed or photos taken afterwards show it closed. Without enough evidence, it stays unverified.

**Cup.** NOONCHI leaves alone any cup that is in use, meant to be reused, or not cleared for cleaning. If it can't see inside and that matters, it asks for a photo and says which cup, why, and from what angle. Before washing, it confirms the resident is done and, if a drink is left, that it may pour it out. It loads the cup only when the dishwasher is idle and has room. Each wash cycle gets its own ID, and the task is done only when that cycle reports this cup washed. While the dishwasher is running, the cup keeps its goal, permission, and reason for waiting. Other dishes found in the meantime get their own checks and don't inherit the first cup's permission.

**Air conditioner.** When the resident starts resting in the living room, NOONCHI checks that the preferred temperature is within what the resident has allowed and what the unit supports. It sends a ThinQ command only if the current setpoint is different, and it waits if the resident refuses or the unit's state is unknown. The task is done when ThinQ reads the setpoint back from the same unit. A rejected command is a failure, and an accepted command without confirmation stays unverified.

**Running together.** Each device takes one step at a time. While the dishwasher is running, loading the cup waits, but an allowed air conditioner change can still go ahead.

## Memory

PAM is a finite-state machine (FSM) stored as JSON. It holds activity phases, rules that pair a situation with the help to offer, and the signs of moving to the next phase.

The same version is used all day. At the end of the day, the day's observations, outcomes, and resident reactions produce a revised version. It takes effect the next day only if it passes the format, state reference, and action list checks. Otherwise the last version that passed stays in use. Direct feedback and inferred reactions are recorded separately, and model weights never change.

## Records

Task and target IDs link every observation, question, answer, choice, permission, execution, and completion check. When you ask why something happened, NOONCHI answers from this record. It also records every time an outcome differs from what it expected.
