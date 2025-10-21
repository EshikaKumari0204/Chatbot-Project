Overview
This project implements a secure AI chatbot system built using Next.JS and backend with JWT authentication,Upstash rate limiting and Gemini AI for generating intelligent responses.
It ensures only authenticated users interact with the chatbot ,prevents abuse using rate limits and provides fast,context-aware ai replies

Core Architecture 
/app
  ├── api
  │   ├── auth/login/route.js           → Handles user login and token generation
  │   ├── auth/signup/route.js          → Handles user registration in astra database 
  │   ├── chat/route.js                 → Chat endpoint (JWT auth, rate limit, AI response)
  ├── chatbox/page.jsx                  → Frontend chat UI page
  ├──loginpage/page.jsx                 →Page for user login and signup

  /components
  ├── withauth.js                       → Higher level component to protect chatbox page
  

/lib
  ├── ratelimit.js                      → Sets up and applies Upstash rate limiting
  ├── apicall.js                        → Handles embedding & response generation via Gemini

  /scripts
  ├── db.js                             →urls scarpping ,chunk generation ,embedding of chunks and storing embeddings in database 

  WORK FLOW 
 1. User first enters the main page and decides to login or signup
 
 2.On signup its credentials are saved to the database for reference for the next time during login.On successful login after checking the correct credentials from database ,user  receive a jwt token containing user info .Client stores the token in localstorage .
 3.This token is verified during access of chatbox ui and if it is invalid or expired , user and unauthorised is redirected to login page
 4.To prevent spam and excessive requests from a single ip, lib/ratelimit.js exports a ratelimiter using Upstash ratelimit with Redis backend
 5.Gemini handles :
 -> creatembedding for user queries and generating context aware responses .User sends a query via api/chat/route.js .The route checks the rate limit and then it forwards the query to gemini  lib/apicall.js for creating embedding for user query ,finding relevant context from the embeddings stored in database and generate the response accordingly
 6.The frontend is made from Nextjs .It fetches the chat API with the stored jwt token .Show user queries and ai responses in scrollable chat area 
 
 FUTURE IMPROVEMENTS
 1.Store conversation history in a database (e.g., MongoDB or DataStax)

2.Add refresh tokens for long sessions

TECH STACK SUMMARY

| Component           | Technology Used                  |
| ------------------- | -------------------------------- |
| Frontend            | Next.js (React)                  |
| Authentication      | JSON Web Token (JWT)             |
| Rate Limiting       | Upstash Ratelimit + Redis        |
| AI Model            | Google Gemini (Generative AI)    |
| Database            |  DataStax                        |
| Deployment          | Vercel                           |