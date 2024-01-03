import express from "express";

const app = express();

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// Handle Get request to fetch users
app.get("/users", async (req, res) => {
  //+req.query.limit => hx-val의 값,
  //+req => string을 number로 변환
  const limit = +req.query.limit || 10;

  setTimeout(async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users?_limit=${limit}`
    );
    const users = await response.json();

    res.send(`
      <h1 class="text-2xl font-bold my-4">Users</h1>
      <ul>
        ${users.map((user) => `<li>${user.name}</li>`).join("")}
      </ul>
      `);
  }, 2000);
});

// Handle Post request for temp conversion
app.post("/convert", (req, res) => {
  setTimeout(() => {
    // input name fahrenheit
    const fahrenheit = parseFloat(req.body.fahrenheit);
    const celsius = (fahrenheit - 32) * (5 / 9);
    res.send(
      `
        <p>
            ${fahrenheit} degrees Farenheit is equall to ${celsius} degrees Celsius
        </p>
        `
    );
  }, 2000);
});

// Handle Get request for ppolilng example

let counter = 0;

app.get("/poll", (req, res) => {
  counter++;
  const data = {
    value: counter,
  };
  res.json(data);
});

// Handle Get request for weather
let currentTemperature = 20;
app.get("/get-temperature", (req, res) => {
  currentTemperature += Math.random() * 2 - 1; // Random temp change
  res.send(currentTemperature.toFixed(1) + "'C");
});

// Handle Post request for contacts search

app.post("/search", async (req, res) => {
  const searchTerm = req.body.search.toLowerCase();
  if (!searchTerm) {
    return res.send("<tr></tr>");
  }
  const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
  const contacts = await response.json();

  const searchResults = contacts.filter((contact) => {
    const name = contact.name.toLowerCase();
    const email = contact.email.toLowerCase();
    return name.includes(searchTerm) || email.includes(searchTerm);
  });
  setTimeout(() => {
    const searchResultHtml = searchResults
      .map(
        (contact) => `
      <tr>
          <td><div class="my-4 p-2">${contact.name}</div></td>
          <td><div class="my-4 p-2">${contact.email}</div></td>
      </tr>
      `
      )
      .join("");
    res.send(searchResultHtml);
  }, 1000);
});

// Handle Post request for email vaildation
app.post("/contact/email", (req, res) => {
  const submittedEmail = req.body.email;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const isValid = {
    message: "Taht email is valid",
    class: "text-green-700",
  };

  const isInvalid = {
    message: "Please enter a valid email address",
    class: "text-red-700",
  };

  if (!emailRegex.test(submittedEmail)) {
    return res.send(
      `
        <div class="mb-6" hx-target="this" hx-swap="outerHTML">
            <label for="lastName" class="block text-gray-700 text-sm font-bold mb-2"
            >Email Address</label
            >
            <input
            type="email"
            hx-post="/contact/email"
            name="email"
            class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
            id="email"
            value="${submittedEmail}"
            required
            />
            <div class="${isInvalid.class}">${isInvalid.message}</div>
        </div>
        `
    );
  } else {
    return res.send(
      `
          <div class="mb-6" hx-target="this" hx-swap="outerHTML">
              <label for="lastName" class="block text-gray-700 text-sm font-bold mb-2"
              >Email Address</label
              >
              <input
              type="email"
              hx-post="/contact/email"
              name="email"
              class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
              id="email"
              value="${submittedEmail}"
              required
              />
              <div class="${isValid.class}">${isValid.message}</div>
          </div>
          `
    );
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
