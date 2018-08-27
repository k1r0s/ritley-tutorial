### create its own profile

- this should be accomplished through HTTP POST request to `/users`
- if JSON payload isn't well formed we have to file a Bad Request 400 and provide a specific error message
- users have to provide several fields: name, mail, pass . If any field is missing we have to file a Bad Request 400 and provide a specific error message
- if provided email is already taken we have to file a Conflict 409 and provide a specific error message
- if above requirements are meet we should encrypt the password and store all newly provided data on the database
- if all above processes are success we should file a Created 201 response and send newly created user as a JSON content
- any errors not mentioned above need to be handled. A Internal Server Error 500 response should be filed to the user

### create a session

- this should be accomplished through HTTP POST request to `/sessions`
- if JSON payload isn't well formed we have to file a Bad Request 400 and provide a specific  error message
- if provided credentials are wrong we should file a Unauthorized 401 and provide a specific error message
- if above requirements are meet we should create a new session and store it on the database, if session already exists we only increase its expiration
- if all above processes are success we should file a Created 201 response and send newly created user as a JSON content
- any errors not mentioned above need to be handled. A Internal Server Error 500 response should be filed to the user

### list other users

- this should be accomplished through HTTP GET request to /users
- a session is required, sessions are just a header `-H "x-session: <session_id>"` , if no session is provided we should file an Unauthorized 401 and … … provide a specific error message
- session should be validated, this means to check its expiration, if has already expired we should remove that session from the database and file an Unauthorized 401 and provide a specific error message, otherwise if its valid we should update its expiration
- a query filter may be provided and users should be filtered having that query but that's not relevant on this tutorial (yet its included on the repo)
- if all above processes are success we should file a OK 200 response and send result as a JSON content
- of course any exception or rejection should be handled and 500 code should be filed to the user

### edit its own user

- this should be accomplished through HTTP PUT request to /users
- a session is required, sessions are just a header `-H "x-session: <session_uid>"` , if no session is provided we should file an Unauthorized 401 and … … provide a specific error message
- session should be validated, this means to check its expiration, if has already expired we should remove that session from the database and file an Unauthorized 401 and provide a specific error message, otherwise if its valid we should update its expiration
- if JSON payload isn't well formed we have to file a Bad Request 400 and provide a specific error message
- payload contains the actual data to be updated on the user `{ "name": "Jimmy Jazz" }` means that user pretends to change its name (YAY!), however user should specify the subject (who) `/users?uid=<user_uid>` while an user is only allowed to edit its own user (?). This is intended to allow permission roles in the future. For now, request must contain a query parameter uid and if session is linked to an user different from `<user_uid>` we should file a Forbidden 403 and provide a specific error message
- if above requirements are meet we should update the user on the database
 if all above processes are success we should file a OK 200 response and send the whole user data (changes included) as a JSON content
- any errors not mentioned above need to be handled. A Internal Server Error 500 response should be filed to the user

#### lastly..
- PUT, GET or DELETE requests to `/sessions` should be handled as Method Not Allowed 204
- DELETE requests to `/users` too
