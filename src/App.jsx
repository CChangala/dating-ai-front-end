import './index.css';
import './App.css'
import {User,MessageCircle, X, Heart} from "lucide-react"


const ProfileSelector =()=>{
  return (
    <div className='rounded-lg bg-gray-100 p-4 overflow-hidden'>
        <div className='relative'> 
          <img src='http://127.0.0.1:8080/01f4c42f-86cb-45e6-ad2b-05430afb3639.jpg' />
          <div className='absolute bottom-0 left-0 right-0 text-white p-4 bg-gradient-to-t from-black-500 to-transparent'> 
             <h2 className='text-3xl font-bold'>Rahul Raj,23</h2>
          </div>
        </div>
        <div className='p-4'> 
             <p className='text-gray'>I'm a software developer blha blah blah blah blah </p>
        </div>
        <div className='flex justify-center space-x-4 items-center p-4'>
          <button className='bg-red-500 rounded-full p-4 text-white hover:bg-red-700' 
          onClick={()=>alert('You have clicked reject the button')}>
            <X size={24} />
          </button>
          <button className='bg-green-500 rounded-full p-4 text-white hover:bg-green-700'
          onClick={()=>alert('You have clicked heart the button')}>
            <Heart size={24} />
          </button>
        </div>
      </div>
  );
};

const Matches =()=>{

  return (
    <div className='rounded-lg shadow-lg p-4'>
    <h2 className='text-2xl font-bold'>Matches</h2>
    <ul>
    {[
      {id:1, firstName:'Rahul',lastName:"Raj", photo:"http://127.0.0.1:8080/01f4c42f-86cb-45e6-ad2b-05430afb3639.jpg"},
      {id:2, firstName:'Rahul',lastName:"sony", photo:"http://127.0.0.1:8080/03401693-2cfa-47f6-ba6a-5581c4791f65.jpg"},
    ].map((match) => (
      <li key={match.id} className='mb-2'>
          <button className='w-full flex items-center space-x-4 hover:bg-gray-200 p-4 rounded-lg'>
            <img src={match.photo
            } className='w-16 h-16 rounded-full'/>
            <span>
              <h3 className='font-bold'>{match.firstName} {match.lastName} </h3>
            </span>
          </button>
        </li>
    ))}
    </ul>
    
    </div>
  )
}
function App() {
  return (
    <>
      <div className='max-w-md mx-auto'>
        <nav className='flex justify-between items-center p-4 bg-gray-800 text-white'>
          <User />
          <MessageCircle/>
        </nav>
       {/* <ProfileSelector />*/}
        <Matches/>
      </div>
    </>
  )
}

export default App;
