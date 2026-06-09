const userName =
    localStorage.getItem("userName");

const userEmail =
    localStorage.getItem("userEmail");

if(userName){

    document.getElementById(
        "profileName"
    ).textContent = userName;
}

if(userEmail){

    document.getElementById(
        "profileEmail"
    ).textContent = userEmail;
}