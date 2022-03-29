const url = window.location.hostname.includes("localhost")
  ? "http://localhost:3000/api/auth/"
  : "https://restserver-basic-node-2.herokuapp.com/api/auth/";

function handleCredentialResponse(response) {
  // decodeJwtResponse() is a custom function defined by you
  // to decode the credential response.
  const body = { id_token: response.credential };
  fetch(url + "google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((resp) => resp.json())
    .then(({ token }) => {
      localStorage.setItem("token", token);
      window.location = "chat.html";
    })
    .catch((e) => console.log(e));
}

const button = document.getElementById("google_signout");
button.onclick = () => {
  console.log(google.accounts.id);
  google.accounts.id.disableAutoSelect();

  google.accounts.id.revoke(localStorage.getItem("email"), (done) => {
    localStorage.clear();
    location.reload();
  });
};

const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = {};
  for (const el of form.elements) {
    if (el.name.length > 0) {
      formData[el.name] = el.value;
    }
  }
  fetch(url + "login", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then(({ msg, token }) => {
      if (msg) {
        return console.error(msg);
      }
      localStorage.setItem("token", token);
      window.location = "chat.html";
    })
    .catch((err) => {
      console.log(err);
    });
});
