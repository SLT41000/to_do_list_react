from typing import Union,Annotated,List
import databases
import sqlalchemy
import secrets
#your must enter own mysql db
from database_constring import DATABASE_URL
from fastapi import Depends, FastAPI, HTTPException, status
import asyncio
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic, HTTPBasicCredentials, HTTPAuthorizationCredentials
from pydantic import BaseModel
import hashlib
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

salt = "7"  # replace with random salt value


app = FastAPI()


security = HTTPBasic()
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
    "https://myapp.com",
    HTTPSRedirectMiddleware
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




       
     
    

security = HTTPBasic()


@app.get("/users/me")
def read_current_user(username: Annotated[str, Depends(get_current_username)]):
    return {"username": username}


@app.post("/user/v1/")
async def insert_Userdb(request_body: dict):
    username = request_body["name"]
    psw = request_body["password"]
    salted_password = psw + salt
    hash_obj = hashlib.sha256()
    # update the hash object with the salted password
    hash_obj.update(salted_password.encode())

    # get the hex-encoded hash value
    hashed_password = hash_obj.hexdigest()

    print(hashed_password)
    query = "SELECT * FROM to_do_list.user WHERE user.username = '"+username+"\'"
    data=await database.fetch_all(query)
    if(len(data)>0):
        return "Username already exits"
    query = "INSERT INTO to_do_list.user (username, pwd) VALUES ('"+username+"','"+hashed_password+"');"
    await database.execute(query)
    return "Sign In complete"


@app.post("/to_do_list/v1/")
async def insert_User_todolist(UID : int,description: str,marktime :str):
    query = "INSERT INTO to_do_list.to_do_list (marktime, description,UID) VALUES ('"+marktime+"','"+description+"',"+str(UID)+");"
    await database.execute(query)

@app.post("/to_do_list/v1/")
async def read_user_todolist(request_body: dict):
    UID = request_body["UID"]
    query = "SELECT * FROM to_do_list.to_do_list WHERE to_do_list.UID = "+str(UID)
    return await database.fetch_all(query)

@app.post("/to_do_list/v2/")
async def read_user_todolist_from_mount(request_body: dict):
    uid = request_body["UID"]
    firstdayofmouth=request_body["firstDayOfMonth"]
    lastdayofmouth=request_body["lastDayOfMonth"]
    
    query = "SELECT to_do_list.marktime FROM to_do_list.to_do_list WHERE to_do_list.UID = "+str(uid) +" and (to_do_list.marktime >= '"+firstdayofmouth+"' and to_do_list.marktime <='"+lastdayofmouth+"') "
    
    return await database.fetch_all(query)


@app.post("/to_do_list/v3/")
async def read_user_todolist_from_day(request_body: dict):
    uid = request_body["UID"]
    firstdayofmouth=request_body["firstDayOfMonth"]
    lastdayofmouth=request_body["lastDayOfMonth"]
    
    query = "SELECT to_do_list.log,to_do_list.marktime,to_do_list.description FROM to_do_list.to_do_list WHERE to_do_list.UID = "+str(uid) +" and (to_do_list.marktime >= '"+firstdayofmouth+"' and to_do_list.marktime <='"+lastdayofmouth+"') "
    
    return await database.fetch_all(query)

@app.post("/to_do_list/insert/v1")
async def insert_to_do_list(request_body: dict):
    uid = request_body["UID"]
    day=request_body["day"]
    description=request_body["description"]
    
    query = "INSERT INTO `to_do_list`.`to_do_list` (`marktime`, `description`, `UID`) VALUES ('"+str(day)+"', '"+str(description)+"', '"+str(uid)+"');"
    
    return await database.execute(query)

@app.post("/to_do_list/update/v1")
async def setcom(request_body: dict):
   
    log=request_body["log"]
    description=request_body["description"]
    
    query = "UPDATE `to_do_list`.`to_do_list` SET `description`='"+description+"' WHERE (`log` = '"+str(log)+"');"
    
    return await database.execute(query)

@app.post("/to_do_list/del/v1")
async def setcom(request_body: dict):
   
    log=request_body["log"]
    
    
    query = "DELETE FROM `to_do_list`.`to_do_list`  WHERE (`log` = '"+str(log)+"');"
    
    return await database.execute(query)

@app.get("/check_user/v1/")
async def auth(username : str,psw : str):
    query = "SELECT * FROM to_do_list.user WHERE user.username = '"+username+"' and user.pwd = '"+psw+"'"
    data=await database.fetch_all(query)
    if(len(data)>0):
        return 1
    else:
        return 0

@app.post("/check_user/v2/")
async def check_user(request_body: dict):
    name = request_body["name"]
    password = request_body["password"]
    salted_password = password + salt

    hash_obj = hashlib.sha256()
    # update the hash object with the salted password
    hash_obj.update(salted_password.encode())

    # get the hex-encoded hash value
    hashed_password = hash_obj.hexdigest()
    query = "SELECT user.UID FROM to_do_list.user WHERE user.username = '"+name+"' and user.pwd = '"+hashed_password+"'"
    data=await database.fetch_all(query)
    if(len(data)>0):
        return data
    else:
        return None

database = databases.Database(DATABASE_URL)

metadata = sqlalchemy.MetaData()

notes = sqlalchemy.Table(
    "user",
    metadata,
    sqlalchemy.Column("UID", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("Firstname", sqlalchemy.String),
    sqlalchemy.Column("Lastname", sqlalchemy.String),
    sqlalchemy.Column("password", sqlalchemy.String),
    sqlalchemy.Column("role", sqlalchemy.String),
)


engine = sqlalchemy.create_engine(
    DATABASE_URL
)
metadata.create_all(engine)


class User(BaseModel):
    UID : int
    Firstname : str
    Lastname : str
    password : str
    role : str









@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

