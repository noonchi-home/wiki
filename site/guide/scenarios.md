# Technical Case Studies

## 01. PAM Four-Day Routine Experiment

PAM (Procedural Assistance Memory) is a memory of a user's activity phases and the help to give in each phase. A VLM reads recent photos together with this memory and either picks one kind of help or waits. At the end of each day, it revises the memory from that day's photos (self-reflection). We used four days of routine videos we filmed ourselves to compare whether the VLM picks the right help at the right time with and without memory.

### Routines and Videos

We filmed two routines. Each day's video joins scenes at the desk, at the room light switch, and in bed, all from one camera. Two days of routine A (A1, A2) are followed by two days of routine B (B1, B2).

| Routine | The day |
| --- | --- |
| A (study) | Looks at the phone, puts it down, and brings a book to read. Brings a cup and drinks while reading, then closes the book and carries the book and cup out. Brings a laptop and a canned drink to work, then closes the laptop and clears both away. Turns off the room light on the way out, and turns off the bedside lamp after using the phone in bed. |
| B (evening) | Looks at the phone, puts it down, pulls the vitamin bottle over, and brings a cup to take the vitamins. Eats from a bowl while drinking from the cup, then clears the bowl and cup. Turns off the room light, and turns off the bedside lamp in bed. |

### Method

| Item | Details |
| --- | --- |
| Choosing actions | Every second, the model sees up to 9 recent photos (1 second apart) and the day's memory, and picks one action or waits. Extra reasoning is off and the temperature is 0.3. |
| Self-reflection | At the end of each day, it builds or revises the memory from 200 photos, with extra reasoning on. The first day (A1) starts with no memory, and reflection builds the first one. |
| Conditions | FSM memory (phases with transitions between them), list memory (condition and action pairs only, no phases), no memory |
| Ten actions | Bring the cup, can, or book next to the person; put the cup or bowl in the dishwasher; put the can or book in its storage spot; turn off the room light; turn off the bedside lamp; put the bedside lamp away (a wrong option with no matching scene) |
| Model and server | Qwen3.5-27B (BF16), vLLM 0.33.0, one 80 GB H100 |

**Answer key.** Every second has a correct answer, used only for scoring and never shown to the model.

- If something the person needs isn't there yet, bring it next to them. This runs from the first sign (putting the phone down, opening a book to read, setting a bowl down to eat) until the person brings it themselves.
- If a used item is still beside the person, clear it away. This runs from when they finish with it until they carry it out.
- After the person clears everything and leaves for the last time, turn off the room light. After they put the phone down in bed, turn off the bedside lamp.
- Otherwise, do nothing.
- Deliveries are counted separately: on time if given before the person gets up to fetch the item, late if given after they get up but before they return, and missed if never given.

### Results

| Day | With memory (FSM) | Without memory |
| --- | --- | --- |
| Study, day 2 | 0.41 | 0.04 |
| Evening, day 1 (routine changed) | 0.27 | 0.00 |
| Evening, day 2 | 0.25 | 0.08 |

The numbers are F1 scores for picking the right action, where 1 is perfect. Each condition ran once.

- **With memory, it did much better.** FSM memory scored higher than no memory every day, and its first correct action came sooner (study day 2: 3.9 s vs 13.0 s; evening day 2: 5.5 s vs 12.5 s).
- **Memory still helped on the day the routine changed.** On evening day 1, FSM memory chose to turn off the room light 2 seconds into that window and the bedside lamp right away. Without memory, it chose neither.
- **FSM memory and list memory were close.** Their F1 scores differed by 0.03–0.07. Running the first day twice on identical input also gave F1 scores of 0.04 and 0.15, 0.11 apart.
- **On time:** On study day 2, FSM memory brought the cup at 32 seconds, inside its 28–70 second window, and chose putting the can away, turning off the light, and turning off the lamp each within 1 second. On evening day 2, it brought the cup during the meal 1 second after the window opened.
- **Missed:** Every condition missed the cup for the vitamins in routine B.
- **Wrong choices:** On evening day 1, FSM memory followed routine A and chose "bring the book" twice. Without memory, it chose "put the can away," which never happens on B days, 8 times on each B day, often taking the black vitamin bottle on the desk for a can.

### How the Memory Changed (FSM)

| Reflection | Phases / rules | What changed |
| --- | --- | --- |
| After A1 (built, 438 s) | 6 / 8 | Book when seated, cup when reading starts, cup to the dishwasher when the book closes, can when typing, can to the trash when the laptop closes, light off when heading to the switch, lamp off when the phone goes down. It also made "bring the laptop," which isn't on the action list. |
| After A2 (revised, 313 s) | 6 / 8 | The rules stayed and only the conditions widened, for example "cup when looking at the book or leaving the desk." |
| After B1 (revised, 200 s) | 5 / 6 | Every routine A rule (book, laptop, can) was deleted. Cup and bowl when seated, and bowl and cup to the dishwasher after eating; turning off the light and the lamp stayed. No vitamin rule appeared. |

List memory kept the routine A rules after B1 and added "bowl to the dishwasher when the person leaves it and gets up," for 9 rules. In the paper, the original routine's phases and rules stayed after the first day of a changed routine, and only the changed rules were revised.

### Run Details

| Item | Value |
| --- | --- |
| Choosing one action | 4.4–5.5 s, about 2,700–3,700 input tokens |
| One reflection | 200–438 s, 45,717–53,096 input tokens, 8,186–15,031 output tokens |
| GPU cost | About $3.5 for FSM and no memory, about $4.3 for list memory (H100 at $4.01 per hour) |

### Differences from the Paper

| Item | Paper | This experiment |
| --- | --- | --- |
| Video | Filmed at a desk | One camera, with desk, switch, and bed scenes joined |
| Photos per choice | 5, 2 seconds apart | 9, 1 second apart |
| Days per routine | 5 | 2 |
| Windows with two correct answers | One correct answer per photo | Either answer counts |
| Repetition | Ranges over several runs | One run per condition |

## 02. Photo Security Structure

Photos of the home reach the decision model only through the observation server (backend) and a gate (receiver). The gate sits in front of the model server, watches for photo leaks while the model is deciding, and stops sending if it finds one.

### Components

| Component | Role |
| --- | --- |
| Observation server (backend) | Builds the information sent for decisions from phone frames and appliance states, and keeps the sent photos encrypted |
| Gate (receiver) | Installed on the model server. Receives photos from the backend, calls the decision model, and watches the model server's network and files in the meantime |

### Leak Monitoring and Stopping

1. Every time it connects, the backend sends the gate a policy: how to call the decision model and which addresses it may reach while deciding.
2. While a decision runs, the gate watches the model server.
   - **Network:** outgoing connections to addresses not on the allow list
   - **Files:** photos appearing in the Desktop, Downloads, Documents, or AI repository folders
3. When it catches a leak, the gate alerts the backend, and the backend stops sending with the stop marked as caused by an alert.
4. Sending resumes only after a person checks the alert and resumes it.

If the gate simply shuts down, that doesn't count as a leak. The backend shows "AI not connected" and resumes on its own when the gate comes back.

### Connection

- The two sides pair once with a six-digit code. After that, they talk only over TLS 1.3 with mutual authentication and certificates pinned on both sides.
- A connection without a certificate is cut off during the TLS handshake.
- A wrong code raises a "pairing failed" alert, and re-pairing with a changed certificate raises a "certificate mismatch" alert.

### Storage and Deletion

- Only photos that were sent are kept. Each is stored encrypted with AES-256-GCM, so opening the file shows ciphertext, not an image.
- The master key that wraps the photo keys lives in the OS keychain.
- During the end-of-day reflection, all sent photos go to the model server and are then deleted on both sides. They are also deleted when the date changes.

### Security Tests

| Test | Method | Expected result |
| --- | --- | --- |
| Encrypted storage | Inspect the start of a stored file | A ciphertext marker and random bytes, not an image |
| Connection without a certificate | Connect to the gate without a certificate | Cut off during the TLS handshake |
| Wrong pairing code | Pair with 000000 | "Pairing failed" alert |
| Network leak | A test runner that opens an outside connection while deciding | Gate alert, sending stopped, resumed after a check |
| File leak | A test runner that briefly writes a photo to Downloads while deciding | Caught the same way |
| Gate shutdown | Stop and restart the gate | "AI not connected," then automatic resume with no alert |
| Reflection | Run reflection | All sent photos sent, then deleted on both sides |
