# Technical Case Studies

## 01. PAM Four-Day Routine Experiment

We tested PAM on four days of real routine videos: two days of a study routine and two days of an evening routine. Every second, a VLM (Qwen3.5-27B) looks at the PAM memory and recent photos and picks one kind of help. At the end of each day, it updates the memory from that day's photos. We ran the same videos with and without memory.

| Day | With memory (FSM) | Without memory |
| --- | --- | --- |
| Study, day 2 | 0.41 | 0.04 |
| Evening, day 1 (routine changed) | 0.27 | 0.00 |
| Evening, day 2 | 0.25 | 0.08 |

The numbers are F1 scores for picking the right action, where 1 is perfect.

- **Memory helped every day, but accuracy stayed low.** F1 ranged from 0.25 to 0.41, and of the 7 times something had to be brought to the resident, it was on time only twice.
- **After the routine changed, the end-of-day update erased every rule from the earlier routine.** Going back to the study routine means learning it again from scratch.
- **It often misread the photos.** It took the vitamin bottle on the desk for a can and kept choosing to put away a can that wasn't there that day.

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
