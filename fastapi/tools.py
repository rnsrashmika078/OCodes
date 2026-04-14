from datetime import datetime
import json
from zoneinfo import ZoneInfo
import requests
from langchain_core.tools import tool
import os


@tool
def code_assistant(prompt: str) -> str:
    """casual chat for user prompt"""
    return f"{prompt}"


@tool
def get_current_time(
    zone: str,
) -> str:
    """return the current time. argument zone example : Asia/Colombo. based on location.only call this when user specifically asked about current time."""
    now = datetime.now(ZoneInfo("Asia/Colombo"))
    return f"current time {now}"


@tool
def dummy_data() -> str:
    """return the dummy data by calling api.only call this when user specifically ask"""
    url = "https://dummyjson.com/test"
    # params = {"latitude": 6.9271, "longitude": 79.8612, "current_weather": True}
    res = requests.get(url)
    # res = requests.get(url, params=params)
    print("dummy data", res.json())
    return res.json()


@tool
def create_update_file(directory: str, fileName: str, content: str) -> str:
    """Create or update a file or folder ( directory ) on the computer.

    if fileName not found .. simple reply file name is required

    For example, if the user says 'create a file called india.txt and add Indian cricket team squad',
    the tool will generate the actual Indian cricket team squad and save it in the file.

    USE PROPER STRUCTURE WHEN INSERT CONTENT TO A FILE SUCH AS INTENT, LINE SPACES , NUMBERS

    *** NOTE ***
    ****** FILE NAME MUST BE CHANGE IF USER EXPLICITLY TELL, OTHERWISE USE THE SAME FILENAME AND PATH
    Arguments:
    - directory: {folderName if any}/{fileName}.{extension} ex:test/file.txt -> don't precede it with like C: and dont precede with '/' at the beginning. use same filename if update the file content
    - fileName : name of the file with extension . ex: file.txt
    - content: The text content to add to the file, generated dynamically by LLM as list with proper indentation and spacing.

    """
    home = os.path.expanduser("~")
    desktop = os.path.join(home, "Desktop")
    full_path = os.path.join(desktop, directory)
    folder = os.path.dirname(full_path)
    os.makedirs(folder, exist_ok=True)
    path = full_path

    print("home", home)
    print("Full path", full_path)
    print("directory", directory)
    # print("folder", folder)
    print("content", content)
    try:
        if not fileName:
            return {
                "message": "failed to create a folder. fileName not found!‌",
                "file_path": "error while getting file path",
                "content": "no content",
                "operation": "null",
            }
        if not directory:
            path = os.path.join(full_path, fileName)
        with open(path, "w") as f:
            f.write(content)
            if os.path.isfile(full_path):
                return f"file updated at ${full_path} with the content of ${content}"
            else:
                return f"file created at ${full_path} with the content of ${content}"

    except Exception as e:
        return {
            "message": str(e),
            "file_path": "error while getting file path",
            "content": "no content",
            "operation": "null",
        }


@tool
def read_file(directory: str, fileName: str) -> str:
    """read a file or folder ( directory ) on the Desktop.

    --if fileName not found .. simple reply file name is required

    Arguments:
    - directory: {folderName if any}/{fileName}.{extension} ex:test/file.txt -> don't precede it with like C:
    - fileName : name of the file with extension . ex: file.txt
    """
    home = os.path.expanduser("~")
    desktop = os.path.join(home, "Desktop")
    full_path = os.path.join(desktop, directory)
    path = full_path

    print("home", home)
    print("Full path", full_path)
    print("directory", directory)
    print("desktop", desktop)
    print("fileName", fileName)

    try:
        if not directory:
            path = os.path.join(desktop, fileName)
        with open(path, "r") as f:
            data = f.read()
            print("data", data)

        return f"data read successfully from the file: data:{data}"
    except Exception as e:
        return f"Failed to create file: {e}"


@tool
def loan_approve(directory: str, fileName: str) -> str:
    """read a file or folder ( directory ) on the computer to check the loan approval.
    if the form meet the required criteria loan must approve.. other wise no approval
    --if fileName not found .. simple reply file name is required

    Arguments:
    - directory: {folderName if any}/{fileName}.{extension} ex:test/file.txt -> don't precede it with like C:
    - fileName : name of the file with extension . ex: file.txt
    """
    home = os.path.expanduser("~")
    desktop = os.path.join(home, "Desktop")
    full_path = os.path.join(desktop, directory)
    path = full_path

    criteria = """
    Loan Approval Rules (STRICT):

    1. Age Rule:
    - Applicant age must be strictly greater than 20.
    - (age > 20)

    2. Income Rule:
    - Applicant income must be strictly greater than 15000.
    - (income > 15000)

    3. Vehicle Rule:
    - Applicant must own strictly less than 2 vehicles.
    - (vehicles < 2)

    4. Marital Status Rule:
    - Applicant must be married.
    - (married == "yes")

    ----------------------------------------

    FINAL DECISION LOGIC:

    - ALL above conditions MUST be TRUE.
    - If ANY ONE condition is FALSE → Loan MUST be REJECTED.
    - No partial approval is allowed.
    - No assumptions: if any field is missing → REJECT the loan.

    ----------------------------------------

    OUTPUT FORMAT:

    Return ONLY one of the following:

    - "APPROVED"
    - "REJECTED"

    Optionally include reason:
    Example:
    - "REJECTED: income condition failed"
    - "APPROVED: all conditions satisfied"
    """

    print("home", home)
    print("Full path", full_path)
    print("directory", directory)
    print("desktop", desktop)
    print("fileName", fileName)

    try:
        if not directory:
            path = os.path.join(desktop, fileName)
        with open(path, "r") as f:
            data = f.read()
            result = check_criteria(data)
            print("data", result)

        # return f"data read successfully from the file: data:{data}; make decision based on this criteria: {criteria}.give overall score based on overall criteria out of 100( ex: 90)"
        return {
            "result": result,
            # "criteria": criteria,
            # "result": "<approved or not approved based on criteria>",
            # "score": "score based on success rate",
        }
    except Exception as e:
        return f"Failed to create file: {e}"


@tool
def read_directory_tree(directory: str, fileName: str) -> str:
    """read read directory tree( directory ) as list on the computer.
    Arguments:
    - directory: {folderName if any}/{fileName}.{extension} ex:test/file.txt -> don't precede it with like C:
    """
    home = os.path.expanduser("~")
    full_path = os.path.join(home, directory)
    try:
        # if not fileName:
        #     return f"failed to create a folder. fileName not found!‌"
        items = os.listdir(full_path)
        # return f"full list directory of ths path: {full_path} is {items}"
        return items
    except Exception as e:
        return f"Failed to create file: {e}"


def check_criteria(data: str):
    parsed = json.loads(data)

    name = parsed.get("name")
    age = parsed.get("age")
    income = int(parsed.get("income"))
    married = parsed.get("married")

    if income > 20000:
        return "Passed"
