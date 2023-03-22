# Crypto-simulator :money_with_wings:

Web application with which you can simulate the registration of investments and buying/selling of Cryptocurrencies and monitor the status of our investment.


## Operating instructions :gear:
For a correct functioning of the app, follow the next steps:
***
### Prepare the virtual environment
* Clone this repository using git clone.Todas las dependencias necesarias están en el archivo "requirements.txt", así que instalemos todas usando pip:en la 
* Once you have already open the repository in your favorite IDE, create the virtual environment, you can use in Windows: "python -m venv <virtual environment name>". But if you are using Mac use this command: "python3 -m venv <virtual environment name>". 
* Don't forget to activate the virtual environment (for Windows): "<virtual environment name>/Scripts/activate". The command is a little bit different if you are using a Mac: "<virtual environment name>/bin/activate".
***
### Install dependencies
* All the necessary dependencies are in the "requirements.txt" file, so let's install them all using pip: "pip install -r requirements.txt".
***
### Check the environment variables
* Rename the ".env_template" file to ".env".
* Check that the environment variables are correct, you may want to change the debug mode according to your objectives, set it to "True" or "False" accordingly. 
***
### Configure the app
* First of all, you will need and API KEY to run the app, you can obtain it from: https://www.coinapi.io/pricing?apikey
* Rename the "configuration_template.py" file to "configuration.py". 
* Introduce your API Key in "configuration.py" in the corresponding variable.
* Set your "secret key" and check if the other configuration options meet your needs.
***
### Database creation
* First of all, download sqlite DB manager at the following link: https://sqlitebrowser.org/dl/
* You will find the queries needed to create the database in the "create_db.sql" file, just run them making sure that the files created match the database path reported in the "configuration.py" file, if not, you will have to change the path or the files in place. 
***
### Time to RUN
* Type in the terminal "flask run", please make sure you have the environment activate. 
***
## Developer :computer:	
Hi! My name is **Leyre**, as the final project of the Keepcoding Zero Bootcamp, I made a crypto investment simulator to play with the values to see if we can make our investment grow or not. 

To do this, we created an application in **Flask** that will consult the real value of the ten cryptocurrencies with the highest turnover at the moment.

Any doubts? Any problems with the above instructions? Please contact me in: leyrezgz95@gmail.com 

## Thanks for the interest! :grin:
