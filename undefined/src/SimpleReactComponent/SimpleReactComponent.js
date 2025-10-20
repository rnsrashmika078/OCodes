import React, { useState } from "react";

function SimpleReactComponent() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loggedIN, setLoggedIn] = useState(false);

  function handleLogin() {
    // Add login functionality here
  }

  return (
    <div>
      <h1>{username}</h1>
      <p>Email: {email}</p>
      {loggedIN ? (
        <button onClick={handleLogin}>Logout</button>
      ) : (
        <button onClick={() => setLoggedIn(true)}>Login</button>
      )}
    </div>
  );
}

export default SimpleReactComponent;
