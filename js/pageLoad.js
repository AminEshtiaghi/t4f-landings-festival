const checkLogin = () => {
    let current = window.location;

    axios
        .get("/auth/check", null)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.checked === true) {
              window.location.href = "./main.html";
            } else {
              window.location.href = "/login?_back="+current;
            }
          }

        }).catch((res) => {
            window.location = "/login?_back="+current;
        });
};

window.onload = checkLogin();