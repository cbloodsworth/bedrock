import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const NewPage: React.FC = () => {
  const [data, setData] = useState("");
  useEffect(() => {
    fetch("http://127.0.0.1:5000/backend")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error));
  }, []);
  return (
    <div>
      <h1>
        <Link to="/">Home</Link>
      </h1>
      <div>
        {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : "Loading..."}
      </div>
    </div>
  );
};

export default NewPage;
