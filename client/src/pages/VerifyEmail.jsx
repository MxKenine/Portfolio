import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("");

  async function validateEmail() {
    const response = await fetch(
      `http://localhost:3000/verify-email?token=${token}`,
    );
    const data = await response.json();
    setMessage(data.message);
  }

  useEffect(() => {
    validateEmail();
  }, []);

  return (
    <>
      {message}
      <Link to="/login">Connexion</Link>
    </>
  );
}
