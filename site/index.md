# Project Overview

NOONCHI is a decision prototype for CLOiD, LG's home robot. It notices when a resident could use help, checks what it doesn't know yet, and then decides whether to act or wait. A phone serves as CLOiD's eyes, a laptop as the home hub, and a person stands in for CLOiD's hands.

## What You See in the Demo

One resident cooks, eats, and then rests. NOONCHI takes care of three tasks along the way.

| Task | When NOONCHI steps in | Who carries it out | When it counts as done |
| --- | --- | --- | --- |
| Close the refrigerator door | The door is left open after the resident moves to the counter | A demonstrator following the phone's instruction | ThinQ reads the same door back as closed, or photos taken afterwards show it closed |
| Wash a cup | The resident has left the cup and is no longer using it | The virtual dishwasher in the twin | The wash cycle holding this cup reports it washed |
| Adjust the air conditioner | The resident starts resting in the living room | The real air conditioner, through ThinQ | ThinQ reads the target temperature back from the same unit |

For each task, the screen shows why NOONCHI acted or why it is still waiting.

## Metacognition and Empathy

- **Metacognition:** NOONCHI keeps what it doesn't know as unknown. If it can't see inside a cup, the contents stay unknown, and when that matters it asks for a photo from above. After acting, it checks whether the result matches what it expected.
- **Empathy:** It leaves things alone while the resident is still using them, and it holds non-urgent questions while the resident is drinking.

## Screens

- **Phone view:** the live view from the phone camera
- **3D twin:** the home and appliance states, where CLOiD is, and what the agent is checking right now
- **Decision log:** the steps taken and the result for each request
