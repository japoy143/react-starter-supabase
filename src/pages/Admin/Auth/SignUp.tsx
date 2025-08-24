import React, { useState, type FormEvent } from "react";
import supabase from "../../../supabase-client";
import { userAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorlog, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // const navigate = useNavigate();
  const { session, signUpNewUser } = userAuth();

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signUpNewUser(email, password);

      if (result.success) {
        //TODO:add modal or toast
      }
    } catch (error) {
      setError("an error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Sign Up here</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className={loading ? "bg-gray-600" : "bg-gray-300"}
        >
          Sign Up
        </button>
      </form>
      <small className=" text-red-400">{errorlog}</small>
    </div>
  );
}
