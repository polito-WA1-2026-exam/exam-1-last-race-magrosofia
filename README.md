# Exam #N: "Exam Title"
## Student: s353776 MAGRO SOFIA 

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server
#### Autenthication
- POST `/api/sessions`: authenticate user and create session.
  - request body:
    ```json
    {
      "email": "user@example.com",
      "password": "password"
    }
    ```
  - response: `200 OK` (Success), `401 Unauthorized` (Wrong credentials), `500 Internal Server Error` (Generic error).
  - response body content:
    ```json
      {
        "id": "1",
        "email": "user@example.com",
      }
      ```

- DELETE `/api/sessions/current`: Logout user and destroy the session.
  - request body: None
  - response: `200 OK` (Success), `500 Internal Server Error` (Generic error).
  - response body content: None
  
- GET `/api/sessions/current`: Get information about the currently logged-in user.
  - request body: None
  - response: `200 OK` (Success), `401 Unauthorized` (Not authenticathed), `500 Internal Server Error` (Generic error).
  - response body content:
    ```json
      {
        "id": "1",
        "email": "user@example.com",
      }
      ```

#### Game
- GET `/api/network`: Returns the full underground network used in the setup phase, including stations, lines and segments.
  -  request body: None
  -  response: `200 OK` (Success), `401 Unauthorized` (Not authenticated), `500 Internal Server Error` (Generic error).
  -  response body:
    ```json
        {
    "stations": [
      {
        "id": 1,
        "name": "Centrale",
        "isInterchange": true
      }
    ],
    "lines": [
      {
        "id": 1,
        "color": "red"
      }
    ],
    "segments": [
      {
        "id": 1,
        "station1": {
          "id": 1,
          "name": "Centrale"
        },
        "station2": {
          "id": 2,
          "name": "Porta Nord"
        },
        "line": {
          "id": 1,
          "name": "Red Line",
          "color": "red"
        }
      }
    ]
  }
  ```

- POST `/api/games`: Start a new game session for authenticated user. The server randomly assigns the starting station and the destination station, ensuring that the destination is reachable from the starting station with a minimum distance of at least 3 segments.
  - request body: None
  - response: `201 Created` (Success), `401 Unauthorized` (Not authenticated), `500 Internal Server Error` (Generic error).
  - response body content:
    ```json
    {
      "gameId": 12,
      "startStation": {
        "id": 1,
        "name": "Centrale"
      },
      "destinationStation": {
        "id": 8,
        "name": "Porto"
      },
      "startedAt": "2026-06-11T10:15:00.000Z",
      "timeLimit": 90,
      "stations": [
        {
          "id": 1,
          "name": "Centrale"
        },
        {
          "id": 2,
          "name": "Porta Nord"
        }
      ],
      "segments": [
        {
          "id": 1,
          "station1": {
            "id": 1,
            "name": "Centrale"
          },
          "station2": {
            "id": 2,
            "name": "Porta Nord"
          }
        }
      ]
    }
      ```

- POST `/api/games/:gameId/route`:Submits the route selected by the player. The server validates the route, applies random events if the route is valid, stores the selected segments and the execution result, and returns the final score.
  - request body:
    ```json
    {
      "route":[1, 4, 8, 10]
    }
    ```
  - response: `200 OK` (Success), `400 Bad Request` (Invalid Route), `401 Unauthorized` (Not authenticated),  `403 Forbidden` (Game does not belong to the authenticated user),  `404 Not Found` (Game not found), `500 Internal Server Error` (Generic error).
  - response body:
     - for a valid route:
        ```json
        {
          "gameId": 12,
          "validRoute": true,
          "finalScore": 23,
          "execution": [
            {
              "stepNumber": 1,
              "segment": {
                "id": 1,
                "station1": "Centrale",
                "station2": "Porta Nord"
              },
              "event": {
                "description": "Wrong platform",
                "cost": -2
              },
              "coinsAfterStep": 18
            }
          ]
        }
        ```
    - for an invalid route:
      ```json
      {
          "gameId": 12,
          "validRoute": false,
          "finalScore": 0,
          "execution": []
        }
      ```

- GET `/api/ranking`:Returns the general ranking of registered users, computed using the best final score obtained by each user among all their completed games.
  - request body: none
  - response:  `200 OK` (Success), `401 Unauthorized` (Not authenticathed), `500 Internal Server Error` (Generic error).
  - response body:
  ```json
      [
    {
      "userId": 1,
      "email": "user1@example.com",
      "bestScore": 25
    },
    {
      "userId": 2,
      "email": "user2@example.com",
      "bestScore": 18
    }
  ]
    ```



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
  - name
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
## AI usage

AI tools were used as support during the development process, mainly to clarify some requirements, review design choices, prepare example SQL seed data for the database, and define API test cases using a `test.http` file.

The database schema, application logic, API structure, and final implementation were reviewed, adapted, and integrated by me. All generated suggestions were manually checked against the project requirements and tested through DB Browser, REST Client, and direct server execution.
