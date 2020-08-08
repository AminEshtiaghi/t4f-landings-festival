const checkLogin = () => {
  axios
    .post("https://demo0719928.mockable.io/api/login", null)
    .then((res) => {
      if (res.status == 200) {
        if (res.data.auth == true) {
          window.location.href = "/t4f-referee.html";
        } else {
          window.location.href = "https://www.t4f.ir/login"
        }
      }
    })
};

window.onload = checkLogin()