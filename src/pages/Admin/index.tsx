import React, { type FormEvent } from "react";
import { userAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { session, signOutUser } = userAuth();
  const navigate = useNavigate();

  const handleSignOut = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await signOutUser();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      Dashboard
      <p>Welcome {session?.user?.email}</p>
      <form onSubmit={handleSignOut}>
        <button>Sign out</button>
      </form>
    </div>
  );
}
