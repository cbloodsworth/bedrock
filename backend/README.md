# Backend
DynaCV's backend uses Flask and can be split up into a number of core files:


# How to Get Working
## Database 
**To connect to SQL CLI:** 
`mysql -h <databaseURL> -P <port> -u <username> -p` 
Replace `<databaseURL>` with the hostname of the database you want to connect to.
Replace `<port>` with the port, and `<username>` with the username. It will prompt for a password.
*For more information, check the discord channel. I don't want to have our URL/port/username in version control if possible.*

## Python/flask Requirements
- `pip install -r backend/requirements.txt`
- Make sure you have the most recent .env file and place it in `bedrock/backend/.env`. You can find this by requesting it from someone on the team.
    - **NOTE: This `.env` is sensitive. If you receive it, please do not check it into version control. Only use it for development purposes.**

└── `backend/`\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── `*.py`\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── `requirements.txt`\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── `.env` <--- NOT IN VC, YOU WILL NEED TO PUT THIS IN YOURSELF

- run `npm run all`, this will start up both the frontend and backend (assuming frontend requirements are met)
