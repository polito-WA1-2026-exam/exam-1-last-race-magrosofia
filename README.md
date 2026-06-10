# Exam #N: "Exam Title"
## Student: s353776 MAGRO SOFIA 

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

- POST `/api/something`
  - request parameters and request body content
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

## Database Tables

- Table `users` - contains registered users. Fields:
   - id
   - email
   - password_hash
   - salt
- Table `stations` - contains all possible stations. Fields:
   - id
   - name
   - is_interchange: when a station is served by more than one line
- Table `lines` - contains all metro lines of the network. Fields:
  - id
  - color
- Table `events` - contains all possible events that can occur during a segment. Fields:
  - id
  - description
  - cost
- Table `segments` - contains pairs of stations connected. Fields:
    - id
    - station1
    - station2
    - line
- Table `games` - contains all recorded games played by registered users. Fields:
  - id
  - user_id
  - start_station
  - destination_station
  - started_at: game creation timestamp
  - completed_at: game completation timestamp
  - valid_route
  - final_coins
- Table `game_segments` - contains the ordered list of segments selected by the player for each game. Fields:
  - game_id
  - step_number: position of the segment in the submitted route 
  - segment_id
  - event_id
  - actual_coins

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)

## Use of AI Tools
Briefly describe whether you used any AI tools (e.g., ChatGPT, GitHub Copilot, Claude) while working on this project, for which purposes (e.g., clarifying concepts, debugging, generating code), and how you verified or adapted their output.
If you did not use any AI tools, simply state so.
