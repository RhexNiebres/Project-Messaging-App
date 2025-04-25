import React from "react";
import NavBar from "../components/NavBar";
import ConversationList from "../components/ConversationList";
import AddConversation from "../components/AddConversation";

const Home = () => {
  const currentUserId = localStorage.getItem("userId");

  return (
    <>
      <NavBar />
      <div className="mt-20 bg-blue-500 p-7  flex flex-col justify-start gap-10 w-80 rounded-2xl mx-2">
        {/*Conversation Component */}
        <AddConversation currentUserId={currentUserId} />

        {/* Conversation List Component */}
        <ConversationList currentUserId={currentUserId} />

        {/* add messageBoard Component  if component is finished */}
        
      </div>
    </>
  );
};

export default Home;
