/* eslint-disable react/prop-types */
import './index.css';
import './App.css'
import {User,MessageCircle, X, Heart} from "lucide-react"
import  {useState, useEffect} from 'react';

const fetchProfile = async()=>{
  try{
    const response = await fetch('http://localhost:8080/profiles/random');
    if(!response.ok){
      throw new Error('Network response was not ok');
    }
    return response.json();
  }
  catch(error){
      console.error(error);
    }
}

const saveSwipe = async(profileId)=>{
  const response = await fetch('http://localhost:8080/matches',{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body: JSON.stringify({profileId})
  });
  if(!response.ok){
    throw new Error('Network response was not ok');
  }
}

const fetchMatches = async()=>{
  try{
    const response = await fetch('http://localhost:8080/matches');
    if(!response.ok){
      throw new Error('Network response was not ok');
    }
    return response.json();
  }
  catch(error){
    console.error(error);
  }
}

const postMessage = async(conversationId,message)=>{
  try{
    const response = await fetch(`http://localhost:8080/conversations/${conversationId}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          messageText : message,
          authorId : "user"
        })
      });
      if(!response.ok){
        throw new Error('Network response was not ok');
      }
  }
  catch(error){
    console.error(error);
  }
}

const fetchConversation = async(conversationId)=>{
  try{
    const response = await fetch(`http://localhost:8080/conversation/${conversationId}`);
    console.log(conversationId);
    if(!response.ok){
      throw new Error('Network response was not ok');
    }
    return response.json();
  }
  catch(error){
    console.error(error);
  }
}

const ProfileSelector =( ({profile, onSwipe})=>(
  console.log(profile),
  profile? (
    <div className='rounded-lg p-4 overflow-hidden bg-white shadow-lg'>
        <div className='relative'> 
          <img className='h-[60vh]' src={`http://127.0.0.1:8080/${profile.imageUrl}`}/>
          <div className='absolute bottom-0 left-0 right-0 text-white p-4 bg-gradient-to-t from-black to-transparent'> 
             <h2 className='text-3xl font-bold'>{profile.firstName} {profile.lastName}, {profile.age}</h2>
             <h3>{profile.ethnicity}</h3>
          </div>
        </div>
        <div className='p-4'> 
             <p className='text-gray'>{profile.bio} </p>
        </div>
        <div className='flex justify-center space-x-4 items-center p-4'>
          <button className='bg-red-500 rounded-full p-4 text-white hover:bg-red-700' 
          onClick={()=>onSwipe(profile.id,'left')}>
            <X size={24} />
          </button>
          <button className='bg-green-500 rounded-full p-4 text-white hover:bg-green-700'
          onClick={()=>onSwipe(profile.id,'right')}>
            <Heart size={24} />
          </button>
        </div>
      </div>
  )
  : (<div>Loading...</div>)
)
);

const Matches =({matches,onSelectMatch})=>{


  return (
    <div className='rounded-lg shadow-lg p-4'>
    <h2 className='text-2xl font-bold'>Matches</h2>
    <ul>
    {matches.map((match,index) => (
      <li key={index} className='mb-2'>
          <button className='w-full flex items-center space-x-4 hover:bg-gray-200 p-4 rounded-lg' onClick={()=>onSelectMatch(match.profile,match.conversationId)}>
            <img src={`http://127.0.0.1:8080/${match.profile.imageUrl}`} className='w-16 h-16 rounded-full'/>
            <span>
              <h3 className='font-bold'>{match.profile.firstName} {match.profile.lastName} </h3>
            </span>
          </button>
        </li>
    ))}
    </ul>
    
    </div>
  )
}


const ChatScreen =({currentMatch,conversation, refreshState,setCurrentMatchandChat})=>{
  const [input, setInput] = useState('');
 
  const handleSend = async () => {
    if (input.trim()) {
      const newMessage = {
        messageText: input,
        authorId: 'user',  
      };

      const optimisticConversation = {
        ...conversation,
        messages: [...conversation.messages, newMessage]
      };
  
      setCurrentMatchandChat(prevState => ({
        ...prevState,
        conversation: optimisticConversation
      }));
  
      setInput(''); 
  
      try {

        await postMessage(conversation.id, input);
        // Optionally, refresh the state if needed to ensure synchronization with the server
        refreshState();  // Assuming refreshState fetches and updates the entire conversation
      } catch (error) {
        console.error("Failed to send message:", error);
        // Optionally handle the error, e.g., notify the user, log errors, or roll back the optimistic update
      }
    }
  };
  


  return currentMatch?(
    <div className='rounded-lg h-[92vh] overflow-y-auto shadow-lg p-4'>
      <h2 className='text-2xl font-bold mb-4'>Chat with {currentMatch.firstName} {currentMatch.lastName}</h2>
      <div className='h-[70vh] border rounded overflow-y-auto mb-4 p-4'>
        {conversation.messages.map((message,index)=>(
          <div key={index} className={`flex ${message.authorId === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
          <div className={`flex items-end ${message.authorId === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {message.authorId === 'user' ? (<User size={15} />) : 
            (<img
              src={`http://127.0.0.1:8080/${currentMatch.imageUrl}`}
              className="w-5 h-5 rounded-full"
            />)}
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl ${
                message.authorId === 'user'
                  ? 'bg-blue-500 text-white ml-2'
                  : 'bg-gray-200 text-gray-800 mr-2'
              }`}
            >
              {message.messageText}
            </div>
          </div>
        </div>
        ))}
      </div>
      <div className='flex space-x-4'>
        <input type='text' 
          value={input} 
          onChange={(e)=>setInput(e.target.value)}
          className='border p-2 w-full' 
          placeholder='Type your message here'/>
        <button onClick={handleSend} className='bg-blue-500 text-white p-2 rounded'>Send</button>
        </div>
    </div>
  ): <div>Loading...</div>
}
function App() {

  const [currentState,setCurrentState] = useState('profile');
  const [currentProfile,setCurrentProfile] = useState(null);
  const [matches,setMatches] = useState([]);
  const [currentMatchandChat,setCurrentMatchandChat] = useState({
    match:null,
    conversation:[]
    });

  const loadRandomProfile = async()=>{
    const profile = await fetchProfile();
    setCurrentProfile(profile);
  }

  const loadMatches =async ()=>{
    const matches = await fetchMatches();
    setMatches(matches);
  }

  const onSwipe = async (profileId,direction)=>{
    loadRandomProfile();
    if(direction === 'right'){
      await saveSwipe(profileId);
      await loadMatches();
    } 
  }

  const refreshCurrentState = async()=>{
  try {
    const updatedConversation = await fetchConversation(currentMatchandChat.conversation.id);
    setCurrentMatchandChat(prev => ({
      ...prev,
      conversation: updatedConversation
    }));
  } catch (error) {
    console.error("Error refreshing the conversation:", error);
  }
};

  const onSelectMatch = async(profile,conversationId)=>{
    const conversation = await fetchConversation(conversationId);
    setCurrentMatchandChat({match:profile,conversation:conversation});
    setCurrentState('chat');
  }

  useEffect(()=>{
    loadRandomProfile();
    loadMatches();
  },[])

  const renderScreen= () =>{
    switch(currentState){
      case 'profile':
        return <ProfileSelector profile={currentProfile} onSwipe={onSwipe}/>
      case 'matches':
        return <Matches matches={matches} onSelectMatch={onSelectMatch}/>
      case 'chat':
        return <ChatScreen  
        refreshState ={refreshCurrentState} 
        currentMatch={currentMatchandChat.match} 
        conversation={currentMatchandChat.conversation}
        setCurrentMatchandChat={setCurrentMatchandChat}
        />
      default:
        return <ProfileSelector />
    }
  }

  return (
    <>
      <div className='max-w-md mx-auto'>
        <nav className='flex justify-between items-center p-4 bg-gray-800 text-white'>
          <User onClick={()=>setCurrentState('profile')} />
          <MessageCircle onClick ={() => setCurrentState('matches')}/>
        </nav>
        {renderScreen(currentState)}
      </div>
    </>
  )
}

export default App;
