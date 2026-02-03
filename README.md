# WEB X Website (Django Version)

This project has been converted to a **Django** web application, ready for deployment on platforms like **PythonAnywhere**.

## Project Structure
- `webx_project/`: The main Django project configuration.
- `home/`: The app containing your website views, models, and static files.
- `home/templates/home/`: HTML files (`index.html`, `contact.html`).
- `home/static/home/`: CSS and JS files.
- `manage.py`: Django command-line utility.

## Prerequisites
You need **Python** installed on your computer.
If you don't have it, download it from [python.org](https://www.python.org/downloads/).
**Important**: When installing, check the box **"Add Python to PATH"**.

## How to Run Locally

1.  **Open a Terminal** (Command Prompt or PowerShell) in this folder.
2.  **Install Django**:
    ```bash
    pip install -r requirements.txt
    ```
3.  **Initialize the Database**:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```
4.  **Create an Admin User** (to view submitted contacts):
    ```bash
    python manage.py createsuperuser
    ```
    (Follow the prompts to set a username and password).
5.  **Run the Server**:
    ```bash
    python manage.py runserver
    ```
6.  **Open Browser**:
    Go to `http://127.0.0.1:8000/`

## Deployment to PythonAnywhere

1.  Create a ZIP of this folder and upload it to PythonAnywhere.
2.  Open a Bash console on PythonAnywhere.
3.  Unzip the file and `cd` into the folder.
4.  Create a virtual environment and install Django (`pip install django`).
5.  Run migrations (`python manage.py migrate`).
6.  Go to the **Web** tab in PythonAnywhere dashboard.
7.  Add a new web app -> Select **Manual Configuration** -> Select **Python 3.x**.
8.  Set **Source code** path to your project folder.
9.  Edit the **WSGI configuration file** to point to your project's `settings.py`.
10. Reload the web app.

## Features
- **SQLite Database**: Form submissions are saved to the `db.sqlite3` file automatically.
- **Admin Panel**: Go to `/admin` to view all inquiries.
- **Security**: Includes CSRF protection.
