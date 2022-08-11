import {Box ,Text,Container,Input, Button , HStack , VStack } from '@chakra-ui/react';
import Message from './Components/Message';
import {app} from './firebase';
import { useState , useEffect  , useRef} from 'react';
import {signOut ,onAuthStateChanged ,signInWithPopup , getAuth , GoogleAuthProvider,signInWithEmailAndPassword } from 'firebase/auth';
import {query, orderBy,onSnapshot,addDoc, collection, getFirestore, serverTimestamp} from 'firebase/firestore';
import AdminArea from './Components/AdminArea';
// import {} from 'react-dom';



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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [wrong, setWrong] = useState(false);
  const [admin , setAdmin] = useState(false);
  const adminUID = 'GT6QYItg6UUuaj9z7MN0kbZ2Vjw1';
 
//   const createuser = (e)=>{
//     e.preventDefault()
//     createUserWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in 
//     const u = userCredential.user;
//     console.log(userCredential)
//     // ...
//   })
//   .catch((error) => {
//     // alert(error)
//     // ..
//     console.log(error)
//   });

// }


 const loginUser = (e)=>{
  e.preventDefault();
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const u = userCredential.user;
    console.log(u.uid)
    if(u.uid === adminUID)
      setAdmin(true); 
    else
      setAdmin(false)

  })
  .catch((error) => {
    setWrong(true);
    // console.log(error);
  });
 }



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
    <>
    {admin && <AdminArea logoutHandler={logoutHandler}/> 
      }
    {!admin &&<Box bg={'red.50'}>
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
      ):(
        <Container>

        <VStack justifyContent={'center'} h={'100vh'} bg={'cyan.50'}>
          <Text marginBottom={'32'} fontSize={'38'} fontWeight={'bold'}>Welcome to my chat-app</Text>
          <form onSubmit={loginUser}>
            
        <VStack>

          <Input placeholder='Enter your email address' onChange={(e)=>setEmail(e.target.value)}></Input>
          <Input placeholder='Enter your password' onChange={(e)=>setPassword(e.target.value)}></Input>
          <Button colorScheme={'purple'} type="submit">Login</Button>
          {wrong && <Text color={'red'}>Wrong email / password !!</Text>}
        </VStack>
          </form>
          <Text>OR</Text>
          <Button colorScheme={'purple'} style={{marginBottom: '30px'}} onClick={loginHandler}>Sign in with google</Button>
          {/* <Text>Already have an account ?</Text> */}
          

        </VStack>
        </Container>
        )
    }
  </Box>}

  </>

     );
}

export default App;
