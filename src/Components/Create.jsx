import React,{useState} from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import {Text,Container,Input, Button ,  VStack } from '@chakra-ui/react';
import { Link, Navigate } from 'react-router-dom';
import {getAuth  } from 'firebase/auth';
import { app } from '../firebase';
const auth = getAuth(app)

const Create = () => {

    const [incorrect, setincorrect] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [created, setcreated] = useState(false)

    const createuser = (e)=>{
        e.preventDefault()
        createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        // const u = userCredential.user;
        // console.log(userCredential)
        setcreated(true)
        // ...
      })
      .catch((error) => {
        setincorrect(true)
        console.log(error)
      });
    
    }
  return (
    <Container>

        <VStack justifyContent={'center'} h={'100vh'} bg={'cyan.50'}>
          <Text marginBottom={'32'} fontSize={'38'} fontWeight={'bold'}>Welcome to my chat-app</Text>
          <form onSubmit={createuser}>
            
        <VStack>

          <Input placeholder='Enter your email address' onChange={(e)=>setEmail(e.target.value)}></Input>
          <Input placeholder='Enter your password' onChange={(e)=>setPassword(e.target.value)}></Input>
          <Button colorScheme={'purple'} type="submit">Create account</Button>
          {incorrect && <Text color={'red'}>Wrong email / password !!</Text>}
        </VStack>
          </form>
          <Text>Already have an account?</Text>
          <Link style={{color:'gray' }} to="/">Click here !!</Link>
          {created && <Navigate to="/"/>}

        </VStack>
        </Container>
  )
}

export default Create