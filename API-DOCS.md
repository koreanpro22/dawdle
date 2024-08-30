Api Documentation

* '/users'
    * GET /{email}
        * Purpose: Get current user with logged in email
        * Body: None
        * Response: 
        ```json
            {
                "id": 1,
                "name": "Test User",
                "groups": [ {"name": "Test Group"} ],
                "events": [ 1, 2, 3, 4 ]
            }
        ```

    * POST /
        * Purpose: Create a new user account
        * Body:
        ```json
            {
                "name": "Test User",
                "email": "Test@gmail.com"
            }
        ```
        * Response:
        ```json
            {
                "id": 1,
                "name": "Test User",
                "email": "Test@gmail.com",
                "groups": [],
                "events": []
            }
        ```

    * PUT /{id}
        * Purpose: Edit user personal information or settings
        * Body: 
        ```json
            {
                "name": "Test User Edit",
            }
        ```
        * Response:
        ```json
            {
                "id": 1,
                "name": "Test User Edit",
                "email": "Test@gmail.com",
                "groups": [],
                "events": []
            }
        ```

    * DELETE /{email}
        * Purpose: Delete current user
        * Response: 
        ```json
            {
                "message": "Successfully deleted user"
            }
        ```        


* '/groups'
    * GET /{groupId}
        * Purpose: Get group by group Id
        * Body: None
        * Response: 
        ```json
        {
            "name": "Test Group",
            "author": 1,
            "secretCode": "ABC123!",
            "people": [ 1, 2 ],
            "events": []
        }
        ```

    * POST /
        * Purpose: Create a new Group
        * Body: 
        ```json
        {
            "name": "Test Group"
        }
        ```
        * Response: 
        ```json
        {
            "name": "Test Group",
            "author": "userId",
            "secret_key": "ABC123!",
            "members": [ "userId1" ],
            "events": []
        }
        ```
    * PUT /{groupId}
        * Purpose: Edit an existing group information
        * Body: 
        ```json
        {
            "name": "Edit Group Name"
        }
        ```
        * Response: 
        ```json
        {
            "name": "Edit Group Name",
            "author": "userId",
            "secret_key": "ABC123!",
            "members": [ "userId1" ],
            "events": []
        }
        ```
    * DELETE /{groupId}
        * Purpose: Deletes a group by group Id
        * Body: None
        * Response: 
        ```json
        { 
            "message": "Successfully deleted group"
        }
        ```

* '/events'
    * GET /{eventId}
        * Purpose: Get event by event Id
        * Body: None
        * Response: 
        ```json
        {
            "id": "eventId",
            "title": "Test Event 1",
            "type": "Clubbing",
            "address": "25 smith st",
            "groupId": "group1Id",
            "participants": [ "userId" ]
        }
        ```

    * POST /
        * Purpose: Create a new Event
        * Body: 
        ```json
        {
            "title": "Test Event 1",
            "type": "Clubbing",
            "address": "25 smith st",
            "groupId": "group1Id",
        }
        ```
        * Response:
        ```json
        {
            "id": "eventId",
            "title": "Test Event 1",
            "type": "Clubbing",
            "address": "25 smith st",
            "groupId": "group1Id",
            "participants": [ "userId" ]
        }
        ```

    <!-- PUT /{eventId} EXTRA
        Purpose: Edit an existing event information
        Body: {
            Name: 'Edit Event Name'
        }
        Response: {
            Id: eventId
            title: "Edit Event Name"
            type: "Clubbing"
            address: "25 smith st
            groupId: group1
            participants: [ ]
        } -->

    * DELETE /{eventId}
        * Purpose: Deletes an event by event Id
        * Body: None
        * Response:
        ```json
        { 
            "message": "Successfully deleted event"
        }
        ```

<!-- '/itinerary'
    POST /
        Purpose: Get an events intinerary
         -->


Future Features
-Friends
-Chatting
-Editting AI itinerary
-Auto complete 