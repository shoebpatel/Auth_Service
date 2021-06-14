# Auth_Service
Independent Authentication+Authorization Service with resource service (Micro-Service Architecture)

![alt text](https://github.com/shoebpatel/Auth_Service/blob/main/design_flow.png)


- ✅  SignUp/login
- ✅  email verification (`"Confirm your email"`)
- ✅  password reset (`"Forgot password"`)

* complexity/difficulty faced while developing this app ?
  ∙ While designing the system it was little challenging to chose either stateful or stateless architecture
   1. StateFul Architecture with session storing on centralizes in-memory cache(like redis) where the user info will store in session &
      on every subsequent request client has to share this session in cookie.

   2. Stateless Architecture with JSON Web Token where the user info is saved in jwt payload & shared with the user 
      & on every subsequent request client has to share this JWT for authentication.
   
  ∙ In able to scale the system for 1 million request the architecture needs to be either stateful or stateless &
    I have gone with stateless architecture where every request is independent & can hit any server to get authenticate
    & there will be no single point of failure like redis incase with session

  ∙ At this much load we need to shard our database means we need to use distributed system & according to the CAP Theorem. It is impossible for a distributed database system to simultaneously provide more that two of it's properties(ie: Consistency, Availability, Partition Tolerance).

  ∙ distributed database system has to make a tradeoff between Consistency and Availability when a Partition occurs.
   1. Consistency + Partition Tolerance = Latency
   2. Availability + Partition Tolerance = Eventual consistency(Not true consistency)

* Did you get to learn anything new / key concepts ?
  ∙ actually learn alot:
   1. Before writing a single peace of code, it's very important to design the system with scalability in mind
   2. Premature optimization gives pain, "Correctness first, performance(optimization) second"
   3. Implementing forgot password flow with nodemailer module
   4. Designed the microservice architecture from scratch

* Do you think this task is gonna benefit you in the job ?
  ∙ 'Yes'

* System Design - Microservice Architecture
  1. Auth Service
  2. Resource Service

     * Auth Service is an independent microservice used for authentication, authorization & as an "API gateway" to fetch resources from Resource Service. actually resource service is hidden from outside world any route of Resource Service has to go through the Auth service for user authentication.
   
     * Resource Service has all the resources, info of the user & has his own authorization token to access the resource service 
      which is saved in Auth Service & share in headers('Authorization').
   
          1. SignUp
            - User can sign up with '/api/signup' route
         
          2. login
            - When user,admin or owner login, below payload is saved inside the Json Web Token & authorization on routes are based on the userTypeID
              saved in the payload.
            eg:: {
   	      			  userId,
   	      			  userTypeID,
   	      			  email
   	      		  }
          
          3. Auth Service has three private routes:
      
            i. 'api/getUserData'
               - only users can access this route
               - get user data by userId present in JWT provided by the user
         
            ii. 'api/admin'
               - only admin & owner can access this route
               - if userTypeID is owner or admin
         
            iii. 'api/owner'
               - only owner can access this route
               - if userTypeID is owner
         
          4. Forget Password
             1. 'api/requestResetPassword'
               - above api sends a confirmation mail to the client with [URL + token + userId]
               - token is just randomBytes of hex strings which gets store in token table in mysql
           
             2. 'api/passwordReset'
               - above api gets hit when user clicks the URL which has the token & userId
               - cross check the above token with userId in token table
               - if token match reset the password & destroy the token


* Database Model Schema

```js
interface user_type {
 UserTypeID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 Description varchar(100)
}

interface users {
    UserId INT NOT NULL AUTO_INCREMENT,
    Email VARCHAR(100) NOT NULL,
    Password VARCHAR(100) NOT NULL,
    UserTypeID INT,
    CreateDate DATE NOT NULL,
    UpdateDate DATE NOT NULL,
    Active Boolean NOT NULL,
    PRIMARY KEY (userId),
    CONSTRAINT fk_category1 FOREIGN KEY (userTypeID) 
        REFERENCES user_type(userTypeID)
}

interface user_data {
    Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    OrganizationName VARCHAR(100) NOT NULL,
    UserId INT,
    CreateDate DATE NOT NULL, 
    UpdateDate DATE NOT NULL,
    Active Boolean NOT NULL,
    CONSTRAINT fk_category2 FOREIGN KEY (userId) 
        REFERENCES users(userId)
}

interface token {
    Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Token VARCHAR(500),
    UserId INT,
    CreateDate DATE NOT NULL,
    CONSTRAINT fk_category3 FOREIGN KEY (userId) 
        REFERENCES users(userId)
}





