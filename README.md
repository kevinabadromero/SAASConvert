4. START INSTALLATION
Installation

to begin with the installation we need a domain name and two sub domains
example:
api.example.com
be first to run the backend
app.example.com
this second for the frontend of the site
you must redirect those subdomains to the IP of your instance if you don't know how to do it, look at this tutorial HERE

 

LET'S START

1. Update all system packages: 
We copy the following command and paste it in our terminal just clicking with the secondary button or right click, confirm if with the "Y"

sudo apt update && sudo apt upgrade
 

2. Install node and confirm node command is available:
We copy the following command and paste it in our terminal just clicking with the secondary button or right click, we insert each command separately

curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
 

sudo apt-get install -y nodejs
If you have any problems with this step, close the terminal and reopen the terminal, I have tried again.
or wait for the process to finish and try again
You can also restart the instance

node -v
 

npm -v
 

3. Install docker and add you user to docker group: we install the commands separately without changing anything

sudo apt install apt-transport-https ca-certificates curl software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"

sudo apt update

sudo apt install docker-ce

sudo systemctl status docker    
 after this command the terminal will remain at "3
lines 1-19 / 19 (END) "or similar to continue pressing Control + C (Ctrl + C), we install the last two commands to continue

 

If you are using a user other than the main user give access to use docker through the following two commands, if you are using the default user ignore both commands and go to the next step

sudo usermod -aG docker ${USER}
su - ${USER}
 

4. Create Mysql Database using docker: Note: change MYSQL_DATABASE,  MYSQL_PASSWORD,  MYSQL_USER  and  MYSQL_ROOT_PASSWORD.

docker run --name blaster -e MYSQL_ROOT_PASSWORD=blaster -e MYSQL_DATABASE=blaster -e MYSQL_USER=blaster -e MYSQL_PASSWORD=blaster --restart always -p 3306:3306 -d mariadb:latest --character-set-server=utf8mb4 --collation-server=utf8mb4_bin
 

5. we upload files by filezilla
We open filezilla, in the upper menu we look for "edition" and click on options



In options, we look for the SFTP option in the side menu and we select the .pem file as our key, and we accept.



finally we add the ip of our instance on the server, our user is ubuntu, we leave the password blank and our connection port is 22 and we give you connect



already connected we are going to copy the blaster project to the folder "ubuntu" we hope that it is loaded and ready



We check that our project was uploaded for this we go to the terminal and add the command

ls
 

6. we go to the blaster folder with the command:

cd Blaster
 

7. we go to the backend folder with the command:

cd backend
 

8. We will create the .env file that will allow us to connect the backend with the frontend for this we enter the command:

cp .env.example .env
 

9. we will edit the .env file for this we enter the command

nano .env
we add the data without the comments #, we add the data from the database we created in step 4
(control + X AFTER "Y" ENTER) to save

NODE_ENV= PRODUCTION
BACKEND_URL=https://api.mydomain.com      #USE HTTPS HERE, WE WILL ADD SSL LATTER
FRONTEND_URL=https://app.mydomain.com   #USE HTTPS HERE, WE WILL ADD SSL LATTER, CORS RELATED!
PROXY_PORT=443                            #USE NGINX REVERSE PROXY PORT HERE, WE WILL CONFIGURE IT LATTER
PORT=8080

DB_HOST=localhost
DB_DIALECT=mysql
DB_USER=blaster
DB_PASS=blaster
DB_NAME=blaster

JWT_SECRET=3123123213123
JWT_REFRESH_SECRET=75756756756

 

10. Install puppeteer dependencies:

sudo apt-get install -y libxshmfence-dev libgbm-dev wget unzip fontconfig locales gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils
 

11. we will install dependencies in the backend and we will start the same, we must continue in the backend folder

npm install
npm run build
12. Now we will give permission to our created database user and we will give him privileges to migrate the database (we change "blaster" for our database in step 4) It will ask us for the password of our database user created in step 4

docker exec -it blaster mysql -uroot -p
 

13. we will give you privileges 

we change 'blaster'@'3.141.187.127'
we put the ip of our instance and the user created in step 4

CREATE USER 'blaster'@'3.141.187.127' IDENTIFIED BY 'blaster';
GRANT ALL PRIVILEGES ON *.* TO 'blaster'@'3.141.187.127' WITH GRANT OPTION;
FLUSH PRIVILEGES;
 exit
 

14 we migrate the tables to the database

npx sequelize db:migrate
 

15 we send the information to the database

npx sequelize db:seed:all
 

16 We will start the backend application and we will save the application turned on for this first we install pm2 and start the application

sudo npm install -g pm2
pm2 start dist/server.js --name blaster-backend
 

17 Make pm2 auto start afeter reboot:

we change USER_NAME FOR OUR USER normally it is ubuntu @ our_ip "UBUNTU"

pm2 startup ubuntu -u --user `YOUR_USERNAME`
 

18 Copy the last line outputed from previus command and run it, its something like



sudo env PATH=\$PATH:/usr/bin pm2 startup ubuntu -u YOUR_USERNAME --hp /home/YOUR_USERNAM
 

19 we go back to the project folder and then we go to the frontend folder

cd  ..
 

cd frontend
 

20 We install the npm dependency

npm install
 

21 We edit the .env file

nano .env
We add a line of code with the connection to the backend (control + X AFTER "Y" ENTER) to save

REACT_APP_BACKEND_URL = https://api.mydomain.com/
 

22 We build the application

npm run build
 

23 We start the application and save the configuration with mp2

pm2 start server.js --name blaster-frontend
 

24 We save the configuration 

pm2 save
 the result should look like this / we can check in pm2 list

 id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ blaster-backend    │ fork     │ 0    │ online    │ 0%       │ 89.3mb   │
│ 1  │ blaster-frontend   │ fork     │ 0    │ online    │ 0%       │ 20.9mb   
 

25 Now we will install nginx necessary to configure the web view

sudo apt install nginx
 

26 We will remove the default site

sudo rm /etc/nginx/sites-enabled/default
 

27 We will configure our project as the home page

sudo nano /etc/nginx/sites-available/blaster-frontend
We copy and paste with secondary click the following code remember to change the "app.mydomain.com" for your front domain name remember the subdomain api.mydomain.com we use it for the backend (control + X AFTER "Y" ENTER) to save

server {
  server_name app.mydomain.com;

  location / {
    proxy_pass http://127.0.0.1:3333;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_cache_bypass $http_upgrade;
  }
}

 

28 Now we will clone this file to copy it to the backend folder (remember to change the blaster folder if you changed the project name)

sudo cp /etc/nginx/sites-available/blaster-frontend /etc/nginx/sites-available/blaster-backend
 

29 Now we will edit the file in the backend folder

sudo nano /etc/nginx/sites-available/blaster-backend
Here we will change the domain and the port place it in 8080 (control + X AFTER "Y" ENTER) to save

server {
  server_name api.mydomain.com;

  location / {
    proxy_pass http://127.0.0.1:8080;

 

30 Create a symbolic links to enalbe nginx sites:

sudo ln -s /etc/nginx/sites-available/blaster-frontend /etc/nginx/sites-enabled
 

sudo ln -s /etc/nginx/sites-available/blaster-backend /etc/nginx/sites-enabled
 

31 By default, nginx limit body size to 1MB, what isn't enough to some media uploads. Lets change it to 20MB adding a new line to config file:

sudo nano /etc/nginx/nginx.conf
 We add the following line of code as shown in the image (control + X AFTER "Y" ENTER) to save

client_max_body_size 20M; # HANDLE BIGGER UPLOADS


 

32 We checked that everything was ok

sudo nginx -t


 

33 We reboot

sudo service nginx restart
 

34 Install certbot:

sudo add-apt-repository ppa:certbot/certbot
 update

sudo apt update
 

sudo apt install python-certbot-nginx
 

35 Enable SSL on nginx (Fill / Accept all information asked):

sudo certbot --nginx


35 We repeat again to install it in both subdomains

sudo certbot --nginx


 
