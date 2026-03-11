import React from "react";
import { useState } from "react";

export default function Login() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [message, setMessage] = useState("");

  const users: Record<string, string> = {
    jeon: "j0909/",
    admin: "j0909/",
  };

  const handleLogin = () => {
    if (users[id] === pw) {
      localStorage.setItem("username", id);
      window.location.href = "/match";
    } else {
      setMessage("Wrong ID or Password");
    }
  };

  return (
    <div
      style={{
        padding: "50px",
        textAlign: "center",
      }}
    >
      <h1>Login</h1>

      <input
        placeholder="ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        style={{
          fontSize: "22px",
          padding: "10px",
          width: "250px",
          marginBottom: "15px",
        }}
      />

      <br />

      <input
        type="password"
        placeholder="Password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        style={{
          fontSize: "22px",
          padding: "10px",
          width: "250px",
        }}
      />

      <br />
      <br />

      <button
        onClick={handleLogin}
        style={{
          fontSize: "22px",
          padding: "10px 30px",
        }}
      >
        Login
      </button>

      <p style={{ color: "red" }}>{message}</p>
    </div>
  );
}
