import './index.css';
import './App.css'
import {User,MessageCircle} from "lucide-react"


const ProfileSelector =()=>{
  return (
    <div className='rounded-lg bg-gray-100 p-4 overflow-hidden'>
        <div className='relative'> 
          <img src='https://randomuser.me/api/portraits' />
          <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 text-white'> 
             <h2>Chaitanya Changala</h2>
          </div>
        </div>
    </div>
  );
};

function App() {
  return (
    <>
      <div className='max-w-md mx-auto'>
        <nav className='flex justify-between items-center p-4 bg-gray-800 text-white'>
          <User />
          <MessageCircle />
        </nav>
        <ProfileSelector />
      </div>
    </>
  )
}

export default App;
