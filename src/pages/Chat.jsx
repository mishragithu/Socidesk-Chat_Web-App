import React, { useState, useEffect,useRef } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import Contacts from "../components/Contacts"; 
import { allUsersRoute,host } from "../utils/APIRoutes";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";

function Chat() {
    const socket = useRef();
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]); 
    const [currentUser, setCurrentUser] = useState(undefined); 
    const [currentChat, setCurrentChat] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);
   
    useEffect(() => {
        console.log("Component rendered or updated");
    console.log("Current user:", currentUser);
        const fetchData = async () => {
            if (!localStorage.getItem("Chatt-user")) {
                console.log(localStorage.getItem("Chatt-user"));
                navigate("/login");
            } else {
                const user = JSON.parse(localStorage.getItem("Chatt-user"));
                console.log("Fetched User:", user); 
                setCurrentUser(user); 
                setIsLoaded(true);
            }
        };

        fetchData();
    }, [navigate]);

    useEffect (() => {
        if(currentUser) {
            socket.current = io(host);
            socket.current.emit("add-user" , currentUser._id);
        }
    }, [currentUser])
    useEffect(() => {
        const fetchContacts = async () => {
            if (currentUser) {
                try {
                    if (currentUser.isAvatarImageSet) {
                        const response = await fetch(`${allUsersRoute}/${currentUser._id}`);
                        if (!response.ok) {
                            throw new Error('Failed to fetch contacts');
                        }
                        const data = await response.json();
                        console.log("Fetched Contacts Data:", data); 
                        setContacts(data); 
                    } else {
                        navigate("/setAvatar");
                    }
                } catch (error) {
                    console.error("Error fetching contacts:", error);
                }
            }
        };

        fetchContacts();
    }, [currentUser, navigate]);
    const handleChatChange =(chat) => {
        setCurrentChat(chat);
    }

    return (
        <Container>
            <div className="container">
                <Contacts 
                contacts={contacts} 
                currentUser={currentUser} 
                changeChat={handleChatChange}
                />
                {isLoaded && currentChat===undefined ? (
                    <Welcome currentUser={currentUser}/>
                ) : (
                    <ChatContainer 
                    currentChat= {currentChat} 
                    currentUser={currentUser}
                    socket ={socket}
                    />
                )}
            </div>
        </Container>
    );
}


const Container = styled.div`
    
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: rgb(144, 238, 144);

    .container {
        border-radius:2rem;
        height: 85vh;
        width: 85vw;
        background-color:  #00000076;
        display: grid;
        grid-template-columns: 25% 75%;
        
        @media screen and (min-width: 720px) and (max-width: 1080px){
            grid-template-columns: 35% 65%;
        }
    }
`;

export default Chat;
