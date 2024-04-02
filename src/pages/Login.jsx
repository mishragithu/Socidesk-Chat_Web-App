import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from "../utils/APIRoutes";

function Login() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: "",
        password: "",
    });

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    useEffect(() => {
        console.log("Checking if user is already logged in...");
        if (localStorage.getItem("Chatt-user")) {
            console.log("User is already logged in, navigating to home page...");
            navigate("/");
        } else {
            console.log("User is not logged in.");
        }
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Form submitted");

        if (handleValidation()) {
            console.log("Form validation passed");

            const { password, username } = values;
            console.log("Logging in with username:", username);

            try {
                const result = await axios.post(loginRoute, {
                    username,
                    password,
                });
                const data = result.data;
                console.log("Login response data:", data);

                if (result.status === 200) {
                    console.log("Login successful");
                    localStorage.setItem("Chatt-user", JSON.stringify(data.user));
                    navigate("/");
                } else {
                    console.log("Login failed with status:", result.status);
                    toast.error(data.msg, toastOptions);
                }
            } catch (error) {
                console.error("Error during login:", error);
                toast.error("An error occurred during login", toastOptions);
            }
        } else {
            console.log("Form validation failed");
        }
    };

    const handleValidation = () => {
        const { password, username } = values;
        if (password === "" || username === "") {
            console.log("Validation failed: Username or password is empty");
            toast.error("Email and Password are required", toastOptions);
            return false;
        }
        return true;
    };

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    return (
        <>
            <FormContainer>
                <form onSubmit={(event) => handleSubmit(event)}>
                    <div className="brand">
                        <img src={Logo} alt="Logo" />
                        <h1>SociDesk</h1>
                    </div>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        onChange={(e) => handleChange(e)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={(e) => handleChange(e)}
                    />
                    <button type="submit">Login In</button>
                    <span>
                        Don't have an account? <Link to="/register">Register</Link>
                    </span>
                </form>
            </FormContainer>
            <ToastContainer />
        </>
    );
}

const FormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: rgb(144, 238, 144);

    .brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;

        img {
            height: 5rem;
        }

        h1 {
            color: white;
            text-transform: uppercase;
        }
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background-color: #00000076;
        border-radius: 2rem;
        padding: 3rem 5rem;

        input {
            background-color: #333;
            padding: 0.5rem;
            border: 0.1rem solid #b3ff66;
            border-radius: 0.4rem;
            color: white;
            width: 100%;
            font-size: 1rem;

            &:focus {
                border: 0.1rem solid #009900;
                outline: none;
            }
        }

        button {
            background-color: #009900;
            color: white;
            padding: 1rem 2rem;
            border: none;
            font-weight: bold;
            cursor: pointer;
            border-radius: 0.4rem;
            font-size: 1rem;
            text-transform: uppercase;
            transition: 0.5s ease-in-out;

            &:hover {
                background-color: #003300;
            }
        }

        span {
            color: white;
            text-transform: uppercase;

            a {
                color: #003300;
                text-decoration: none;
                font-weight: bold;
            }
        }
    }
`;

export default Login;
