import React from 'react'
import {Box ,Text,Container,Input, Button , HStack , VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';


const Login = (loginUser , setEmail , setPassword,wrong, loginHandler) => {
  return (
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
          <Text>Don't have an account ?</Text>
          <Link to="/create">Create new account !!</Link>
          

        </VStack>
        </Container>
  )
}

export default Login