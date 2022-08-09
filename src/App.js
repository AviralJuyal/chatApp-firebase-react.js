import {Box ,Container,Input, Button , HStack , VStack } from '@chakra-ui/react';
import Message from './Components/Message';
import {app} from './firebase';
import { useState , useEffect  , useRef} from 'react';
import {signOut ,onAuthStateChanged ,signInWithPopup , getAuth , GoogleAuthProvider } from 'firebase/auth';
import {query, orderBy,onSnapshot,addDoc, collection, getFirestore, serverTimestamp} from 'firebase/firestore';


const db = getFirestore(app);
const auth = getAuth(app);

const logoutHandler = ()=>{
  signOut(auth);
}

const loginHandler = ()=>{
  const provider = new GoogleAuthProvider();
  
  signInWithPopup(auth , provider);
}

function App() {
  
  const [user, setuser] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const divForScroll = useRef(null)

  const submitHandler =async (e)=>{
    e.preventDefault();

    try {
      setMessage('')
      
      await addDoc(collection(db , 'Messages'),{
        text : message,
        uid : user.uid,
        uri : user.photoURL,
        createdAt : serverTimestamp(),
      });
      divForScroll.current.scrollIntoView({behavior:'smooth'})
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    const q = query(collection(db, 'Messages'), orderBy("createdAt" , "asc"))
    const unsubscribe = onAuthStateChanged(auth , (data)=>{
      setuser(data);
    })

    const unsubscribeSnap = onSnapshot(q,(snap)=>{
      setMessages(snap.docs.map((item)=>{
        const id = item.id;
        return {id , ...item.data()}
      }));    
    })

    return () => {
      unsubscribe();
      unsubscribeSnap();
    };
  }, [])
  

  return (

    <Box bg={'red.50'}>
    {
      user?(
        <Container h={"100vh"} bg={'white'} >
      <VStack h={'full'} paddingY={"4"}>
        <Button onClick={logoutHandler} colorScheme={"red"} w={'full'}>Logout</Button>

        <VStack  h={'full'} w={'full'} overflowY={'auto'} css={{"&::-webkit-scrollbar":{
          display: 'none'
        }}}>
          { messages.map((item) =>(
              <Message
               key={item.id}
               user={item.uid === user.uid?'me':'other'}
               uri = {item.uri}
                msg={item.text}
                />

            ))}
          <div ref={divForScroll}></div>
      </VStack>

          <form onSubmit={submitHandler} style={{width:'100%'}}>
          <HStack>
            <Input value={message} onChange={(e)=> setMessage(e.target.value)} placeholder='Enter a message'/>
            <Button type='submit' colorScheme={'purple'}>Send</Button>
          </HStack>
          </form>
        </VStack>
    </Container>
      ):<VStack justifyContent={'center'} h={'100vh'}>
          <Button colorScheme={'purple'} onClick={loginHandler}>Sign in with google</Button>
        </VStack>
    }
  </Box>
     );
}

export default App;
