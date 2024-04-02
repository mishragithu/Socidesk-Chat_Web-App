import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setAvatarRoute } from "../utils/APIRoutes";
import { Buffer } from "buffer";

export default function SetAvatar() {
    const api = "https://api.multiavatar.com/";
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const setProfilePicture = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("Chatt-user"));
            if (!user || !user._id) {
                // Handle case where user data is missing or incomplete
                toast.error("User data is missing. Please log in again.", toastOptions);
                navigate("/login");
                return;
            }
            if (selectedAvatar !== undefined) {
                const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
                    image: avatars[selectedAvatar],
                });
                if (data.isSet) {
                    user.isAvatarImageSet = true;
                    user.avatarImage = data.image;
                    localStorage.setItem("Chatt-user", JSON.stringify(user));
                    navigate("/login"); // Navigate to the login page after setting the avatar
                } else {
                    toast.error("Error setting avatar. Please try again", toastOptions);
                }
            } else {
                toast.error("Please select an avatar first.", toastOptions);
            }
        } catch (error) {
            console.error("Error setting avatar:", error);
            toast.error("Error setting avatar. Please try again later", toastOptions);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const avatarData = await axios.get(`${api}45678945`, { responseType: 'arraybuffer' });
                const avatarBuffer = Buffer.from(avatarData.data, 'binary').toString('base64');
                const avatarsPromises = Array.from({ length: 4 }, (_, i) => `${api}${Math.round(Math.random() * 1000)}`).map(async (url) => {
                    const image = await axios.get(url, { responseType: 'arraybuffer' });
                    const buffer = Buffer.from(image.data, 'binary').toString('base64');
                    return buffer;
                });
                const resolvedAvatars = await Promise.all(avatarsPromises);
                setAvatars(resolvedAvatars);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching avatars:", error);
                setIsLoading(false);
                toast.error("Failed to fetch avatars. Please try again later.", toastOptions);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <Container>
                <div className="title-container">
                    <h1>Pick an avatar profile picture</h1>
                </div>
                <div className="avatars">
                    {isLoading ? (
                        <img src={Loader} alt="Loader" className="loader" />
                    ) : (
                        avatars.map((avatar, index) => (
                            <div
                                className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
                                key={index}
                                onClick={() => setSelectedAvatar(index)}
                            >
                                <img
                                    src={`data:image/svg+xml;base64,${avatar}`}
                                    alt="avatar"
                                />
                            </div>
                        ))
                    )}
                </div>
                <button className="submit-btn" onClick={setProfilePicture}>Set as your Profile</button>
            </Container>
            <ToastContainer {...toastOptions} />
        </>
    );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: rgb(144, 238, 144);
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transitions: 0.5s ease-in-out;

      img {
        height: 6rem;
      }
    }
    .selected {
        border: 0.4rem solid #003300;
    }
  }
  .submit-btn {
    background-color:  #009900;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: 0.5s ease-in-out;
    &:hover{
        background-color: #003300;
    }
`;